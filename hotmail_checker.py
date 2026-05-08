#!/usr/bin/env python3
"""
Hotmail / Outlook Email List Checker
-------------------------------------
Reads a list of email addresses from a text file, validates their format,
resolves MX records, and performs SMTP-level verification against
Microsoft's mail servers.

Usage:
    python hotmail_checker.py emails.txt
    python hotmail_checker.py emails.txt -o results.txt
    python hotmail_checker.py emails.txt --threads 10 --timeout 15
"""

import argparse
import csv
import dns.resolver
import re
import smtplib
import socket
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import List, Optional


class Status(Enum):
    VALID = "valid"
    INVALID_FORMAT = "invalid_format"
    BAD_DOMAIN = "bad_domain"
    REJECTED = "rejected"
    UNKNOWN = "unknown"
    ERROR = "error"


VALID_DOMAINS = {
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
    "outlook.com",
    "outlook.fr",
    "outlook.de",
    "outlook.es",
    "outlook.it",
    "outlook.co.uk",
    "outlook.com.au",
    "outlook.com.br",
    "live.com",
    "live.co.uk",
    "live.fr",
    "live.de",
    "live.it",
    "live.nl",
    "live.com.au",
    "msn.com",
}

EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
)


@dataclass
class CheckResult:
    email: str
    status: Status
    detail: str = ""
    smtp_code: Optional[int] = None


_mx_cache: dict[str, list[str]] = {}


def resolve_mx(domain: str) -> list[str]:
    if domain in _mx_cache:
        return _mx_cache[domain]
    try:
        answers = dns.resolver.resolve(domain, "MX")
        hosts = [str(r.exchange).rstrip(".") for r in sorted(answers, key=lambda r: r.preference)]
        _mx_cache[domain] = hosts
        return hosts
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers, dns.exception.Timeout):
        _mx_cache[domain] = []
        return []


def check_email(email: str, timeout: int = 10, helo_domain: str = "check.local") -> CheckResult:
    email = email.strip().lower()

    if not EMAIL_RE.match(email):
        return CheckResult(email=email, status=Status.INVALID_FORMAT, detail="Malformed email address")

    _, domain = email.rsplit("@", 1)

    if domain not in VALID_DOMAINS:
        return CheckResult(
            email=email,
            status=Status.BAD_DOMAIN,
            detail=f"Domain '{domain}' is not a recognised Hotmail/Outlook domain",
        )

    mx_hosts = resolve_mx(domain)
    if not mx_hosts:
        return CheckResult(email=email, status=Status.BAD_DOMAIN, detail="No MX records found")

    last_error = ""
    for mx in mx_hosts:
        try:
            with smtplib.SMTP(timeout=timeout) as smtp:
                smtp.connect(mx, 25)
                smtp.ehlo(helo_domain)
                smtp.mail(f"probe@{helo_domain}")
                code, msg = smtp.rcpt(email)
                smtp.quit()

                if code == 250:
                    return CheckResult(email=email, status=Status.VALID, smtp_code=code, detail="Accepted by server")
                elif code == 550 or code == 551 or code == 553:
                    return CheckResult(email=email, status=Status.REJECTED, smtp_code=code, detail=msg.decode(errors="replace"))
                else:
                    return CheckResult(email=email, status=Status.UNKNOWN, smtp_code=code, detail=msg.decode(errors="replace"))
        except smtplib.SMTPServerDisconnected as exc:
            last_error = f"Server disconnected: {exc}"
        except smtplib.SMTPResponseException as exc:
            last_error = f"SMTP error {exc.smtp_code}: {exc.smtp_error}"
        except (socket.timeout, TimeoutError):
            last_error = "Connection timed out"
        except OSError as exc:
            last_error = str(exc)

    return CheckResult(email=email, status=Status.ERROR, detail=last_error)


def load_emails(path: Path) -> List[str]:
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    emails = [line.strip() for line in lines if line.strip() and not line.strip().startswith("#")]
    return emails


def write_results_txt(results: list[CheckResult], path: Path) -> None:
    with path.open("w", encoding="utf-8") as f:
        for r in results:
            f.write(f"{r.email} | {r.status.value} | {r.detail}\n")


def write_results_csv(results: list[CheckResult], path: Path) -> None:
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["email", "status", "smtp_code", "detail"])
        for r in results:
            writer.writerow([r.email, r.status.value, r.smtp_code or "", r.detail])


COLORS = {
    Status.VALID: "\033[92m",        # green
    Status.INVALID_FORMAT: "\033[91m",  # red
    Status.BAD_DOMAIN: "\033[91m",
    Status.REJECTED: "\033[91m",
    Status.UNKNOWN: "\033[93m",      # yellow
    Status.ERROR: "\033[93m",
}
RESET = "\033[0m"


def print_result(result: CheckResult, use_color: bool = True) -> None:
    tag = result.status.value.upper().ljust(15)
    if use_color:
        color = COLORS.get(result.status, "")
        print(f"  {color}[{tag}]{RESET} {result.email}  {result.detail}")
    else:
        print(f"  [{tag}] {result.email}  {result.detail}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check a list of Hotmail / Outlook email addresses via SMTP verification."
    )
    parser.add_argument("input", type=Path, help="Text file with one email per line")
    parser.add_argument("-o", "--output", type=Path, default=None, help="Write results to a file (.txt or .csv)")
    parser.add_argument("-t", "--threads", type=int, default=5, help="Number of concurrent checks (default: 5)")
    parser.add_argument("--timeout", type=int, default=10, help="SMTP connection timeout in seconds (default: 10)")
    parser.add_argument("--no-color", action="store_true", help="Disable coloured output")
    args = parser.parse_args()

    if not args.input.exists():
        print(f"Error: file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    emails = load_emails(args.input)
    if not emails:
        print("No email addresses found in the input file.", file=sys.stderr)
        sys.exit(1)

    print(f"\n  Loaded {len(emails)} email(s) from {args.input}\n")

    results: list[CheckResult] = []
    use_color = not args.no_color and sys.stdout.isatty()

    with ThreadPoolExecutor(max_workers=args.threads) as pool:
        future_map = {pool.submit(check_email, email, args.timeout): email for email in emails}
        for future in as_completed(future_map):
            result = future.result()
            results.append(result)
            print_result(result, use_color=use_color)

    results.sort(key=lambda r: r.email)

    counts = {}
    for r in results:
        counts[r.status] = counts.get(r.status, 0) + 1

    print(f"\n  {'─' * 50}")
    print(f"  Total checked : {len(results)}")
    for status in Status:
        if counts.get(status, 0):
            label = status.value.replace("_", " ").title()
            print(f"  {label.ljust(15)}: {counts[status]}")
    print()

    if args.output:
        if args.output.suffix == ".csv":
            write_results_csv(results, args.output)
        else:
            write_results_txt(results, args.output)
        print(f"  Results saved to {args.output}\n")


if __name__ == "__main__":
    main()
