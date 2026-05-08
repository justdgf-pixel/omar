import dns.resolver
from functools import lru_cache


@lru_cache(maxsize=256)
def get_mx_records(domain: str) -> list[str]:
    try:
        answers = dns.resolver.resolve(domain, "MX")
        return sorted(
            [str(r.exchange).rstrip(".") for r in answers],
            key=lambda x: x,
        )
    except (
        dns.resolver.NoAnswer,
        dns.resolver.NXDOMAIN,
        dns.resolver.NoNameservers,
        dns.exception.Timeout,
    ):
        return []


def has_valid_mx(domain: str) -> bool:
    return len(get_mx_records(domain)) > 0
