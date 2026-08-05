import json
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from db import db
from utils.fitness_math import calculate_estimated_1rm


async def detect_personal_records(session_id: str, character_id: str) -> List[Any]:
    """
    Scans all ExerciseLog entries for a completed WorkoutSession.
    Calculates estimated 1RM for each set and compares against character's
    existing PersonalRecord history. Inserts new PR records if broken.
    Returns list of newly achieved PersonalRecord objects.
    """
    new_prs = []

    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={
            "exerciseLogs": {
                "include": {
                    "exercise": True,
                }
            }
        }
    )

    if not session or not session.exerciseLogs:
        return new_prs

    exercise_map: Dict[str, List[Any]] = {}
    for log in session.exerciseLogs:
        exercise_map.setdefault(log.exerciseId, []).append(log)

    for exercise_id, logs in exercise_map.items():
        if not logs:
            continue

        best_set = None
        best_1rm = 0.0

        for log in logs:
            est_1rm = calculate_estimated_1rm(log.weight, log.reps)
            if est_1rm > best_1rm:
                best_1rm = est_1rm
                best_set = log

        if not best_set or best_1rm <= 0.0:
            continue

        existing_pr = await db.personalrecord.find_first(
            where={
                "characterId": character_id,
                "exerciseId": exercise_id,
            },
            order={"estimated1RM": "desc"},
            include={"exercise": True}
        )

        if not existing_pr or best_1rm > (existing_pr.estimated1RM + 0.01):
            pr_record = await db.personalrecord.create(
                data={
                    "characterId": character_id,
                    "exerciseId": exercise_id,
                    "weight": float(best_set.weight),
                    "reps": int(best_set.reps),
                    "estimated1RM": float(best_1rm),
                    "date": datetime.now(timezone.utc),
                },
                include={
                    "exercise": True,
                }
            )
            new_prs.append(pr_record)

    return new_prs


async def generate_overload_suggestion(character_id: str, exercise_id: str) -> Dict[str, Any]:
    """
    Analyzes historical performance for an exercise and generates a progressive
    overload recommendation (e.g. +2.5kg increase if reps > 8 cleanly hit).
    """
    recent_logs = await db.exerciselog.find_many(
        where={
            "exerciseId": exercise_id,
            "session": {
                "characterId": character_id,
                "completed": True,
            }
        },
        order={"createdAt": "desc"},
        take=10,
        include={"exercise": True}
    )

    if not recent_logs:
        return {
            "exerciseId": exercise_id,
            "currentWeight": 0.0,
            "recommendedWeight": 20.0,
            "suggestedReps": "8-10",
            "message": "First time performing this exercise! Start with a comfortable baseline weight.",
        }

    max_weight_log = max(recent_logs, key=lambda l: l.weight)
    curr_weight = float(max_weight_log.weight)
    curr_reps = int(max_weight_log.reps)

    if curr_reps >= 8:
        recommended_weight = curr_weight + 2.5
        return {
            "exerciseId": exercise_id,
            "currentWeight": curr_weight,
            "recommendedWeight": recommended_weight,
            "suggestedReps": "6-8",
            "message": f"Overload Ready! Last session you hit {curr_weight}kg x {curr_reps} reps cleanly. Recommend increasing weight to {recommended_weight}kg next session.",
            "shouldIncrease": True,
        }
    else:
        return {
            "exerciseId": exercise_id,
            "currentWeight": curr_weight,
            "recommendedWeight": curr_weight,
            "suggestedReps": f"{curr_reps + 1}-10",
            "message": f"Maintain {curr_weight}kg and aim to increase reps from {curr_reps} to 8 before advancing weight.",
            "shouldIncrease": False,
        }


async def calculate_workout_rewards(
    session_id: str,
    new_prs_count: int = 0
) -> Dict[str, Any]:
    """
    Calculates EXP, Gold, and specific Character Stat increases (Strength, Endurance, Recovery)
    based on workout volume, duration, goal, and PR achievements.
    Applies rewards to Character and CharacterStats database records.
    """
    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={
            "exerciseLogs": True,
            "plan": True,
            "character": {
                "include": {
                    "stats": True,
                }
            }
        }
    )

    if not session or not session.character:
        return {
            "exp": 100,
            "gold": 25,
            "statsEarned": {"strength": 1},
            "volume": 0.0,
            "duration": 0,
        }

    character = session.character
    total_volume = sum(log.weight * log.reps for log in session.exerciseLogs) if session.exerciseLogs else 0.0
    duration = session.duration or 60
    goal = session.plan.goal if session.plan and session.plan.goal else "Build Muscle"

    stats_earned = {"strength": 0, "endurance": 0, "recovery": 0, "discipline": 0, "focus": 0}

    if goal in ["Build Muscle", "Strength"]:
        stats_earned["strength"] = 5 + int(total_volume / 2000)
        stats_earned["discipline"] = 2
        stats_earned["recovery"] = 1
    elif goal in ["Lose Weight", "General Fitness"]:
        stats_earned["endurance"] = 5 + int(duration / 600)
        stats_earned["strength"] = 2
        stats_earned["recovery"] = 2
    else:
        stats_earned["recovery"] = 5
        stats_earned["focus"] = 2

    base_exp = 150
    volume_exp = min(150, int(total_volume / 50))
    duration_exp = min(100, int(duration / 60) * 2)
    pr_exp = new_prs_count * 50

    total_exp = base_exp + volume_exp + duration_exp + pr_exp

    base_gold = 30
    volume_gold = min(50, int(total_volume / 200))
    pr_gold = new_prs_count * 25

    total_gold = base_gold + volume_gold + pr_gold

    new_total_exp = (character.exp or 0) + total_exp
    new_total_gold = (character.gold or 0) + total_gold

    await db.character.update(
        where={"id": character.id},
        data={
            "exp": new_total_exp,
            "gold": new_total_gold,
        }
    )

    if character.stats:
        await db.characterstats.update(
            where={"characterId": character.id},
            data={
                "strength": (character.stats.strength or 1) + stats_earned["strength"],
                "endurance": (character.stats.endurance or 1) + stats_earned["endurance"],
                "recovery": (character.stats.recovery or 1) + stats_earned["recovery"],
                "discipline": (character.stats.discipline or 1) + stats_earned["discipline"],
                "focus": (character.stats.focus or 1) + stats_earned["focus"],
            }
        )

    await db.economylog.create(
        data={
            "characterId": character.id,
            "currency": "EXP",
            "amount": total_exp,
            "reason": f"Completed Workout Session ({int(total_volume)} kg volume)",
            "source": "WORKOUT",
        }
    )

    await db.progresshistory.create(
        data={
            "characterId": character.id,
            "type": "WORKOUT_COMPLETED",
            "amount": total_exp,
            "description": f"Completed workout session. Gained +{total_exp} EXP, +{total_gold} Gold, and stat increases.",
        }
    )

    return {
        "exp": total_exp,
        "gold": total_gold,
        "statsEarned": stats_earned,
        "volume": round(total_volume, 1),
        "duration": duration,
    }


