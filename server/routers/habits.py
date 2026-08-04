from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from schemas.habit import HabitCreateSchema

router = APIRouter(prefix="/api/habits", tags=["habits"])


@router.post("/{character_id}")
async def create_habit(character_id: str, payload: HabitCreateSchema):
    """
    Create a new Habit template along with 1:1 HabitSchedule and HabitMetrics relations.
    """
    character = await db.character.find_unique(where={"id": character_id})
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Character with ID '{character_id}' not found",
        )

    habit = await db.habit.create(
        data={
            "characterId": character_id,
            "name": payload.name,
            "description": payload.description,
            "category": payload.category,
            "difficulty": payload.difficulty,
            "primaryStat": payload.primaryStat,
            "icon": payload.icon,
            "color": payload.color,
            "isActive": True,
            "schedule": {
                "create": {
                    "type": payload.scheduleType,
                    "days": payload.scheduleDays,
                    "interval": 1,
                    "startDate": datetime.now(timezone.utc),
                }
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
        },
    )
    return habit


@router.get("/{character_id}")
async def get_habits(character_id: str):
    """
    Return all habit templates for the specified character ID.
    """
    habits = await db.habit.find_many(
        where={"characterId": character_id},
        include={
            "schedule": True,
            "metrics": True,
        },
    )
    return habits
