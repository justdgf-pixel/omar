#!/usr/bin/env python3
"""
Bulk checker for Hotmail-family email lists.

This script safely validates list entries without attempting to log in to any
account. It can handle plain email lists and combo-style lines (e.g.
"email@example.com:password") by extracting the first email found in each line.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import Counter
from pathlib import Path

HOTMAIL_FAMILY_DOMAINS = {
    "hotmail.com",
    "hotmail.co.uk",
    "hotmail.fr",
    "hotmail.de",
    "hotmail.it",
    "hotmail.es",
    "hotmail.com.br",
    "outlook.com",
    "live.com",
    "msn.com",
}

EMAIL_PATTERN = re.compile(
    r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}",
)
STRICT_EMAIL_PATTERN = re.compile(
    r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$",
)


def extract_email(text: str) -> str | None:
    """Extract the first email-looking token from a line."""
    match = EMAIL_PATTERN.search(text)
    if not match:
        return None
    return match.group(0).strip().lower()


def classify_domain(domain: str) -> str:
    if domain in HOTMAIL_FAMILY_DOMAINS:
        return "hotmail_family"
    return "other_domain"


def process_lines(lines: list[str]) -> tuple[list[dict[str, str]], Counter]:
    seen: set[str] = set()
    rows: list[dict[str, str]] = []
    summary: Counter = Counter()

    for line_number, line in enumerate(lines, start=1):
        source = line.rstrip("\n")
        email = extract_email(source)

        if not source.strip():
            summary["skipped_blank"] += 1
            continue

        if not email or not STRICT_EMAIL_PATTERN.match(email):
            rows.append(
                {
                    "line": str(line_number),
                    "source": source,
                    "email": "",
                    "domain": "",
                    "status": "invalid_email",
                }
            )
            summary["invalid_email"] += 1
            continue

        domain = email.split("@", 1)[1]
        if email in seen:
            rows.append(
                {
                    "line": str(line_number),
                    "source": source,
                    "email": email,
                    "domain": domain,
                    "status": "duplicate",
                }
            )
            summary["duplicate"] += 1
            continue

        seen.add(email)
        status = classify_domain(domain)
        rows.append(
            {
                "line": str(line_number),
                "source": source,
                "email": email,
                "domain": domain,
                "status": status,
            }
        )
        summary[status] += 1

    summary["processed"] = len(rows)
    return rows, summary


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    fieldnames = ["line", "source", "email", "domain", "status"]
    with path.open("w", newline="", encoding="utf-8") as file_obj:
        writer = csv.DictWriter(file_obj, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_hotmail_only(path: Path, rows: list[dict[str, str]]) -> int:
    hotmail_emails = [row["email"] for row in rows if row["status"] == "hotmail_family"]
    with path.open("w", encoding="utf-8") as file_obj:
        for email in hotmail_emails:
            file_obj.write(f"{email}\n")
    return len(hotmail_emails)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Validate a list of email entries and identify Hotmail-family "
            "addresses safely (no account login checks)."
        )
    )
    parser.add_argument(
        "-i",
        "--input",
        required=True,
        help="Path to input file containing one entry per line.",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="hotmail_check_results.csv",
        help="Path to CSV output report (default: hotmail_check_results.csv).",
    )
    parser.add_argument(
        "--hotmail-only-output",
        help="Optional path to write only unique valid Hotmail-family emails.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    lines = input_path.read_text(encoding="utf-8", errors="ignore").splitlines()
    rows, summary = process_lines(lines)

    output_path = Path(args.output)
    write_csv(output_path, rows)

    print(f"Report written: {output_path}")
    print(f"Processed entries: {summary['processed']}")
    print(f"Hotmail-family valid: {summary['hotmail_family']}")
    print(f"Other valid domains: {summary['other_domain']}")
    print(f"Duplicates: {summary['duplicate']}")
    print(f"Invalid emails: {summary['invalid_email']}")
    print(f"Blank lines skipped: {summary['skipped_blank']}")

    if args.hotmail_only_output:
        hotmail_out_path = Path(args.hotmail_only_output)
        count = write_hotmail_only(hotmail_out_path, rows)
        print(f"Hotmail-only list written: {hotmail_out_path} ({count} emails)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
