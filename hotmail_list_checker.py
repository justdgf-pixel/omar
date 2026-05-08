#!/usr/bin/env python3
"""Safely validate bulk email lists without checking account sign-ins."""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable, Sequence

EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")
SUSPICIOUS_CREDENTIAL_RE = re.compile(
    r"(?i)\b[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}\s*[:|]\s*\S+"
)


@dataclass(frozen=True)
class SourceEntry:
    reference: str
    text: str


@dataclass(frozen=True)
class AnalysisResult:
    source_reference: str
    raw_value: str
    extracted_email: str
    normalized_email: str
    domain: str
    provider: str
    is_microsoft_consumer: bool
    is_duplicate: bool
    status: str
    reason: str


MICROSOFT_PROVIDER_PREFIXES = {
    "hotmail.": "hotmail",
    "outlook.": "outlook",
    "live.": "live",
    "msn.": "msn",
}

MICROSOFT_PROVIDER_EXACT = {
    "hotmail.com": "hotmail",
    "outlook.com": "outlook",
    "live.com": "live",
    "msn.com": "msn",
}


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Check bulk email lists safely. This tool validates email formatting, "
            "deduplicates entries, and identifies Microsoft consumer domains such as "
            "hotmail.com, outlook.com, live.com, and msn.com. It does not attempt "
            "to log into accounts or verify passwords."
        )
    )
    parser.add_argument("input", help="Path to a .txt or .csv file containing email addresses.")
    parser.add_argument(
        "--only-microsoft",
        action="store_true",
        help="Keep only Microsoft consumer email addresses in the cleaned output.",
    )
    parser.add_argument(
        "--report",
        help="Optional path to save the full analysis report as .csv or .json.",
    )
    parser.add_argument(
        "--clean-output",
        help="Optional path to save unique, normalized valid email addresses.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print each analysis result to stdout.",
    )
    return parser.parse_args(argv)


def classify_provider(domain: str) -> tuple[str, bool]:
    lowered = domain.lower()
    if lowered in MICROSOFT_PROVIDER_EXACT:
        return MICROSOFT_PROVIDER_EXACT[lowered], True

    for prefix, provider in MICROSOFT_PROVIDER_PREFIXES.items():
        if lowered.startswith(prefix):
            return provider, True

    return "non-microsoft", False


def is_valid_email_format(email: str) -> bool:
    if len(email) > 254 or email.count("@") != 1:
        return False

    local_part, domain = email.rsplit("@", 1)
    if len(local_part) > 64 or not local_part or not domain:
        return False

    if local_part.startswith(".") or local_part.endswith(".") or ".." in local_part:
        return False

    if domain.startswith(".") or domain.endswith(".") or ".." in domain:
        return False

    labels = domain.split(".")
    if len(labels) < 2:
        return False

    for label in labels:
        if not label or len(label) > 63:
            return False
        if label.startswith("-") or label.endswith("-"):
            return False
        if not re.fullmatch(r"[A-Za-z0-9-]+", label):
            return False

    if not re.fullmatch(r"[A-Za-z]{2,}", labels[-1]):
        return False

    return True


def extract_emails(text: str) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for match in EMAIL_RE.finditer(text):
        normalized = match.group(0).lower()
        if normalized in seen:
            continue
        if is_valid_email_format(normalized):
            found.append(normalized)
            seen.add(normalized)
    return found


def analyze_source_entries(
    entries: Iterable[SourceEntry], only_microsoft: bool = False
) -> tuple[list[AnalysisResult], list[str]]:
    results: list[AnalysisResult] = []
    cleaned: list[str] = []
    seen_emails: set[str] = set()

    for entry in entries:
        text = entry.text.strip()
        if not text:
            continue

        if SUSPICIOUS_CREDENTIAL_RE.search(text):
            results.append(
                AnalysisResult(
                    source_reference=entry.reference,
                    raw_value=text,
                    extracted_email="",
                    normalized_email="",
                    domain="",
                    provider="",
                    is_microsoft_consumer=False,
                    is_duplicate=False,
                    status="unsupported_credential_like_entry",
                    reason=(
                        "Looks like an email paired with a password or secret. "
                        "This tool does not check account sign-ins."
                    ),
                )
            )
            continue

        emails = extract_emails(text)
        if not emails:
            results.append(
                AnalysisResult(
                    source_reference=entry.reference,
                    raw_value=text,
                    extracted_email="",
                    normalized_email="",
                    domain="",
                    provider="",
                    is_microsoft_consumer=False,
                    is_duplicate=False,
                    status="invalid_or_missing_email",
                    reason="No valid email address was found in this entry.",
                )
            )
            continue

        for email in emails:
            domain = email.rsplit("@", 1)[1]
            provider, is_microsoft = classify_provider(domain)
            is_duplicate = email in seen_emails
            if not is_duplicate:
                seen_emails.add(email)

            status = "valid"
            reason = "Valid email format."

            if is_duplicate:
                status = "duplicate"
                reason = "Duplicate of an earlier normalized email address."
            elif only_microsoft and not is_microsoft:
                status = "ignored_non_microsoft"
                reason = "Skipped because --only-microsoft is enabled."

            if status == "valid":
                cleaned.append(email)

            results.append(
                AnalysisResult(
                    source_reference=entry.reference,
                    raw_value=text,
                    extracted_email=email,
                    normalized_email=email,
                    domain=domain,
                    provider=provider,
                    is_microsoft_consumer=is_microsoft,
                    is_duplicate=is_duplicate,
                    status=status,
                    reason=reason,
                )
            )

    return results, cleaned


