#!/usr/bin/env python3
"""
Hotmail List Checker
Validates Hotmail/Outlook email addresses from one or more list files.

Checks performed:
  1. Email format validation (RFC 5322)
  2. Domain verification (must be hotmail.*/outlook.*/live.*)
  3. DNS MX record lookup
  4. SMTP mailbox verification (RCPT TO probe)
"""

import argparse
import csv
import dns.resolver
import os
import re
import smtplib
import socket
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Optional


class Status(Enum):
    VALID = "valid"
    INVALID_FORMAT = "invalid_format"
    NOT_HOTMAIL = "not_hotmail"
    NO_MX = "no_mx"
    SMTP_REJECTED = "smtp_rejected"
    SMTP_ERROR = "smtp_error"
    TIMEOUT = "timeout"
    UNKNOWN = "unknown"


HOTMAIL_DOMAINS = {
    "hotmail.com", "hotmail.co.uk", "hotmail.fr", "hotmail.de",
    "hotmail.it", "hotmail.es", "hotmail.be", "hotmail.nl",
    "hotmail.ca", "hotmail.com.au", "hotmail.com.br", "hotmail.co.jp",
    "hotmail.co.th", "hotmail.co.id", "hotmail.co.kr", "hotmail.com.ar",
    "hotmail.com.mx", "hotmail.com.tr", "hotmail.com.tw",
    "outlook.com", "outlook.co.uk", "outlook.fr", "outlook.de",
    "outlook.it", "outlook.es", "outlook.com.au", "outlook.com.br",
    "outlook.jp", "outlook.kr", "outlook.sa", "outlook.com.tr",
    "live.com", "live.co.uk", "live.fr", "live.de", "live.it",
    "live.be", "live.nl", "live.ca", "live.com.au", "live.com.mx",
    "live.com.ar", "live.com.br", "live.jp",
    "msn.com",
}

EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
)


@dataclass
class CheckResult:
    email: str
    status: Status
    source_file: str
    detail: str = ""


def is_hotmail_domain(domain: str) -> bool:
    return domain.lower() in HOTMAIL_DOMAINS


def validate_format(email: str) -> bool:
    return bool(EMAIL_RE.match(email))


def get_mx_hosts(domain: str) -> list[str]:
    try:
        answers = dns.resolver.resolve(domain, "MX")
        hosts = sorted(answers, key=lambda r: r.preference)
        return [str(r.exchange).rstrip(".") for r in hosts]
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN,
            dns.resolver.NoNameservers, dns.resolver.Timeout):
        return []


def smtp_check(email: str, mx_host: str, timeout: int = 10,
               helo_domain: str = "check.local") -> tuple[Status, str]:
    try:
        with smtplib.SMTP(timeout=timeout) as smtp:
            smtp.connect(mx_host, 25)
            smtp.ehlo(helo_domain)
            code, msg = smtp.mail("")
            if code >= 400:
                return Status.SMTP_ERROR, f"MAIL FROM rejected: {code} {msg}"
            code, msg = smtp.rcpt(email)
            smtp.quit()
            if code == 250:
                return Status.VALID, "Accepted"
            elif code == 550:
                return Status.SMTP_REJECTED, f"Mailbox not found: {code}"
            else:
                return Status.UNKNOWN, f"RCPT TO response: {code} {msg}"
    except smtplib.SMTPServerDisconnected:
        return Status.SMTP_ERROR, "Server disconnected"
    except smtplib.SMTPConnectError as e:
        return Status.SMTP_ERROR, f"Connection error: {e}"
    except socket.timeout:
        return Status.TIMEOUT, "SMTP connection timed out"
    except OSError as e:
        return Status.SMTP_ERROR, f"Network error: {e}"


def check_email(email: str, source_file: str, smtp_verify: bool = True,
                timeout: int = 10) -> CheckResult:
    email = email.strip().lower()

    if not validate_format(email):
        return CheckResult(email, Status.INVALID_FORMAT, source_file,
                           "Does not match email pattern")

    _, domain = email.rsplit("@", 1)

    if not is_hotmail_domain(domain):
        return CheckResult(email, Status.NOT_HOTMAIL, source_file,
                           f"Domain '{domain}' is not a Hotmail/Outlook/Live domain")

    mx_hosts = get_mx_hosts(domain)
    if not mx_hosts:
        return CheckResult(email, Status.NO_MX, source_file,
                           f"No MX records for {domain}")

    if not smtp_verify:
        return CheckResult(email, Status.VALID, source_file,
                           "Format & MX OK (SMTP check skipped)")

    for mx in mx_hosts[:2]:
        status, detail = smtp_check(email, mx, timeout=timeout)
        if status == Status.VALID:
            return CheckResult(email, status, source_file, detail)
        if status == Status.SMTP_REJECTED:
            return CheckResult(email, status, source_file, detail)

    return CheckResult(email, status, source_file, detail)


