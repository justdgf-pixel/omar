#!/usr/bin/env python3
"""
Hotmail / Outlook Email List Checker
-------------------------------------
Validates a list of Hotmail/Outlook addresses by:
  1. Syntax check (RFC-5321 local-part + known Microsoft domains)
  2. DNS MX-record lookup
  3. SMTP RCPT-TO probe (non-intrusive, no mail is sent)

Usage:
  python hotmail_checker.py emails.txt                 # default output to results/
  python hotmail_checker.py emails.txt -o my_results   # custom output dir
  python hotmail_checker.py emails.txt -w 50           # 50 concurrent workers
  python hotmail_checker.py emails.txt --timeout 15    # 15s SMTP timeout
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import dns.resolver
import os
import re
import socket
import sys
import time
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Optional

try:
    from colorama import Fore, Style, init as colorama_init

    colorama_init(autoreset=True)
except ImportError:
    class _Stub:
        def __getattr__(self, _):
            return ""
    Fore = Style = _Stub()


MICROSOFT_DOMAINS = {
    "hotmail.com",
    "hotmail.co.uk",
    "hotmail.fr",
    "hotmail.de",
    "hotmail.it",
    "hotmail.es",
    "hotmail.nl",
    "hotmail.be",
    "hotmail.ca",
    "hotmail.com.au",
    "hotmail.com.br",
    "hotmail.com.ar",
    "hotmail.co.jp",
    "hotmail.co.th",
    "hotmail.co.id",
    "hotmail.cl",
    "hotmail.co.za",
    "hotmail.com.tw",
    "hotmail.com.hk",
    "hotmail.com.sg",
    "hotmail.com.mx",
    "hotmail.com.tr",
    "hotmail.my",
    "hotmail.ph",
    "hotmail.dk",
    "hotmail.no",
    "hotmail.fi",
    "hotmail.se",
    "hotmail.gr",
    "hotmail.cz",
    "hotmail.hu",
    "hotmail.ro",
    "hotmail.sk",
    "hotmail.rs",
    "outlook.com",
    "outlook.fr",
    "outlook.de",
    "outlook.es",
    "outlook.it",
    "outlook.co.uk",
    "outlook.com.au",
    "outlook.com.br",
    "outlook.co.jp",
    "outlook.co.id",
    "outlook.co.th",
    "outlook.com.tr",
    "outlook.com.ar",
    "outlook.sa",
    "outlook.com.vn",
    "outlook.my",
    "outlook.ph",
    "outlook.sg",
    "outlook.at",
    "outlook.be",
    "outlook.cl",
    "outlook.co.nz",
    "outlook.co.za",
    "outlook.cz",
    "outlook.dk",
    "outlook.hu",
    "outlook.ie",
    "outlook.in",
    "outlook.kr",
    "outlook.lv",
    "outlook.pt",
    "outlook.sk",
    "live.com",
    "live.co.uk",
    "live.fr",
    "live.de",
    "live.it",
    "live.nl",
    "live.be",
    "live.ca",
    "live.com.au",
    "live.com.mx",
    "live.com.ar",
    "live.com.br",
    "live.co.za",
    "live.cl",
    "live.dk",
    "live.se",
    "live.no",
    "live.at",
    "live.ie",
    "live.in",
    "live.jp",
    "live.hk",
    "live.com.sg",
    "live.com.my",
    "live.com.ph",
    "live.co.kr",
    "msn.com",
    "msn.co.uk",
    "msn.cn",
}

LOCAL_PART_RE = re.compile(
    r"^[a-zA-Z0-9](?:[a-zA-Z0-9._\-+])*[a-zA-Z0-9]$|^[a-zA-Z0-9]$"
)


class Status(str, Enum):
    VALID = "valid"
    INVALID_FORMAT = "invalid_format"
    UNKNOWN_DOMAIN = "unknown_domain"
    NO_MX = "no_mx"
    SMTP_REJECTED = "smtp_rejected"
    SMTP_ERROR = "smtp_error"
    TIMEOUT = "timeout"
    CATCH_ALL = "catch_all"
    UNKNOWN = "unknown"


@dataclass
class CheckResult:
    email: str
    status: Status
    detail: str = ""
    mx_host: str = ""
    smtp_code: int = 0
    elapsed_ms: int = 0


@dataclass
class Stats:
    total: int = 0
    valid: int = 0
    invalid: int = 0
    unknown: int = 0
    errors: int = 0
    start_time: float = field(default_factory=time.time)

    @property
    def elapsed(self) -> float:
        return time.time() - self.start_time

    @property
    def rate(self) -> float:
        e = self.elapsed
        return self.total / e if e > 0 else 0.0


MX_CACHE: dict[str, list[str]] = {}


def validate_format(email: str) -> tuple[bool, str]:
    email = email.strip().lower()
    if not email or "@" not in email:
        return False, "missing @"
    parts = email.split("@")
    if len(parts) != 2:
        return False, "multiple @ signs"
    local, domain = parts
    if not local:
        return False, "empty local part"
    if not domain:
        return False, "empty domain"
    if len(local) > 64:
        return False, "local part too long"
    if len(domain) > 255:
        return False, "domain too long"
    if not LOCAL_PART_RE.match(local):
        return False, "invalid characters in local part"
    return True, ""


def is_microsoft_domain(domain: str) -> bool:
    return domain.lower() in MICROSOFT_DOMAINS


def resolve_mx(domain: str) -> list[str]:
    if domain in MX_CACHE:
        return MX_CACHE[domain]
    try:
        answers = dns.resolver.resolve(domain, "MX")
        hosts = sorted(answers, key=lambda r: r.preference)
        result = [str(r.exchange).rstrip(".") for r in hosts]
        MX_CACHE[domain] = result
        return result
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers):
        MX_CACHE[domain] = []
        return []
    except Exception:
        MX_CACHE[domain] = []
        return []


async def smtp_check(email: str, mx_host: str, timeout: int = 10) -> tuple[int, str]:
    """
    Open a raw SMTP session and issue HELO / MAIL FROM / RCPT TO
    to probe whether the mailbox exists.  Returns (smtp_code, message).
    """
    reader: Optional[asyncio.StreamReader] = None
    writer: Optional[asyncio.StreamWriter] = None
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(mx_host, 25), timeout=timeout
        )

        async def _read() -> tuple[int, str]:
            data = await asyncio.wait_for(reader.readline(), timeout=timeout)
            line = data.decode(errors="replace").strip()
            code = int(line[:3]) if len(line) >= 3 and line[:3].isdigit() else 0
            return code, line

        async def _send(cmd: str) -> tuple[int, str]:
            writer.write(f"{cmd}\r\n".encode())
            await writer.drain()
            return await _read()

        code, banner = await _read()
        if code != 220:
            return code, f"bad banner: {banner}"

        hostname = socket.getfqdn()
        code, resp = await _send(f"HELO {hostname}")
        if code != 250:
            return code, f"HELO rejected: {resp}"

        code, resp = await _send("MAIL FROM:<check@verify.local>")
        if code != 250:
            return code, f"MAIL FROM rejected: {resp}"

        code, resp = await _send(f"RCPT TO:<{email}>")
        await _send("QUIT")
        return code, resp

    except asyncio.TimeoutError:
        return -1, "timeout"
    except (ConnectionRefusedError, ConnectionResetError, OSError) as exc:
        return -2, str(exc)
    finally:
        if writer:
            try:
                writer.close()
                await writer.wait_closed()
            except Exception:
                pass


async def check_email(email: str, timeout: int = 10) -> CheckResult:
    t0 = time.time()
    email = email.strip().lower()

    ok, reason = validate_format(email)
    if not ok:
        return CheckResult(email, Status.INVALID_FORMAT, reason,
                           elapsed_ms=int((time.time() - t0) * 1000))

    domain = email.split("@")[1]
    if not is_microsoft_domain(domain):
        return CheckResult(email, Status.UNKNOWN_DOMAIN,
                           f"{domain} is not a known Microsoft domain",
                           elapsed_ms=int((time.time() - t0) * 1000))

    mx_hosts = resolve_mx(domain)
    if not mx_hosts:
        return CheckResult(email, Status.NO_MX, f"no MX records for {domain}",
                           elapsed_ms=int((time.time() - t0) * 1000))

    mx = mx_hosts[0]
    code, msg = await smtp_check(email, mx, timeout=timeout)
    elapsed = int((time.time() - t0) * 1000)

    if code == 250:
        return CheckResult(email, Status.VALID, msg, mx, code, elapsed)
    elif code == -1:
        return CheckResult(email, Status.TIMEOUT, msg, mx, code, elapsed)
    elif code < 0:
        return CheckResult(email, Status.SMTP_ERROR, msg, mx, code, elapsed)
    elif 500 <= code <= 599:
        return CheckResult(email, Status.SMTP_REJECTED, msg, mx, code, elapsed)
    else:
        return CheckResult(email, Status.UNKNOWN, msg, mx, code, elapsed)


def load_emails(path: str) -> list[str]:
    p = Path(path)
    if not p.exists():
        print(f"{Fore.RED}File not found: {path}{Style.RESET_ALL}")
        sys.exit(1)
    raw = p.read_text(encoding="utf-8", errors="replace")
    emails: list[str] = []
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "," in line:
            emails.extend(e.strip() for e in line.split(",") if e.strip())
        elif ";" in line:
            emails.extend(e.strip() for e in line.split(";") if e.strip())
        elif "\t" in line:
            emails.extend(e.strip() for e in line.split("\t") if e.strip())
        else:
            emails.append(line)
    return emails


def status_color(status: Status) -> str:
    return {
        Status.VALID: Fore.GREEN,
        Status.INVALID_FORMAT: Fore.RED,
        Status.UNKNOWN_DOMAIN: Fore.YELLOW,
        Status.NO_MX: Fore.RED,
        Status.SMTP_REJECTED: Fore.RED,
        Status.SMTP_ERROR: Fore.YELLOW,
        Status.TIMEOUT: Fore.YELLOW,
        Status.CATCH_ALL: Fore.CYAN,
        Status.UNKNOWN: Fore.YELLOW,
    }.get(status, "")


def print_result(result: CheckResult, idx: int, total: int) -> None:
    color = status_color(result.status)
    tag = result.status.value.upper().ljust(15)
    print(
        f"  [{idx:>{len(str(total))}}/{total}] "
        f"{color}{tag}{Style.RESET_ALL} "
        f"{result.email:<40} "
        f"{result.elapsed_ms:>5}ms  {result.detail}"
    )


def write_results(results: list[CheckResult], output_dir: str) -> None:
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)

    valid = [r for r in results if r.status == Status.VALID]
    invalid = [r for r in results if r.status in (
        Status.INVALID_FORMAT, Status.UNKNOWN_DOMAIN, Status.NO_MX, Status.SMTP_REJECTED
    )]
    unknown = [r for r in results if r not in valid and r not in invalid]

    (out / "valid.txt").write_text("\n".join(r.email for r in valid) + "\n")
    (out / "invalid.txt").write_text("\n".join(r.email for r in invalid) + "\n")
    (out / "unknown.txt").write_text("\n".join(r.email for r in unknown) + "\n")

    with open(out / "full_report.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["email", "status", "detail", "mx_host", "smtp_code", "elapsed_ms"])
        for r in results:
            w.writerow([r.email, r.status.value, r.detail, r.mx_host, r.smtp_code, r.elapsed_ms])

    print(f"\n  {Fore.CYAN}Results saved to {out.resolve()}{Style.RESET_ALL}")
    print(f"    valid.txt       ({len(valid)} emails)")
    print(f"    invalid.txt     ({len(invalid)} emails)")
    print(f"    unknown.txt     ({len(unknown)} emails)")
    print(f"    full_report.csv ({len(results)} rows)")


async def run(
    input_files: list[str],
    output_dir: str,
    workers: int,
    timeout: int,
) -> None:
    all_emails: list[str] = []
    for path in input_files:
        all_emails.extend(load_emails(path))

    if not all_emails:
        print(f"{Fore.RED}No emails found in the provided file(s).{Style.RESET_ALL}")
        sys.exit(1)

    unique = list(dict.fromkeys(all_emails))
    dupes = len(all_emails) - len(unique)

    print(f"\n{Fore.CYAN}{'=' * 60}")
    print(f"  Hotmail / Outlook List Checker")
    print(f"{'=' * 60}{Style.RESET_ALL}")
    print(f"  Emails loaded : {len(all_emails)}")
    if dupes:
        print(f"  Duplicates    : {dupes} (removed)")
    print(f"  Unique        : {len(unique)}")
    print(f"  Workers       : {workers}")
    print(f"  SMTP timeout  : {timeout}s")
    print(f"{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}\n")

    stats = Stats()
    results: list[CheckResult] = []
    sem = asyncio.Semaphore(workers)

    async def _worker(email: str, idx: int) -> None:
        async with sem:
            result = await check_email(email, timeout=timeout)
            results.append(result)
            stats.total += 1
            if result.status == Status.VALID:
                stats.valid += 1
            elif result.status in (Status.INVALID_FORMAT, Status.UNKNOWN_DOMAIN,
                                   Status.NO_MX, Status.SMTP_REJECTED):
                stats.invalid += 1
            elif result.status in (Status.SMTP_ERROR, Status.TIMEOUT):
                stats.errors += 1
            else:
                stats.unknown += 1
            print_result(result, idx, len(unique))

    tasks = [_worker(email, i + 1) for i, email in enumerate(unique)]
    await asyncio.gather(*tasks)

    results.sort(key=lambda r: (r.status.value, r.email))

    print(f"\n{Fore.CYAN}{'=' * 60}")
    print(f"  Summary")
    print(f"{'=' * 60}{Style.RESET_ALL}")
    print(f"  {Fore.GREEN}Valid        : {stats.valid}{Style.RESET_ALL}")
    print(f"  {Fore.RED}Invalid      : {stats.invalid}{Style.RESET_ALL}")
    print(f"  {Fore.YELLOW}Unknown      : {stats.unknown}{Style.RESET_ALL}")
    print(f"  {Fore.YELLOW}Errors       : {stats.errors}{Style.RESET_ALL}")
    print(f"  Time         : {stats.elapsed:.1f}s ({stats.rate:.1f} emails/s)")
    print(f"{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}")

    write_results(results, output_dir)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check validity of Hotmail / Outlook email lists",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
examples:
  python hotmail_checker.py emails.txt
  python hotmail_checker.py list1.txt list2.txt -o output
  python hotmail_checker.py emails.txt -w 100 --timeout 15
        """,
    )
    parser.add_argument(
        "files", nargs="+", help="Text file(s) containing email addresses (one per line)"
    )
    parser.add_argument(
        "-o", "--output", default="results", help="Output directory (default: results/)"
    )
    parser.add_argument(
        "-w", "--workers", type=int, default=30,
        help="Number of concurrent workers (default: 30)",
    )
    parser.add_argument(
        "--timeout", type=int, default=10,
        help="SMTP connection timeout in seconds (default: 10)",
    )
    args = parser.parse_args()
    asyncio.run(run(args.files, args.output, args.workers, args.timeout))


if __name__ == "__main__":
    main()
