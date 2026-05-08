import re

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
)

HOTMAIL_DOMAINS = {
    "hotmail.com",
    "hotmail.co.uk",
    "hotmail.fr",
    "hotmail.de",
    "hotmail.it",
    "hotmail.es",
    "hotmail.ca",
    "hotmail.com.br",
    "hotmail.com.ar",
    "hotmail.co.jp",
    "hotmail.co.th",
    "hotmail.co.id",
    "hotmail.co.nz",
    "hotmail.com.au",
    "hotmail.com.tw",
    "hotmail.be",
    "hotmail.cl",
    "hotmail.dk",
    "hotmail.fi",
    "hotmail.gr",
    "hotmail.hu",
    "hotmail.nl",
    "hotmail.no",
    "hotmail.ph",
    "hotmail.se",
    "hotmail.sg",
    "outlook.com",
    "outlook.co.uk",
    "outlook.fr",
    "outlook.de",
    "outlook.it",
    "outlook.es",
    "outlook.com.br",
    "outlook.com.au",
    "outlook.jp",
    "outlook.kr",
    "outlook.sa",
    "outlook.co.id",
    "outlook.co.th",
    "outlook.co.nz",
    "outlook.cl",
    "outlook.at",
    "outlook.be",
    "outlook.dk",
    "outlook.ie",
    "outlook.in",
    "outlook.pt",
    "outlook.ph",
    "outlook.sg",
    "live.com",
    "live.co.uk",
    "live.fr",
    "live.de",
    "live.it",
    "live.com.au",
    "live.com.br",
    "live.ca",
    "live.nl",
    "live.se",
    "live.be",
    "live.at",
    "live.cl",
    "live.cn",
    "live.dk",
    "live.fi",
    "live.hk",
    "live.ie",
    "live.in",
    "live.jp",
    "live.no",
    "live.ru",
    "msn.com",
    "msn.co.uk",
    "msn.cn",
}


def is_valid_format(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email.strip()))


def is_hotmail_domain(email: str) -> bool:
    domain = email.strip().split("@")[-1].lower()
    return domain in HOTMAIL_DOMAINS


def normalize(email: str) -> str:
    return email.strip().lower()
