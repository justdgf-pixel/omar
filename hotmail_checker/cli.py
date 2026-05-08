import argparse
import sys
import time

from .checker import BatchChecker


BANNER = r"""
  _   _       _                 _ _    ____ _               _
 | | | | ___ | |_ _ __ ___   __ _(_) |  / ___| |__   ___  ___| | _____ _ __
 | |_| |/ _ \| __| '_ ` _ \ / _` | | | | |   | '_ \ / _ \/ __| |/ / _ \ '__|
 |  _  | (_) | |_| | | | | | (_| | | | | |___| | | |  __/ (__|   <  __/ |
 |_| |_|\___/ \__|_| |_| |_|\__,_|_|_|  \____|_| |_|\___|\___|_|\_\___|_|

  Hotmail / Outlook / Live — Bulk Email List Checker
"""


def progress(completed: int, total: int, result):
    symbol = {
        "valid": "\033[92m✓\033[0m",
        "invalid": "\033[91m✗\033[0m",
        "catch_all": "\033[93m~\033[0m",
        "unknown": "\033[90m?\033[0m",
        "error": "\033[91m!\033[0m",
    }.get(result.smtp_result.value, " ")

    pct = int(completed / total * 100) if total else 0
    print(
        f"  [{pct:3d}%] {symbol} {result.email:40s} -> {result.smtp_result.value}",
        flush=True,
    )


def print_stats(checker: BatchChecker):
    s = checker.stats
    print("\n" + "=" * 60)
    print("  RESULTS SUMMARY")
    print("=" * 60)
    print(f"  Total processed : {s.total}")
    print(f"  Duplicates      : {s.duplicates}")
    print(f"  Bad format      : {s.bad_format}")
    print(f"  Non-Hotmail     : {s.non_hotmail}")
    print(f"  \033[92mValid\033[0m           : {s.valid}")
    print(f"  \033[91mInvalid\033[0m         : {s.invalid}")
    print(f"  \033[93mCatch-all\033[0m       : {s.catch_all}")
    print(f"  \033[90mUnknown\033[0m         : {s.unknown}")
    print(f"  Errors          : {s.error}")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Check multiple Hotmail/Outlook/Live email lists for validity.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python -m hotmail_checker emails.txt\n"
            "  python -m hotmail_checker list1.txt list2.csv list3.txt\n"
            "  python -m hotmail_checker emails.txt -o results.csv\n"
            "  python -m hotmail_checker emails.txt --threads 10 --valid-only -o good.txt\n"
            "  python -m hotmail_checker emails.txt --no-smtp\n"
        ),
    )
    parser.add_argument(
        "files",
        nargs="+",
        help="One or more email list files (.txt or .csv)",
    )
    parser.add_argument(
        "-o", "--output",
        help="Output file for results (.txt or .csv)",
    )
    parser.add_argument(
        "-t", "--threads",
        type=int,
        default=5,
        help="Number of concurrent threads (default: 5)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=10,
        help="SMTP connection timeout in seconds (default: 10)",
    )
    parser.add_argument(
        "--sender",
        default="check@example.com",
        help="Sender address for SMTP MAIL FROM (default: check@example.com)",
    )
    parser.add_argument(
        "--no-smtp",
        action="store_true",
        help="Skip SMTP verification (only check format and domain)",
    )
    parser.add_argument(
        "--valid-only",
        action="store_true",
        help="Only include valid emails in output file",
    )
    parser.add_argument(
        "-q", "--quiet",
        action="store_true",
        help="Suppress progress output",
    )

    args = parser.parse_args()

    if not args.quiet:
        print(BANNER)

    checker = BatchChecker(
        threads=args.threads,
        timeout=args.timeout,
        sender=args.sender,
        smtp_enabled=not args.no_smtp,
    )

    all_emails = []
    for filepath in args.files:
        try:
            emails = checker.load_emails(filepath)
            if not args.quiet:
                print(f"  Loaded {len(emails)} emails from {filepath}")
            all_emails.extend(emails)
        except FileNotFoundError as e:
            print(f"  Error: {e}", file=sys.stderr)
            sys.exit(1)

    if not all_emails:
        print("  No emails found in the provided files.", file=sys.stderr)
        sys.exit(1)

    if not args.quiet:
        mode = "format + domain only" if args.no_smtp else "format + domain + SMTP"
        print(f"\n  Checking {len(all_emails)} emails ({mode})...")
        print(f"  Threads: {args.threads} | Timeout: {args.timeout}s\n")

    callback = None if args.quiet else progress
    start = time.time()
    checker.check_list(all_emails, progress_callback=callback)
    elapsed = time.time() - start

    if not args.quiet:
        print_stats(checker)
        print(f"  Time elapsed: {elapsed:.1f}s\n")

    if args.output:
        checker.export_results(args.output, only_valid=args.valid_only)
        count = (
            sum(1 for r in checker.results if r.smtp_result.value == "valid")
            if args.valid_only
            else len(checker.results)
        )
        print(f"  Results saved to {args.output} ({count} entries)")


if __name__ == "__main__":
    main()
