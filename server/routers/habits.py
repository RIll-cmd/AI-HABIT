from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.habit import HabitCreateSchema, HabitStatus, HabitStatusUpdateSchema, HabitUpdateSchema
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
            "rrule": payload.rrule,
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

@router.put("/{habit_id}")
async def update_habit(habit_id: str, payload: HabitUpdateSchema):
    """
    Update habit details, schedule, target frequencies, and tiers.
    """
    existing = await db.habit.find_unique(where={"id": habit_id}, include={"schedule": True, "tiers": True})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")

    habit_update_data = {}
    if payload.name is not None:
        habit_update_data["name"] = payload.name
    if payload.description is not None:
        habit_update_data["description"] = payload.description
    if payload.icon is not None:
        habit_update_data["icon"] = payload.icon
    if payload.color is not None:
        habit_update_data["color"] = payload.color
    if payload.category is not None:
        habit_update_data["category"] = payload.category
    if payload.difficulty is not None:
        habit_update_data["difficulty"] = payload.difficulty.value
    if payload.primaryStat is not None:
        habit_update_data["primaryStat"] = payload.primaryStat
    if payload.scheduleType is not None:
        habit_update_data["scheduleType"] = payload.scheduleType.value
    if payload.preferredTime is not None:
        habit_update_data["preferredTime"] = payload.preferredTime

    if habit_update_data:
        await db.habit.update(where={"id": habit_id}, data=habit_update_data)

    # Schedule update
    if payload.schedule is not None:
        sched_data = {
            "daysOfWeek": payload.schedule.daysOfWeek,
            "timesPerWeek": payload.schedule.timesPerWeek,
            "timesPerMonth": payload.schedule.timesPerMonth,
            "startTime": payload.schedule.startTime,
            "endTime": payload.schedule.endTime,
            "timezone": payload.schedule.timezone,
        }
        if existing.schedule:
            await db.habitschedule.update(where={"habitId": habit_id}, data=sched_data)
        else:
            await db.habitschedule.create(data={"habitId": habit_id, **sched_data})

    # Tiers update
    if payload.tiers is not None:
        for t in payload.tiers:
            tier_val = t.tier.value if hasattr(t.tier, "value") else str(t.tier)
            tier_data = {
                "targetType": t.targetType,
                "targetValue": t.targetValue,
                "targetUnit": t.targetUnit,
                "baseExp": t.baseExp,
                "baseGold": t.baseGold,
                "statReward": t.statReward,
            }
            await db.habittier.upsert(
                where={"habitId_tier": {"habitId": habit_id, "tier": tier_val}},
                data={
                    "create": {"habitId": habit_id, "tier": tier_val, **tier_data},
                    "update": tier_data,
                }
            )

    return await db.habit.find_unique(
        where={"id": habit_id},
        include={"schedule": True, "metrics": True, "tiers": True}
    )

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


@router.post("/{character_id}/decay/simulate")
async def trigger_decay_simulation(character_id: str):
    """
    Manually triggers midnight decay simulation for dev/testing.
    Evaluates uncompleted habits, applies adaptive decay, checks streak shields, and logs heatmap snapshots.
    """
    from services.decay_service import process_midnight_decay
    await ensure_character_exists(character_id)
    result = await process_midnight_decay(db, character_id, is_simulation=True)
    return result


@router.get("/{character_id}/calendar-snapshots")
async def get_calendar_snapshots(character_id: str):
    """
    Returns 365-day historical DailyCompletionSnapshot records for calendar heatmap visualization.
    """
    await ensure_character_exists(character_id)
    
    from datetime import datetime, timedelta, timezone
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=365)
    
    missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "date": {"gte": start_date}
        }
    )
    
    heatmap_data = {}
    for m in missions:
        d_str = m.date.strftime("%Y-%m-%d") if hasattr(m.date, 'strftime') else str(m.date)[:10]
        if d_str not in heatmap_data:
            heatmap_data[d_str] = {"totalCount": 0, "completedCount": 0}
        
        heatmap_data[d_str]["totalCount"] += 1
        if m.status == "COMPLETED":
            heatmap_data[d_str]["completedCount"] += 1
            
    snapshots = []
    for date_str, stats in heatmap_data.items():
        total = stats["totalCount"]
        completed = stats["completedCount"]
        rate = (completed / total * 100) if total > 0 else 0
        snapshots.append({
            "id": f"snap-{date_str}",
            "date": date_str,
            "totalCount": total,
            "completedCount": completed,
            "completionRate": rate
        })
        
    return {"snapshots": snapshots}


@router.post("/{character_id}/buy-streak-freeze")
async def buy_streak_freeze(character_id: str):
    """
    Purchases 1 Streak Freeze Shield for 300 Gold or 15 Gems (up to max 3 shields).
    """
    char = await ensure_character_exists(character_id)
    if char.streakFreezes >= 3:
        raise HTTPException(status_code=400, detail="Maximum Streak Freeze Shields (3) already in inventory.")

    if char.gold < 300:
        raise HTTPException(status_code=400, detail="Insufficient Gold. Streak Freeze costs 300 Gold.")

    updated = await db.character.update(
        where={"id": character_id},
        data={
            "gold": char.gold - 300,
            "streakFreezes": char.streakFreezes + 1
        }
    )

    await db.progresshistory.create(
        data={
            "characterId": character_id,
            "type": "ITEM_PURCHASE",
            "amount": -300,
            "description": f"Purchased 1 Streak Freeze Shield 🛡️. Total active shields: {updated.streakFreezes}"
        }
    )

    return {
        "message": f"Successfully purchased Streak Freeze Shield 🛡️! Total active shields: {updated.streakFreezes}",
        "streakFreezes": updated.streakFreezes,
        "gold": updated.gold
    }

