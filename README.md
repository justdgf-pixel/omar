# Hotmail / Outlook Account Checker

A Python CLI tool to validate and check multiple Hotmail, Outlook, Live, and MSN email accounts.

## Features

- **SMTP mode** — Validates email format + checks domain MX records (no password needed)
- **Login mode** — Attempts IMAP authentication with provided credentials
- Concurrent multi-threaded checking for speed
- Color-coded terminal output
- Saves results to timestamped files (full results + valid-only list)
- Supports all Microsoft email domains: `hotmail.com`, `outlook.com`, `live.com`, `msn.com`

## Supported Domains

| Domain | IMAP Server |
|---|---|
| hotmail.com | imap-mail.outlook.com |
| outlook.com | imap-mail.outlook.com |
| live.com | imap-mail.outlook.com |
| msn.com | imap-mail.outlook.com |

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Mode 1: Format & Domain Check (no password)

Validates email format and checks that the domain has a valid MX record.

**Input file** (`emails.txt`) — one email per line:
```
user1@hotmail.com
user2@outlook.com
test@live.com
```

**Run:**
```bash
python3 hotmail_checker.py -f emails.txt --mode smtp
```

---

### Mode 2: Login Check (with password)

Attempts an IMAP login for each account.

**Input file** (`combos.txt`) — `email:password` per line:
```
user1@hotmail.com:Password123
user2@outlook.com:MySecretPass!
test@live.com:hunter2
```

**Run:**
```bash
python3 hotmail_checker.py -f combos.txt --mode login
```

---

### All Options

```
usage: hotmail_checker.py [-h] -f FILE [--mode {smtp,login}]
                          [--threads N] [--timeout SEC]
                          [--delay SEC] [--output DIR]

options:
  -h, --help            Show this help message and exit
  -f FILE, --file FILE  Path to input file
  --mode {smtp,login}   Check mode (default: smtp)
                          smtp  — format + MX check only
                          login — IMAP credential check
  --threads N           Concurrent threads (default: 5)
  --timeout SEC         Connection timeout in seconds (default: 10)
  --delay SEC           Delay between checks (default: 0)
  --output DIR          Output directory (default: results/)
```

### Examples

```bash
# Check 50 emails with 10 threads
python3 hotmail_checker.py -f emails.txt --mode smtp --threads 10

# Check login for 100 combos, 5 threads, 1s delay (avoid rate-limiting)
python3 hotmail_checker.py -f combos.txt --mode login --threads 5 --delay 1

# Custom output folder
python3 hotmail_checker.py -f combos.txt --mode login --output my_results/
```

## Output

Results are saved in the output directory (default: `results/`):

| File | Contents |
|---|---|
| `results_TIMESTAMP.txt` | Full results grouped by Valid / Invalid / Other |
| `valid_TIMESTAMP.txt` | Valid accounts only (email or email:password) |

### Result Statuses

| Status | Meaning |
|---|---|
| `✓ VALID` | Login successful |
| `✓ FORMAT OK` | Valid email format and domain MX |
| `✗ INVALID` | Wrong credentials |
| `✗ BAD FORMAT` | Invalid email format |
| `~ WRONG DOMAIN` | Not a Hotmail/Outlook domain |
| `~ NO MX` | Domain has no MX record |
| `~ LOCKED` | Account locked or blocked |
| `~ RATE LIMITED` | Too many requests to server |
| `~ TIMEOUT` | Connection timed out |
| `! ERROR` | Unexpected error |

## Notes

- Login checking uses **IMAP over SSL** (port 993) — Microsoft's standard method.
- Use `--delay` to avoid triggering rate limits when checking large lists.
- Lines starting with `#` in input files are treated as comments and skipped.
