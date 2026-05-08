# omar

## Hotmail list checker

This repo now includes a safe bulk email list checker:

- validates email formatting
- normalizes casing
- removes duplicates
- identifies Microsoft consumer domains like `hotmail.com`, `outlook.com`, `live.com`, and `msn.com`
- refuses to process entries that look like `email:password` or `email|secret`

It does **not** attempt to sign into Hotmail or verify passwords.

### Usage

```bash
python3 hotmail_list_checker.py emails.txt --verbose
python3 hotmail_list_checker.py emails.csv --only-microsoft --clean-output clean.txt --report report.csv
```

### Input formats

- plain text files with one item per line
- CSV files with one or more columns containing email addresses

### Output options

- `--verbose`: print per-entry results
- `--clean-output <file>`: save unique valid emails
- `--report <file>`: save a full report as `.csv` or `.json`

### Run tests

```bash
python3 -m unittest discover -s tests
```
