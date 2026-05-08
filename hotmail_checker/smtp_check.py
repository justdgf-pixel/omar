import smtplib
import socket
from dataclasses import dataclass
from enum import Enum

from .dns_check import get_mx_records


class SmtpResult(str, Enum):
    VALID = "valid"
    INVALID = "invalid"
    CATCH_ALL = "catch_all"
    UNKNOWN = "unknown"
    ERROR = "error"


@dataclass
class CheckResult:
    email: str
    smtp_result: SmtpResult
    smtp_code: int = 0
    message: str = ""


def smtp_verify(
    email: str,
    sender: str = "check@example.com",
    timeout: int = 10,
) -> CheckResult:
    domain = email.split("@")[-1]
    mx_hosts = get_mx_records(domain)

    if not mx_hosts:
        return CheckResult(
            email=email,
            smtp_result=SmtpResult.ERROR,
            message="No MX records found",
        )

    last_error = ""
    for mx_host in mx_hosts[:3]:
        try:
            with smtplib.SMTP(timeout=timeout) as smtp:
                smtp.connect(mx_host, 25)
                smtp.ehlo_or_helo_if_needed()
                smtp.mail(sender)
                code, resp = smtp.rcpt(email)
                message = resp.decode(errors="replace")

                if code == 250:
                    return CheckResult(
                        email=email,
                        smtp_result=SmtpResult.VALID,
                        smtp_code=code,
                        message=message,
                    )
                elif code == 550 or code == 551 or code == 553:
                    return CheckResult(
                        email=email,
                        smtp_result=SmtpResult.INVALID,
                        smtp_code=code,
                        message=message,
                    )
                elif code == 252:
                    return CheckResult(
                        email=email,
                        smtp_result=SmtpResult.CATCH_ALL,
                        smtp_code=code,
                        message=message,
                    )
                else:
                    return CheckResult(
                        email=email,
                        smtp_result=SmtpResult.UNKNOWN,
                        smtp_code=code,
                        message=message,
                    )

        except smtplib.SMTPServerDisconnected:
            last_error = f"Server {mx_host} disconnected"
        except smtplib.SMTPConnectError as e:
            last_error = f"Connect error to {mx_host}: {e}"
        except socket.timeout:
            last_error = f"Timeout connecting to {mx_host}"
        except socket.gaierror:
            last_error = f"DNS resolution failed for {mx_host}"
        except OSError as e:
            last_error = f"Network error with {mx_host}: {e}"

    return CheckResult(
        email=email,
        smtp_result=SmtpResult.UNKNOWN,
        message=last_error,
    )
