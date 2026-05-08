import csv
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path

from .smtp_check import CheckResult, SmtpResult, smtp_verify
from .validator import is_hotmail_domain, is_valid_format, normalize


@dataclass
class Stats:
    total: int = 0
    valid: int = 0
    invalid: int = 0
    catch_all: int = 0
    unknown: int = 0
    error: int = 0
    bad_format: int = 0
    non_hotmail: int = 0
    duplicates: int = 0


@dataclass
class BatchChecker:
    threads: int = 5
    timeout: int = 10
    sender: str = "check@example.com"
    smtp_enabled: bool = True
    results: list[CheckResult] = field(default_factory=list)
    stats: Stats = field(default_factory=Stats)

    def load_emails(self, filepath: str) -> list[str]:
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        emails = []
        ext = path.suffix.lower()

        if ext == ".csv":
            with open(path, newline="", encoding="utf-8-sig") as f:
                reader = csv.reader(f)
                for row in reader:
                    for cell in row:
                        cell = cell.strip()
                        if "@" in cell:
                            emails.append(cell)
        else:
            with open(path, encoding="utf-8-sig") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        parts = line.replace(";", ",").replace("\t", ",").split(",")
                        for part in parts:
                            part = part.strip()
                            if "@" in part:
                                emails.append(part)

        return emails

    def check_list(
        self,
        emails: list[str],
        progress_callback=None,
    ) -> list[CheckResult]:
        seen = set()
        to_check = []

        for email in emails:
            self.stats.total += 1
            email = normalize(email)

            if email in seen:
                self.stats.duplicates += 1
                continue
            seen.add(email)

            if not is_valid_format(email):
                self.stats.bad_format += 1
                self.results.append(
                    CheckResult(
                        email=email,
                        smtp_result=SmtpResult.ERROR,
                        message="Invalid email format",
                    )
                )
                continue

            if not is_hotmail_domain(email):
                self.stats.non_hotmail += 1
                self.results.append(
                    CheckResult(
                        email=email,
                        smtp_result=SmtpResult.ERROR,
                        message="Not a Hotmail/Outlook/Live domain",
                    )
                )
                continue

            to_check.append(email)

        if not self.smtp_enabled:
            for email in to_check:
                result = CheckResult(
                    email=email,
                    smtp_result=SmtpResult.UNKNOWN,
                    message="SMTP check disabled — format and domain are valid",
                )
                self.results.append(result)
                self.stats.unknown += 1
            return self.results

        completed = 0
        total_to_check = len(to_check)

        with ThreadPoolExecutor(max_workers=self.threads) as pool:
            futures = {
                pool.submit(
                    smtp_verify, email, self.sender, self.timeout
                ): email
                for email in to_check
            }

            for future in as_completed(futures):
                result = future.result()
                self.results.append(result)

                match result.smtp_result:
                    case SmtpResult.VALID:
                        self.stats.valid += 1
                    case SmtpResult.INVALID:
                        self.stats.invalid += 1
                    case SmtpResult.CATCH_ALL:
                        self.stats.catch_all += 1
                    case SmtpResult.UNKNOWN:
                        self.stats.unknown += 1
                    case SmtpResult.ERROR:
                        self.stats.error += 1

                completed += 1
                if progress_callback:
                    progress_callback(completed, total_to_check, result)

        return self.results

    def export_results(self, output_path: str, only_valid: bool = False):
        path = Path(output_path)
        ext = path.suffix.lower()

        items = self.results
        if only_valid:
            items = [r for r in items if r.smtp_result == SmtpResult.VALID]

        if ext == ".csv":
            with open(path, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["email", "result", "smtp_code", "message"])
                for r in items:
                    writer.writerow(
                        [r.email, r.smtp_result.value, r.smtp_code, r.message]
                    )
        else:
            with open(path, "w", encoding="utf-8") as f:
                for r in items:
                    f.write(
                        f"{r.email} | {r.smtp_result.value} | {r.smtp_code} | {r.message}\n"
                    )
