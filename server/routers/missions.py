from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.habit import MissionCompleteSchema
from services.mission_generator import recalculate_habit_strength
from services.boss_engine import deal_boss_damage

router = APIRouter(prefix="/api/missions", tags=["missions"])


@router.get("/today/{character_id}")
async def get_today_missions(character_id: str):
    """
    Fetches today's missions for the character.
    Generation should be triggered via the POST /api/habits/{character_id}/generate-missions endpoint.
    """
    await ensure_character_exists(character_id)

    now = datetime.now(timezone.utc)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    today_end = today_start + timedelta(days=1)

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
        await recalculate_habit_strength(updated_mission.habitId)
        
    # Deal Boss Damage (if linked)
    # We use "HABIT" as the activityType because the user links the overall habit to the boss
    if updated_mission.habitId:
        await deal_boss_damage(
            db=db,
            character_id=updated_mission.characterId,
            activity_type="HABIT",
            reference_id=updated_mission.habitId
        )

    return updated_mission
