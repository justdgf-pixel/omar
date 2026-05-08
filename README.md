# Hotmail List Checker

A Python CLI tool that validates Hotmail, Outlook, and Live email addresses from one or more list files.

## Features

- **Multi-file support** -- pass as many email list files as you need
- **Three-stage validation**:
  1. Email format check (RFC 5322 pattern)
  2. Domain verification (hotmail / outlook / live / msn)
  3. DNS MX record lookup
  4. SMTP mailbox probe (`RCPT TO`)
- **Concurrent checking** with configurable thread count
- **Duplicate removal** across all input files
- **CSV or plain-text output**
- **Progress reporting and summary**

## Supported Domains

`hotmail.*`, `outlook.*`, `live.*`, `msn.com` (all regional variants).

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
# Check a single list
python hotmail_checker.py emails.txt

# Check multiple lists, save to custom output
python hotmail_checker.py list1.txt list2.txt list3.txt -o report.csv

# Use 20 threads, plain-text output
python hotmail_checker.py emails/*.txt -t 20 -f txt -o results.txt

# Skip SMTP verification (format + MX only -- faster, less accurate)
python hotmail_checker.py list.txt --no-smtp

# Add delay between checks to avoid rate-limiting
python hotmail_checker.py list.txt --delay 0.5
```

### Input File Format

One email per line. Lines starting with `#` are ignored. Emails can also be
separated by commas, semicolons, tabs, or pipes on a single line.

```
user1@hotmail.com
user2@outlook.com
# this line is ignored
user3@live.com
```

### CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `files` (positional) | -- | One or more input files |
| `-o`, `--output` | `results.csv` | Output file path |
| `-f`, `--format` | `csv` | Output format (`csv` or `txt`) |
| `-t`, `--threads` | `10` | Max concurrent checks |
| `--timeout` | `10` | SMTP timeout in seconds |
| `--no-smtp` | off | Skip SMTP, do format + MX only |
| `--delay` | `0` | Seconds to wait between checks |

### Output Statuses

| Status | Meaning |
|--------|---------|
| `valid` | Email accepted by the mail server |
| `invalid_format` | Not a valid email address |
| `not_hotmail` | Domain is not Hotmail/Outlook/Live |
| `no_mx` | Domain has no MX records |
| `smtp_rejected` | Mail server says mailbox does not exist |
| `smtp_error` | SMTP connection or protocol error |
| `timeout` | SMTP connection timed out |
| `unknown` | Ambiguous server response |

## Example

```bash
python hotmail_checker.py sample_emails.txt --no-smtp
```

```
[*] Loaded 12 emails from sample_emails.txt
[*] Checking with 10 threads (smtp=off)...
  [12/12] processed

[*] Results saved to results.csv

============================================================
  RESULTS SUMMARY  (12 emails checked)
============================================================
  valid              7  ( 58.3%)  #############################
  invalid_format     2  ( 16.7%)  ########
  not_hotmail        2  ( 16.7%)  ########
============================================================
```

## License

MIT
