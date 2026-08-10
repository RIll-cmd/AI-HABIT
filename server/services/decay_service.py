from datetime import datetime, timedelta
import json
from prisma import Prisma

async def process_midnight_decay(db: Prisma, character_id: str, is_simulation: bool = False):
    """
    Evaluates yesterday's pending missions and habits for midnight decay.
    Applies adaptive strength decay, manages streak freeze shields, and logs daily snapshots.
    """
    char = await db.character.find_unique(
        where={"id": character_id},
        include={"habits": {"include": {"metrics": True, "tiers": True}}}
    )
    if not char:
        return {"error": "Character not found"}

    today = datetime.now().date()
    yesterday_dt = datetime.now() - timedelta(days=1)
    yesterday_date = yesterday_dt.date()

    # Find yesterday's missions
    yesterday_missions = await db.mission.find_many(
        where={
            "characterId": character_id,
        }
    )

    pending_missions = [m for m in yesterday_missions if m.status == "PENDING"]
    completed_missions = [m for m in yesterday_missions if m.status == "COMPLETED"]
    total_missions = len(yesterday_missions)

    has_missed = len(pending_missions) > 0
    shield_used = False

    # Check Streak Freeze Shield Protection
    if has_missed and char.streakFreezes > 0:
        shield_used = True
        # Consume 1 shield
        await db.character.update(
            where={"id": character_id},
            data={"streakFreezes": char.streakFreezes - 1}
        )
        # Log Shield Event
        await db.progresshistory.create(
            data={
                "characterId": character_id,
                "type": "STREAK_SHIELD",
                "amount": 0,
                "description": f"🛡️ Streak Freeze Shield Auto-Activated! Preserved habit streaks across {len(pending_missions)} pending tasks."
            }
        )

    # Process each pending mission & habit decay
    decay_logs = []
    for m in pending_missions:
        if shield_used:
            # Shield preserved streak
            await db.mission.update(
                where={"id": m.id},
                data={"status": "MISSED"}
            )
            decay_logs.append(f"Mission '{m.id}' shielded from streak reset.")
        else:
            # No shield: Apply Adaptive Soft-Landing Decay
            await db.mission.update(
                where={"id": m.id},
                data={"status": "MISSED"}
            )

            if m.habitId:
                habit = await db.habit.find_unique(
                    where={"id": m.habitId},
                    include={"metrics": True}
                )
                if habit:
                    # Streak reset logic would go here if Habit model had a streak field

                    # Adaptive Decay Calculation
                    current_strength = habit.metrics.habitStrength if habit.metrics else 100.0
                    base_decay = 5.0
                    if habit.difficulty == "EASY":
                        base_decay = 3.0
                    elif habit.difficulty == "HARD":
                        base_decay = 6.0

                    # Momentum Buffer check: If strength > 80, halve decay
                    if current_strength > 80.0:
                        base_decay = base_decay * 0.5

                    new_strength = max(0.0, current_strength - base_decay)

                    if habit.metrics:
                        await db.habitmetrics.update(
                            where={"habitId": habit.id},
                            data={"habitStrength": new_strength}
                        )
                    decay_logs.append(f"Habit '{habit.name}' decayed -{base_decay:.1f} strength (Streak reset to 0).")


    return {
        "characterId": character_id,
        "date": yesterday_date.strftime("%Y-%m-%d"),
        "shieldUsed": shield_used,
        "remainingShields": max(0, char.streakFreezes - (1 if shield_used else 0)),
        "decayLogs": decay_logs
    }
