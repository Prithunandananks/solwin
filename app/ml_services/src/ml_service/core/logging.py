import logging
import re
from typing import Any

_EMAIL = re.compile(r"(?P<local>[^@\s]{1,64})@(?P<domain>[^@\s]{1,255})")


def redact_email(value: str) -> str:
    return _EMAIL.sub(lambda item: f"{item.group('local')[0]}***@{item.group('domain')}", value)


def configure_logging(level: str) -> None:
    logging.basicConfig(level=level, format="%(asctime)s %(levelname)s %(name)s %(message)s", force=True)


def safe_log(logger: logging.Logger, event: str, **fields: Any) -> None:
    """Do not pass raw customer text, emails, tokens, keys, or passwords here."""

    blocked = {"message", "subject", "text", "email", "token", "api_key", "password"}
    logger.info("%s %s", event, {key: value for key, value in fields.items() if key not in blocked})