def load_emails(filepath: str) -> list[str]:
    path = Path(filepath)
    if not path.exists():
        print(f"[!] File not found: {filepath}", file=sys.stderr)
        return []

    emails = []
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = re.split(r"[;,\t|:]+", line)
            for part in parts:
                part = part.strip()
                if "@" in part:
                    emails.append(part)
    return emails


def write_results(results: list[CheckResult], output_path: str,
                  fmt: str = "csv") -> None:
    if fmt == "csv":
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["email", "status", "detail", "source_file"])
            for r in results:
                writer.writerow([r.email, r.status.value, r.detail,
                                 r.source_file])
    else:
        with open(output_path, "w", encoding="utf-8") as f:
            for r in results:
                f.write(f"{r.email} | {r.status.value} | {r.detail} | "
                        f"{r.source_file}\n")


def print_summary(results: list[CheckResult]) -> None:
    total = len(results)
    by_status: dict[Status, int] = {}
    for r in results:
        by_status[r.status] = by_status.get(r.status, 0) + 1

    print("\n" + "=" * 60)
    print(f"  RESULTS SUMMARY  ({total} emails checked)")
    print("=" * 60)
    for s in Status:
        count = by_status.get(s, 0)
        if count:
            pct = count / total * 100
            bar = "#" * int(pct / 2)
            print(f"  {s.value:<18} {count:>6}  ({pct:5.1f}%)  {bar}")
    print("=" * 60)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Check validity of Hotmail/Outlook/Live email lists.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
examples:
  %(prog)s list1.txt list2.txt
  %(prog)s emails/*.txt -o results.csv --threads 20
  %(prog)s list.txt --no-smtp --format txt
""",
    )
    p.add_argument("files", nargs="+",
                    help="One or more files containing email addresses")
    p.add_argument("-o", "--output", default="results.csv",
                   help="Output file path (default: results.csv)")
    p.add_argument("-f", "--format", choices=["csv", "txt"], default="csv",
                   help="Output format (default: csv)")
    p.add_argument("-t", "--threads", type=int, default=10,
                   help="Max concurrent checks (default: 10)")
    p.add_argument("--timeout", type=int, default=10,
                   help="SMTP timeout in seconds (default: 10)")
    p.add_argument("--no-smtp", action="store_true",
                   help="Skip SMTP verification (format + MX only)")
    p.add_argument("--delay", type=float, default=0,
                   help="Delay between checks in seconds (default: 0)")
    return p


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    all_emails: list[tuple[str, str]] = []
    for filepath in args.files:
        emails = load_emails(filepath)
        print(f"[*] Loaded {len(emails)} emails from {filepath}")
        for e in emails:
            all_emails.append((e, filepath))

    if not all_emails:
        print("[!] No emails found in the provided files.", file=sys.stderr)
        sys.exit(1)

    seen: set[str] = set()
    unique: list[tuple[str, str]] = []
    for email, src in all_emails:
        key = email.strip().lower()
        if key not in seen:
            seen.add(key)
            unique.append((email, src))

    dupes = len(all_emails) - len(unique)
    if dupes:
        print(f"[*] Removed {dupes} duplicate(s). Checking {len(unique)} "
              f"unique emails.")

    results: list[CheckResult] = []

    def _check(item: tuple[str, str]) -> CheckResult:
        email, src = item
        result = check_email(email, src, smtp_verify=not args.no_smtp,
                             timeout=args.timeout)
        if args.delay > 0:
            time.sleep(args.delay)
        return result

    print(f"[*] Checking with {args.threads} threads "
          f"(smtp={'off' if args.no_smtp else 'on'})...")

    with ThreadPoolExecutor(max_workers=args.threads) as pool:
        futures = {pool.submit(_check, item): item for item in unique}
        done = 0
        for future in as_completed(futures):
            result = future.result()
            results.append(result)
            done += 1
            icon = "+" if result.status == Status.VALID else "-"
            if done % 50 == 0 or done == len(unique):
                print(f"  [{done}/{len(unique)}] processed")

    results.sort(key=lambda r: (r.status.value, r.email))

    write_results(results, args.output, fmt=args.format)
    print(f"\n[*] Results saved to {args.output}")
    print_summary(results)


if __name__ == "__main__":
    main()
