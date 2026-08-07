import json
from datetime import datetime, timedelta, timezone
from db import db

async def generate_daily_missions(character_id: str, target_date: datetime):
    """
    Generates missions for a given date based on active habit schedules.
    Ensures idempotency by checking if a mission already exists for the habit on the same date.
    """
    date_start = datetime(target_date.year, target_date.month, target_date.day, tzinfo=timezone.utc)
    date_end = date_start + timedelta(days=1)

    # 1. Find active Habits
    active_habits = await db.habit.find_many(
        where={
            "characterId": character_id,
            "status": "ACTIVE"
        },
        include={"schedule": True}
    )

    # 2. Check if Missions already exist for this date
    existing_missions = await db.mission.find_many(
        where={
            "characterId": character_id,
            "date": {
                "gte": date_start,
                "lt": date_end,
            },
        }
    )
    existing_habit_ids = {m.habitId for m in existing_missions if m.habitId}

    missions_created = 0

    # 3. Generate missions
    for habit in active_habits:
        if habit.id in existing_habit_ids:
            continue

        schedule = habit.schedule
        if not schedule:
            continue

        should_generate = False
        schedule_type = habit.scheduleType

        if schedule_type == "DAILY":
            should_generate = True
        elif schedule_type == "SPECIFIC_DAYS" and schedule.daysOfWeek:
            try:
                # daysOfWeek is stored as JSON array of strings, e.g. '["Monday", "Wednesday"]'
                days_array = json.loads(schedule.daysOfWeek)
                today_name = date_start.strftime("%A")
                if today_name in days_array:
                    should_generate = True
            except json.JSONDecodeError:
                should_generate = False
        else:
            # For X_TIMES_WEEK, MONTHLY, CUSTOM, just default to generating a daily pending mission for MVP
            # A more sophisticated scheduler would check weekly limits
            should_generate = True

        if should_generate:
            await db.mission.create(
                data={
                    "habitId": habit.id,
                    "characterId": character_id,
                    "date": date_start,
                    "status": "PENDING",
                }
            )
            missions_created += 1

    return missions_created


async def recalculate_habit_strength(habit_id: str):
    """
    Recalculates the habit strength metrics based on mission history.
    Formula: Consistency (40%) + Success Rate (35%) + Completion Quality (25%)
    """
    # Fetch recent missions for this habit
    missions = await db.mission.find_many(
        where={"habitId": habit_id},
        order={"date": "desc"},
        take=30 # Look at the last 30 missions
    )

    if not missions:
        return

    total = len(missions)
    completed_missions = [m for m in missions if m.status == "COMPLETED"]
    completed_count = len(completed_missions)

    # Consistency: % of scheduled days that were attempted/completed (not missed)
    # Since we only have PENDING/COMPLETED right now, we'll treat COMPLETED as consistency.
    consistency = (completed_count / total) * 100.0

    # Success Rate: % of generated missions that were successfully completed
    success_rate = (completed_count / total) * 100.0

    # Completion Quality
    # Mini = 50%, Normal = 100%, Elite = 150%
    quality_sum = 0
    for m in completed_missions:
        tier = m.completionType
        if tier == "MINI":
            quality_sum += 50
        elif tier == "ELITE":
            quality_sum += 150
        else:
            quality_sum += 100 # NORMAL or default

    completion_quality = (quality_sum / completed_count) if completed_count > 0 else 0

    # Calculate Strength
    new_strength = (consistency * 0.40) + (success_rate * 0.35) + (completion_quality * 0.25)
    # Cap at 100%
    new_strength = min(100.0, new_strength)

    # Fetch current metrics to apply slow adjustment
    metrics = await db.habitmetrics.find_unique(where={"habitId": habit_id})
    if metrics:
        old_strength = metrics.habitStrength
        # Smooth the change: 80% old, 20% new
        smoothed_strength = (old_strength * 0.8) + (new_strength * 0.2)

        await db.habitmetrics.update(
            where={"habitId": habit_id},
            data={
                "habitStrength": smoothed_strength,
                "currentConsistency": consistency,
                "successRate": success_rate,
                "completionRate": completion_quality,
            }
        )