def load_entries(path: Path) -> list[SourceEntry]:
    if not path.exists():
        raise FileNotFoundError(f"Input file not found: {path}")

    if path.suffix.lower() == ".csv":
        return load_csv_entries(path)

    return load_text_entries(path)


def load_text_entries(path: Path) -> list[SourceEntry]:
    entries: list[SourceEntry] = []
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line_number, line in enumerate(handle, start=1):
            entries.append(SourceEntry(reference=f"{path.name}:{line_number}", text=line.rstrip("\n")))
    return entries


def load_csv_entries(path: Path) -> list[SourceEntry]:
    entries: list[SourceEntry] = []
    with path.open("r", encoding="utf-8", errors="replace", newline="") as handle:
        sample = handle.read(2048)
        handle.seek(0)
        has_header = False
        try:
            has_header = csv.Sniffer().has_header(sample)
        except csv.Error:
            has_header = False

        if has_header:
            reader = csv.DictReader(handle)
            for row_number, row in enumerate(reader, start=2):
                for key, value in row.items():
                    if value is None:
                        continue
                    entries.append(
                        SourceEntry(
                            reference=f"{path.name}:{row_number}:{key}",
                            text=value.strip(),
                        )
                    )
            return entries

        reader = csv.reader(handle)
        for row_number, row in enumerate(reader, start=1):
            for column_number, value in enumerate(row, start=1):
                entries.append(
                    SourceEntry(
                        reference=f"{path.name}:{row_number}:{column_number}",
                        text=value.strip(),
                    )
                )
    return entries


def build_summary(results: Sequence[AnalysisResult], cleaned: Sequence[str]) -> dict[str, int]:
    summary = {
        "total_results": len(results),
        "valid": 0,
        "duplicate": 0,
        "ignored_non_microsoft": 0,
        "invalid_or_missing_email": 0,
        "unsupported_credential_like_entry": 0,
        "microsoft_consumer_addresses": 0,
        "non_microsoft_addresses": 0,
        "cleaned_output_addresses": len(cleaned),
    }

    for result in results:
        if result.status in summary:
            summary[result.status] += 1
        if result.extracted_email:
            if result.is_microsoft_consumer:
                summary["microsoft_consumer_addresses"] += 1
            else:
                summary["non_microsoft_addresses"] += 1

    return summary


def write_report(path: Path, results: Sequence[AnalysisResult]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() == ".json":
        with path.open("w", encoding="utf-8") as handle:
            json.dump([asdict(result) for result in results], handle, indent=2)
        return

    if path.suffix.lower() == ".csv":
        with path.open("w", encoding="utf-8", newline="") as handle:
            fieldnames = list(asdict(results[0]).keys()) if results else list(
                AnalysisResult(
                    source_reference="",
                    raw_value="",
                    extracted_email="",
                    normalized_email="",
                    domain="",
                    provider="",
                    is_microsoft_consumer=False,
                    is_duplicate=False,
                    status="",
                    reason="",
                ).__dict__.keys()
            )
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            for result in results:
                writer.writerow(asdict(result))
        return

    raise ValueError("Report output must end with .csv or .json")


def write_clean_output(path: Path, cleaned: Sequence[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for email in cleaned:
            handle.write(f"{email}\n")


def print_summary(summary: dict[str, int]) -> None:
    print("Summary")
    print("-------")
    for key, value in summary.items():
        print(f"{key}: {value}")


def print_verbose(results: Sequence[AnalysisResult]) -> None:
    print("\nResults")
    print("-------")
    for result in results:
        label = result.normalized_email or result.raw_value
        print(f"[{result.status}] {result.source_reference} :: {label}")
        print(f"  {result.reason}")


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    input_path = Path(args.input)

    try:
        entries = load_entries(input_path)
        results, cleaned = analyze_source_entries(entries, only_microsoft=args.only_microsoft)
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    summary = build_summary(results, cleaned)
    print_summary(summary)

    if args.verbose:
        print_verbose(results)

    if args.report:
        try:
            write_report(Path(args.report), results)
            print(f"\nSaved report to {args.report}")
        except ValueError as exc:
            print(f"Error: {exc}", file=sys.stderr)
            return 1

    if args.clean_output:
        write_clean_output(Path(args.clean_output), cleaned)
        print(f"Saved clean output to {args.clean_output}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