async def generate_weekly_boss(character_id: str) -> Any:
    """
    Generates or retrieves the active WeeklyBoss for a character.
    Calculates physical target at ~90% of highest compound 1RM for 3-5 reps.
    """
    now = datetime.now(timezone.utc)

    # Check for existing unexpired WeeklyBoss
    existing_boss = await db.weeklyboss.find_first(
        where={
            "characterId": character_id,
            "expiresAt": {"gt": now},
        },
        order={"createdAt": "desc"}
    )
    if existing_boss:
        return existing_boss

    # Query highest historical PR for character
    top_pr = await db.personalrecord.find_first(
        where={"characterId": character_id},
        order={"weight": "desc"},
        include={"exercise": True}
    )

    if top_pr and top_pr.exercise:
        target_exercise = top_pr.exercise.name
        # 90% of PR weight
        target_weight = round(top_pr.weight * 0.9, 1)
        if target_weight < 20.0:
            target_weight = 60.0
        target_reps = 5
    else:
        target_exercise = "Barbell Bench Press"
        target_weight = 60.0
        target_reps = 5

    boss_names = [
        "Iron Golem — Fortress of Steel",
        "Titan of Iron — Overload Lord",
        "Colossus of Muscle — Gym Behemoth",
        "Obsidian Sentinel — Heavy Crusher",
    ]
    boss_name = boss_names[hash(character_id) % len(boss_names)]

    rewards_obj = {
        "exp": 500,
        "gold": 100,
        "stat": "strength",
        "statAmount": 1,
    }

    expires_at = now + timedelta(days=7)

    boss = await db.weeklyboss.create(
        data={
            "characterId": character_id,
            "name": boss_name,
            "targetExercise": target_exercise,
            "targetWeight": target_weight,
            "targetReps": target_reps,
            "rewards": json.dumps(rewards_obj),
            "isDefeated": False,
            "expiresAt": expires_at,
        }
    )
    return boss


async def check_boss_defeat(session_id: str, character_id: str) -> tuple[bool, Optional[Dict[str, Any]]]:
    """
    Checks if any exercise log set in a completed session meets or exceeds the
    active WeeklyBoss target. If so, marks the boss as defeated and awards massive rewards.
    """
    now = datetime.now(timezone.utc)
    active_boss = await db.weeklyboss.find_first(
        where={
            "characterId": character_id,
            "isDefeated": False,
            "expiresAt": {"gt": now},
        }
    )

    if not active_boss:
        return False, None

    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={
            "exerciseLogs": {
                "include": {
                    "exercise": True,
                }
            }
        }
    )

    if not session or not session.exerciseLogs:
        return False, None

    # Check if any log meets or exceeds boss target
    boss_defeated = False
    for log in session.exerciseLogs:
        if not log.exercise:
            continue
        ex_name = log.exercise.name.lower()
        target_ex = active_boss.targetExercise.lower()

        # Check name containment or match
        if (target_ex in ex_name or ex_name in target_ex) and (log.weight >= active_boss.targetWeight) and (log.reps >= active_boss.targetReps):
            boss_defeated = True
            break

    if boss_defeated:
        await db.weeklyboss.update(
            where={"id": active_boss.id},
            data={"isDefeated": True}
        )

        rewards_dict = json.loads(active_boss.rewards)

        # Grant Boss Rewards (+500 EXP, +100 Gold, +1 Strength)
        character = await db.character.find_unique(
            where={"id": character_id},
            include={"stats": True}
        )
        if character:
            await db.character.update(
                where={"id": character_id},
                data={
                    "exp": (character.exp or 0) + rewards_dict.get("exp", 500),
                    "gold": (character.gold or 0) + rewards_dict.get("gold", 100),
                }
            )
            if character.stats:
                await db.characterstats.update(
                    where={"characterId": character_id},
                    data={
                        "strength": (character.stats.strength or 1) + rewards_dict.get("statAmount", 1)
                    }
                )

        return True, rewards_dict

    return False, None
