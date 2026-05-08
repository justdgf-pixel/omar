# Hotmail / Outlook Email List Checker

A Python CLI tool that reads a list of Hotmail, Outlook, Live, or MSN email addresses and verifies each one using SMTP-level checks against Microsoft's mail servers.

## Features

- **Format validation** – catches malformed addresses before hitting the network.
- **Domain whitelist** – supports `hotmail.*`, `outlook.*`, `live.*`, and `msn.com` variants.
- **MX resolution** – looks up real mail-exchange hosts via DNS.
- **SMTP RCPT-TO verification** – asks the server whether the mailbox exists.
- **Concurrent checking** – configurable thread pool for fast batch processing.
- **Colour-coded terminal output** – green (valid), red (invalid/rejected), yellow (unknown/error).
- **Export results** – save to `.txt` or `.csv`.

## Quick Start

```bash
# Install dependency
pip install -r requirements.txt

# Run against your email list
python hotmail_checker.py emails.txt

# Save results to CSV
python hotmail_checker.py emails.txt -o results.csv

# Use 10 threads and a 15-second timeout
python hotmail_checker.py emails.txt --threads 10 --timeout 15
```

## Input File Format

Plain text, one email per line. Blank lines and lines starting with `#` are ignored.

```
# My Hotmail list
user1@hotmail.com
user2@outlook.com
user3@live.com
```

## CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `input` | *(required)* | Path to the email list file |
| `-o`, `--output` | — | Output file (`.txt` or `.csv`) |
| `-t`, `--threads` | 5 | Number of concurrent SMTP checks |
| `--timeout` | 10 | SMTP connection timeout in seconds |
| `--no-color` | off | Disable coloured terminal output |

## Result Statuses

| Status | Meaning |
|--------|---------|
| `valid` | Server accepted the address (SMTP 250) |
| `invalid_format` | Email failed regex validation |
| `bad_domain` | Domain is not a recognised Hotmail/Outlook domain or has no MX records |
| `rejected` | Server explicitly rejected the mailbox (SMTP 550/551/553) |
| `unknown` | Server returned a non-definitive response |
| `error` | Network/connection error during the check |

## Note

SMTP verification accuracy depends on the target server's configuration. Microsoft servers may rate-limit or greylisting connections, which can produce `unknown` or `error` results for addresses that actually exist. Running from a server with a clean IP and proper rDNS improves reliability.
