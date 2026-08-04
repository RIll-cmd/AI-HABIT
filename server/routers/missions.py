from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from schemas.habit import MissionCompleteSchema

router = APIRouter(prefix="/api/missions", tags=["missions"])


@router.get("/today/{character_id}")
async def get_today_missions(character_id: str):
    """
    Daily Mission Generator:
    Fetches all active habits for a character, ensures a PENDING Mission instance
    exists for today, creates missing instances, and returns today's missions.
    """
    now = datetime.now(timezone.utc)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    today_end = today_start + timedelta(days=1)

    # Fetch active habit templates
    active_habits = await db.habit.find_many(
        where={"characterId": character_id, "isActive": True},
        include={"schedule": True, "metrics": True},
    )

    # Find existing missions for today
    existing_missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "date": {
                "gte": today_start,
                "lt": today_end,
            },
        },
        include={"habit": True},
    )

    existing_habit_ids = {m.habitId for m in existing_missions if m.habitId}

    # Generate missing mission instances for today
    for habit in active_habits:
        if habit.id not in existing_habit_ids:
            await db.mission.create(
                data={
                    "habitId": habit.id,
                    "characterId": character_id,
                    "date": today_start,
                    "status": "PENDING",
                }
            )

    # Return all today missions (including newly generated ones)
    today_missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "date": {
                "gte": today_start,
                "lt": today_end,
            },
        },
        include={"habit": True},
    )

    return today_missions


@router.post("/{mission_id}/complete")
async def complete_mission(mission_id: str, payload: MissionCompleteSchema):
    """
    Mark a mission instance as COMPLETED, record completionType and rewards,
    and update parent HabitMetrics habitStrength score.
    """
    existing = await db.mission.find_unique(where={"id": mission_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID '{mission_id}' not found",
        )

    now = datetime.now(timezone.utc)

    # Update Mission instance
    updated_mission = await db.mission.update(
        where={"id": mission_id},
        data={
            "status": "COMPLETED",
            "completionType": payload.completionType,
            "expEarned": payload.expEarned,
            "statsEarned": payload.statsEarned,
            "completedAt": now,
        },
        include={"habit": True},
    )

    # Update HabitMetrics if linked to a Habit template
    if updated_mission.habitId:
        metrics = await db.habitmetrics.find_unique(
            where={"habitId": updated_mission.habitId}
        )
        if metrics:
            new_strength = min(100.0, metrics.habitStrength + 1.0)
            await db.habitmetrics.update(
                where={"habitId": updated_mission.habitId},
                data={
                    "habitStrength": new_strength,
                    "completionRate": min(100.0, metrics.completionRate + 1.0),
                },
            )

    return updated_mission
