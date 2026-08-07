from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.habit import HabitCreateSchema, HabitStatus, HabitStatusUpdateSchema
from services.mission_generator import generate_daily_missions

router = APIRouter(prefix="/api/habits", tags=["habits"])


@router.post("/{character_id}")
async def create_habit(character_id: str, payload: HabitCreateSchema):
    """
    Create a new Habit template along with 1:1 HabitSchedule, HabitMetrics, and 1:N HabitTier relations.
    Automatically ensures character exists in database (seeding fallback if necessary).
    """
    character = await ensure_character_exists(character_id)

    schedule_data = {}
    if payload.schedule:
        schedule_data = {
            "daysOfWeek": payload.schedule.daysOfWeek,
            "timesPerWeek": payload.schedule.timesPerWeek,
            "timesPerMonth": payload.schedule.timesPerMonth,
            "startTime": payload.schedule.startTime,
            "endTime": payload.schedule.endTime,
            "timezone": payload.schedule.timezone,
        }

    tiers_data = []
    for t in payload.tiers:
        tiers_data.append({
            "tier": t.tier.value,
            "targetType": t.targetType,
            "targetValue": t.targetValue,
            "targetUnit": t.targetUnit,
            "baseExp": t.baseExp,
            "baseGold": t.baseGold,
            "statReward": t.statReward,
        })

    habit = await db.habit.create(
        data={
            "characterId": character.id,
            "name": payload.name,
            "description": payload.description,
            "category": payload.category,
            "difficulty": payload.difficulty.value,
            "primaryStat": payload.primaryStat,
            "scheduleType": payload.scheduleType.value,
            "preferredTime": payload.preferredTime,
            "icon": payload.icon,
            "color": payload.color,
            "status": HabitStatus.ACTIVE.value,
            "schedule": {
                "create": schedule_data
            },
            "tiers": {
                "create": tiers_data
            },
            "metrics": {
                "create": {
                    "habitStrength": 100.0,
                    "successRate": 0.0,
                    "completionRate": 0.0,
                    "currentConsistency": 0.0,
                }
            },
        },
        include={
            "schedule": True,
            "metrics": True,
            "tiers": True,
        },
    )
    return habit


@router.get("/{character_id}")
async def get_habits(character_id: str):
    """
    Return all habit templates for the specified character ID.
    Automatically ensures character exists in database.
    """
    await ensure_character_exists(character_id)

    habits = await db.habit.find_many(
        where={"characterId": character_id},
        include={
            "schedule": True,
            "metrics": True,
            "tiers": True,
        },
    )
    return habits

@router.patch("/{habit_id}/status")
async def update_habit_status(habit_id: str, payload: HabitStatusUpdateSchema):
    """
    Update the status of a habit (e.g. PAUSED, ARCHIVED, DELETED).
    Handles setting pausedAt and archivedAt timestamps.
    """
    # Fetch existing habit to ensure it exists
    existing = await db.habit.find_unique(where={"id": habit_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    update_data = {"status": payload.status.value}
    now = datetime.now(timezone.utc)

    if payload.status == HabitStatus.PAUSED:
        update_data["pausedAt"] = now
    elif payload.status == HabitStatus.ARCHIVED:
        update_data["archivedAt"] = now
    elif payload.status == HabitStatus.DELETED:
        update_data["pausedAt"] = None
        update_data["archivedAt"] = None
        # Could also set a deletedAt field if it existed in schema, but status='DELETED' serves as soft delete
    elif payload.status == HabitStatus.ACTIVE:
        update_data["pausedAt"] = None
        update_data["archivedAt"] = None

    updated = await db.habit.update(
        where={"id": habit_id},
        data=update_data,
        include={
            "schedule": True,
            "metrics": True,
            "tiers": True,
        },
    )
    return updated

@router.post("/{character_id}/generate-missions")
async def trigger_mission_generation(character_id: str):
    """
    Triggers the daily mission generator for the given character.
    Should be called when the user visits the dashboard to ensure today's missions exist.
    """
    await ensure_character_exists(character_id)
    now = datetime.now(timezone.utc)
    missions_created = await generate_daily_missions(character_id, now)
    return {"status": "success", "missions_created": missions_created}
