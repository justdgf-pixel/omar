# Hotmail List Checker

Simple CLI tool to check a list of emails and report:
- valid Hotmail/Microsoft email format,
- addresses outside allowed domains,
- duplicates in your list.

## Usage

1. Put your emails in a text file, one per line (example: `emails.txt`).
2. Run:

```bash
python3 hotmail_list_checker.py emails.txt
```

Optional flags:

```bash
# Save full results as CSV
python3 hotmail_list_checker.py emails.txt --output-csv report.csv

# Override allowed domains
python3 hotmail_list_checker.py emails.txt --domains "hotmail.com,outlook.com"
```
