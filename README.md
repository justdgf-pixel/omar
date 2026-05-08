# Hotmail List Checker

A Python CLI tool to validate and check multiple Hotmail / Outlook / Live email lists in bulk.

## Features

- **Multi-file support** — pass multiple `.txt` or `.csv` files at once
- **Format validation** — catches malformed emails before hitting the network
- **Domain check** — verifies the email belongs to a Hotmail/Outlook/Live domain
- **MX record lookup** — confirms the domain has valid mail exchange records
- **SMTP verification** — connects to the mail server and checks if the mailbox exists
- **Multi-threaded** — configurable thread count for fast bulk processing
- **Duplicate removal** — automatically skips duplicate addresses
- **Export results** — save to `.txt` or `.csv` with optional valid-only filtering

## Supported Domains

`hotmail.com`, `outlook.com`, `live.com`, `msn.com` and all regional variants (`.co.uk`, `.fr`, `.de`, `.com.br`, etc.)

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Basic — check a single list

```bash
python -m hotmail_checker emails.txt
```

### Multiple lists at once

```bash
python -m hotmail_checker list1.txt list2.csv list3.txt
```

### Save results to CSV

```bash
python -m hotmail_checker emails.txt -o results.csv
```

### Export only valid emails

```bash
python -m hotmail_checker emails.txt --valid-only -o valid_emails.txt
```

### Faster with more threads

```bash
python -m hotmail_checker emails.txt -t 10
```

### Format + domain check only (no SMTP)

```bash
python -m hotmail_checker emails.txt --no-smtp
```

### Quiet mode (no progress output)

```bash
python -m hotmail_checker emails.txt -q -o results.csv
```

## Input File Formats

**Text file** (one email per line):

```
user1@hotmail.com
user2@outlook.com
user3@live.com
```

**CSV file** (emails can be in any column):

```csv
name,email,note
John,john@hotmail.com,lead
Jane,jane@outlook.com,customer
```

## CLI Options

| Option | Description |
|---|---|
| `files` | One or more email list files (`.txt` or `.csv`) |
| `-o, --output` | Output file path (`.txt` or `.csv`) |
| `-t, --threads` | Concurrent threads (default: 5) |
| `--timeout` | SMTP timeout in seconds (default: 10) |
| `--sender` | MAIL FROM address (default: `check@example.com`) |
| `--no-smtp` | Skip SMTP — only validate format and domain |
| `--valid-only` | Only export valid emails to output |
| `-q, --quiet` | Suppress progress output |

## Result Statuses

| Status | Meaning |
|---|---|
| `valid` | Mailbox exists (SMTP 250) |
| `invalid` | Mailbox does not exist (SMTP 550/551/553) |
| `catch_all` | Server accepts all addresses (SMTP 252) |
| `unknown` | Could not determine — server timeout or greylisting |
| `error` | Bad format, wrong domain, or no MX records |
