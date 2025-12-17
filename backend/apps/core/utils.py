"""Shared utilities for datetime handling and other helpers."""
from datetime import datetime
from zoneinfo import ZoneInfo


def to_timezone(value: datetime, timezone: str) -> datetime:
    tz = ZoneInfo(timezone)
    if value.tzinfo:
        return value.astimezone(tz)
    return value.replace(tzinfo=ZoneInfo("UTC")).astimezone(tz)
