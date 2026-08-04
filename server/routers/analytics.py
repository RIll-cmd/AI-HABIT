from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
from db import db
from db_utils import ensure_character_exists

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/{character_id}/weekly")
async def get_weekly_analytics(character_id: str):
    """
    Fetch all COMPLETED missions from the last 7 days and group earned EXP by day.
    Returns array formatted for Recharts: [{"day": "Mon", "exp": 120}, ...]
    """
    await ensure_character_exists(character_id)

    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=6)
    start_of_period = datetime(
        seven_days_ago.year, seven_days_ago.month, seven_days_ago.day, tzinfo=timezone.utc
    )

    days_map = {}
    days_order = []
    for i in range(7):
        day_dt = start_of_period + timedelta(days=i)
        day_name = day_dt.strftime("%a")
        date_key = day_dt.strftime("%Y-%m-%d")
        days_order.append((date_key, day_name))
        days_map[date_key] = 0

    missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "status": "COMPLETED",
            "date": {"gte": start_of_period},
        }
    )

    for m in missions:
        if m.date:
            date_key = m.date.strftime("%Y-%m-%d")
            if date_key in days_map:
                days_map[date_key] += m.expEarned or 0

    chart_data = [
        {"day": day_name, "exp": days_map[date_key]}
        for date_key, day_name in days_order
    ]

    return chart_data
