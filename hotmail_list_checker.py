#!/usr/bin/env python3
"""
Hotmail list checker.

This tool validates a list of emails and reports:
1) format validity,
2) whether the email belongs to allowed Microsoft/Hotmail domains,
3) duplicates in the same input list.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

# Practical email regex (kept intentionally simple for CLI checks).
EMAIL_RE = re.compile(
    r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$"
)

DEFAULT_DOMAINS = {
    "hotmail.com",
    "outlook.com",
    "live.com",
    "msn.com",
    "hotmail.co.uk",
}


@dataclass
class Result:
    input_value: str
    normalized_email: str
    status: str
    reason: str


def parse_domains(raw: str | None) -> set[str]:
    if not raw:
        return set(DEFAULT_DOMAINS)
    domains = {item.strip().lower() for item in raw.split(",") if item.strip()}
    if not domains:
        raise ValueError("Domain list cannot be empty.")
    return domains


def read_emails(input_file: Path) -> list[str]:
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_file}")
    lines = input_file.read_text(encoding="utf-8").splitlines()
    return [line.strip() for line in lines if line.strip()]


def check_emails(emails: list[str], allowed_domains: set[str]) -> list[Result]:
    lowered = [email.lower() for email in emails]
    counts = Counter(lowered)

    results: list[Result] = []
    for raw in emails:
        normalized = raw.lower()
        if not EMAIL_RE.match(normalized):
            results.append(
                Result(
                    input_value=raw,
                    normalized_email=normalized,
                    status="invalid",
                    reason="invalid_format",
                )
            )
            continue

        local_part, domain = normalized.rsplit("@", 1)
        if not local_part:
            results.append(
                Result(
                    input_value=raw,
                    normalized_email=normalized,
                    status="invalid",
                    reason="missing_local_part",
                )
            )
            continue

        if domain not in allowed_domains:
            results.append(
                Result(
                    input_value=raw,
                    normalized_email=normalized,
                    status="not_hotmail",
                    reason=f"domain_not_allowed ({domain})",
                )
            )
            continue

        if counts[normalized] > 1:
            results.append(
                Result(
                    input_value=raw,
                    normalized_email=normalized,
                    status="duplicate",
                    reason=f"appears_{counts[normalized]}_times",
                )
            )
            continue

        results.append(
            Result(
                input_value=raw,
                normalized_email=normalized,
                status="valid",
                reason="ok",
            )
        )

    return results


def print_summary(results: list[Result]) -> None:
    counts = Counter(result.status for result in results)
    total = len(results)
    print("=== Summary ===")
    print(f"Total rows:      {total}")
    print(f"Valid:           {counts.get('valid', 0)}")
    print(f"Duplicates:      {counts.get('duplicate', 0)}")
    print(f"Invalid format:  {counts.get('invalid', 0)}")
    print(f"Not hotmail:     {counts.get('not_hotmail', 0)}")


def print_table(results: list[Result]) -> None:
    print("\n=== Details ===")
    print(f"{'email':40} {'status':12} reason")
    print("-" * 80)
    for result in results:
        print(
            f"{result.normalized_email[:40]:40} "
            f"{result.status[:12]:12} "
            f"{result.reason}"
        )


def write_csv(output_file: Path, results: list[Result]) -> None:
    with output_file.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["input_value", "normalized_email", "status", "reason"])
        for result in results:
            writer.writerow(
                [
                    result.input_value,
                    result.normalized_email,
                    result.status,
                    result.reason,
                ]
            )


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check a list of Hotmail/Microsoft emails."
    )
    parser.add_argument(
        "input_file",
        type=Path,
        help="Path to a text file with one email per line.",
    )
    parser.add_argument(
        "--domains",
        type=str,
        default=None,
        help=(
            "Comma-separated allowed domains "
            "(default: hotmail.com,outlook.com,live.com,msn.com,hotmail.co.uk)."
        ),
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=None,
        help="Optional CSV output file path.",
    )
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    try:
        allowed_domains = parse_domains(args.domains)
        emails = read_emails(args.input_file)
        if not emails:
            print("No emails found in input file.")
            return 1

        results = check_emails(emails, allowed_domains)
        print_summary(results)
        print_table(results)

        if args.output_csv:
            write_csv(args.output_csv, results)
            print(f"\nSaved CSV report to: {args.output_csv}")
        return 0
    except Exception as exc:  # pragma: no cover - CLI safety net
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
