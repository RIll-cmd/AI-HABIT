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

    # Check for Elite/Hardcore bonus gems
    bonus_gems = 0
    if payload.completionType in ["ELITE", "HARDCORE"]:
        bonus_gems = 2 if payload.completionType == "HARDCORE" else 1
        await db.character.update(
            where={"id": updated_mission.characterId},
            data={"gems": {"increment": bonus_gems}}
        )
        await db.economylog.create(
            data={
                "characterId": updated_mission.characterId,
                "currency": "GEMS",
                "amount": bonus_gems,
                "reason": f"Mission Overachieve Bonus ({payload.completionType})",
                "source": "MISSION_BONUS"
            }
        )

    # Check for Daily All-Clear Consistency Triumph
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    today_end = today_start + timedelta(days=1)
    
    today_missions = await db.mission.find_many(
        where={
            "characterId": updated_mission.characterId,
            "date": {"gte": today_start, "lt": today_end}
        }
    )
    
    pending_today = [m for m in today_missions if m.status != "COMPLETED"]
    
    if len(today_missions) > 0 and len(pending_today) == 0:
        # All missions today completed! Check if all-clear bonus was already awarded today
        date_str = today_start.strftime('%Y-%m-%d')
        existing_all_clear = await db.economylog.find_first(
            where={
                "characterId": updated_mission.characterId,
                "reason": f"Daily Consistency All-Clear ({date_str})"
            }
        )
        if not existing_all_clear:
            all_clear_gold = 100
            all_clear_gems = 10
            all_clear_tokens = 25
            
            await db.character.update(
                where={"id": updated_mission.characterId},
                data={
                    "gold": {"increment": all_clear_gold},
                    "gems": {"increment": all_clear_gems},
                    "towerTokens": {"increment": all_clear_tokens}
                }
            )
            
            await db.economylog.create(
                data={
                    "characterId": updated_mission.characterId,
                    "currency": "GOLD",
                    "amount": all_clear_gold,
                    "reason": f"Daily Consistency All-Clear ({date_str})",
                    "source": "DAILY_CONSISTENCY"
                }
            )
            await db.economylog.create(
                data={
                    "characterId": updated_mission.characterId,
                    "currency": "GEMS",
                    "amount": all_clear_gems,
                    "reason": f"Daily Consistency All-Clear ({date_str})",
                    "source": "DAILY_CONSISTENCY"
                }
            )
            await db.economylog.create(
                data={
                    "characterId": updated_mission.characterId,
                    "currency": "TOWER_TOKENS",
                    "amount": all_clear_tokens,
                    "reason": f"Daily Consistency All-Clear ({date_str})",
                    "source": "DAILY_CONSISTENCY"
                }
            )
            await db.progresshistory.create(
                data={
                    "characterId": updated_mission.characterId,
                    "type": "DAILY_CONSISTENCY",
                    "amount": all_clear_gems,
                    "description": f"🌟 100% Daily All-Clear! Earned +{all_clear_gold} Gold, +{all_clear_gems} Gems, +{all_clear_tokens} Tower Tokens!"
                }
            )

    return updated_mission

@router.get("/heatmap/{character_id}")
async def get_heatmap(character_id: str):
    """
    Returns calendar heatmap data for the past 365 days.
    """
    await ensure_character_exists(character_id)
    
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=365)
    
    missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "status": "COMPLETED",
            "date": {"gte": start_date}
        }
    )
    
    heatmap_data = {}
    for m in missions:
        d_str = m.date.strftime("%Y-%m-%d") if hasattr(m.date, 'strftime') else str(m.date)[:10]
        if d_str not in heatmap_data:
            heatmap_data[d_str] = 0
        heatmap_data[d_str] += 1
        
    result = []
    for date_str, count in heatmap_data.items():
        # Level determines the color intensity, max 4
        level = min(4, count)
        result.append({
            "date": date_str,
            "count": count,
            "level": level
        })
        
    return result
