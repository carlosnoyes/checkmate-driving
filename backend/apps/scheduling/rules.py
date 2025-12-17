"""Scheduling rules and conflict detection."""
from datetime import datetime
from typing import Iterable


def has_conflict(start_at: datetime, end_at: datetime, existing: Iterable[tuple]) -> bool:
    for current_start, current_end in existing:
        if start_at < current_end and end_at > current_start:
            return True
    return False
