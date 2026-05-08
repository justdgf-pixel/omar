# omar

## Hotmail list checker

This repo now includes a safe bulk checker script:

- validates email format
- detects duplicates
- identifies Hotmail-family domains (`hotmail.com`, `outlook.com`, `live.com`, etc.)
- outputs a CSV report
- can optionally write only valid Hotmail-family emails to a separate file

### Usage

```bash
python3 hotmail_list_checker.py -i input.txt
```

With custom output paths:

```bash
python3 hotmail_list_checker.py \
  -i input.txt \
  -o report.csv \
  --hotmail-only-output hotmail_only.txt
```

### Input format

One entry per line. Supported examples:

- `name@hotmail.com`
- `name@outlook.com`
- `name@gmail.com`
- `name@hotmail.com:password123` (email is extracted safely; no login check is performed)
