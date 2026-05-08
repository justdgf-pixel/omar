# Hotmail / Outlook Email List Checker

A fast, async Python tool that validates Hotmail, Outlook, Live, and MSN email addresses in bulk. It checks email syntax, DNS/MX records, and probes the SMTP server to determine whether each mailbox exists — without sending any actual emails.

## Features

- **Format validation** — catches malformed addresses before hitting the network
- **Domain verification** — recognizes 90+ Microsoft email domains (hotmail, outlook, live, msn variants)
- **MX record lookup** — verifies the domain has valid mail exchange records
- **SMTP mailbox probe** — uses RCPT TO to check if the mailbox exists on the server
- **Async & concurrent** — configurable worker count for high throughput
- **Sorted output files** — splits results into `valid.txt`, `invalid.txt`, `unknown.txt`, and a full CSV report
- **Multiple input files** — pass as many list files as you want in one run
- **Flexible input formats** — supports one-per-line, comma-separated, semicolon-separated, or tab-separated emails
- **Duplicate removal** — automatically deduplicates across all input files
- **Color-coded terminal output** — instant visual feedback per email

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
# Basic — check a single file
python hotmail_checker.py emails.txt

# Multiple files
python hotmail_checker.py list1.txt list2.txt list3.txt

# Custom output directory
python hotmail_checker.py emails.txt -o my_results

# Increase concurrency (default 30)
python hotmail_checker.py emails.txt -w 100

# Longer SMTP timeout (default 10s)
python hotmail_checker.py emails.txt --timeout 20

# All options combined
python hotmail_checker.py list1.txt list2.txt -o output -w 50 --timeout 15
```

## Input File Format

One email per line. Lines starting with `#` are ignored. You can also use comma, semicolon, or tab separators:

```
# My hotmail list
user1@hotmail.com
user2@outlook.com
user3@live.com, user4@msn.com
```

## Output

Results are saved to the `results/` directory (or custom `-o` path):

| File | Contents |
|---|---|
| `valid.txt` | Emails confirmed as existing mailboxes |
| `invalid.txt` | Bad format, unknown domain, no MX, or SMTP-rejected |
| `unknown.txt` | Timeouts, transient errors, or inconclusive results |
| `full_report.csv` | Every email with status, detail, MX host, SMTP code, and timing |

## Supported Domains

The checker recognizes all major Microsoft email domains including:

- `hotmail.com` and 30+ regional variants (.co.uk, .fr, .de, etc.)
- `outlook.com` and 25+ regional variants
- `live.com` and 20+ regional variants
- `msn.com` and variants

## Status Codes

| Status | Meaning |
|---|---|
| `valid` | SMTP server accepted the recipient (mailbox exists) |
| `invalid_format` | Email address has bad syntax |
| `unknown_domain` | Domain is not a known Microsoft email domain |
| `no_mx` | Domain has no MX records |
| `smtp_rejected` | SMTP server rejected the recipient (5xx response) |
| `smtp_error` | Connection error during SMTP check |
| `timeout` | SMTP connection or command timed out |
| `unknown` | Inconclusive result |

## Requirements

- Python 3.10+
- `dnspython` — DNS resolution
- `colorama` — colored terminal output
