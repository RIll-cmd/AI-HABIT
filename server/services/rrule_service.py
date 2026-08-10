from datetime import datetime, date
from typing import List, Optional
from dateutil.rrule import rrulestr

def is_habit_due_today(rrule_str: Optional[str], check_date: Optional[datetime] = None) -> bool:
    """
    Evaluates whether a habit with the given rrule string is due on check_date (defaults to today).
    If no rrule_str is provided, defaults to True (Daily habit).
    """
    if not rrule_str or rrule_str.strip() == "" or rrule_str.upper() == "FREQ=DAILY":
        return True

    target_dt = check_date or datetime.now()
    target_date = target_dt.date()

    try:
        # Standardize string
        clean_rrule = rrule_str if "RRULE:" in rrule_str else f"RRULE:{rrule_str}"
        rule = rrulestr(clean_rrule, dtstart=datetime(2026, 1, 1))
        
        # Check occurrences on the target date
        occurrences = rule.between(
            datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0),
            datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59),
            inc=True
        )
        return len(occurrences) > 0
    except Exception as e:
        print(f"[RRuleService] Error parsing rrule '{rrule_str}': {e}")
        return True


def get_next_due_dates(rrule_str: Optional[str], count: int = 5) -> List[str]:
    """
    Returns upcoming due dates formatted as YYYY-MM-DD strings.
    """
    if not rrule_str or rrule_str.upper() == "FREQ=DAILY":
        today = date.today()
        return [(today).strftime("%Y-%m-%d")]

    try:
        clean_rrule = rrule_str if "RRULE:" in rrule_str else f"RRULE:{rrule_str}"
        rule = rrulestr(clean_rrule, dtstart=datetime.now())
        occurrences = rule.slice(0, count)
        return [dt.strftime("%Y-%m-%d") for dt in occurrences]
    except Exception as e:
        return [date.today().strftime("%Y-%m-%d")]
