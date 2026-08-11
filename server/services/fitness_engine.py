import json
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from db import db
from utils.fitness_math import calculate_estimated_1rm


async def detect_personal_records(session_id: str, character_id: str) -> List[Any]:
    """
    Scans all WorkoutSet entries for a completed WorkoutSession.
    Calculates estimated 1RM for each set and compares against character's
    existing PersonalRecord history. Inserts new PR records if broken.
    Returns list of newly achieved PersonalRecord objects.
    """
    new_prs = []

    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={
            "sets": {
                "include": {
                    "exercise": True,
                }
            }
        }
    )

    if not session or not session.sets:
        return new_prs

    exercise_map: Dict[str, List[Any]] = {}
    for log in session.sets:
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

        existing_pr = await db.workoutset.find_first(
            where={
                "session": {"characterId": character_id},
                "exerciseId": exercise_id,
                "isPr": True,
            },
            order={"weight": "desc"},
            include={"exercise": True}
        )

        if not existing_pr or float(best_set.weight) > (float(existing_pr.weight) + 0.01):
            pr_record = await db.workoutset.create(
                data={
                    "sessionId": session_id,
                    "exerciseId": exercise_id,
                    "weight": float(best_set.weight),
                    "reps": int(best_set.reps),
                    "isPr": True,
                    "createdAt": datetime.now(timezone.utc),
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
    Hybrid approach: flat +2.5kg for compounds, +5% for isolations. Rep increase for high RPE.
    """
    recent_logs = await db.workoutset.find_many(
        where={
            "exerciseId": exercise_id,
            "session": {
                "characterId": character_id,
                "durationSeconds": {"not": None},
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
            "shouldIncrease": False,
            "overloadType": "MAINTAIN"
        }

    max_weight_log = max(recent_logs, key=lambda l: l.weight)
    curr_weight = float(max_weight_log.weight)
    curr_reps = int(max_weight_log.reps)
    exercise_cat = max_weight_log.exercise.category if hasattr(max_weight_log.exercise, 'category') else "Compound"

    # Analyze RPE across recent top sets
    top_sets = [l for l in recent_logs if float(l.weight) >= curr_weight * 0.95]
    avg_rpe = sum(l.rpe for l in top_sets if l.rpe) / len([l for l in top_sets if l.rpe]) if any(l.rpe for l in top_sets) else 8.0

    if curr_reps >= 8:
        if avg_rpe >= 9.0:
            return {
                "exerciseId": exercise_id,
                "currentWeight": curr_weight,
                "recommendedWeight": curr_weight,
                "suggestedReps": f"{curr_reps + 1}-{curr_reps + 2}",
                "message": f"High RPE ({round(avg_rpe, 1)}) detected. Push for {curr_reps + 1}-{curr_reps + 2} reps before adding weight.",
                "shouldIncrease": True,
                "overloadType": "REP_UP"
            }
        
        # Hybrid scaling
        if exercise_cat == "Isolation" or (hasattr(max_weight_log.exercise, 'primaryMuscle') and max_weight_log.exercise.primaryMuscle in ["Arms", "Biceps", "Triceps", "Shoulders"]):
            recommended_weight = round(curr_weight * 1.05 * 2) / 2 # +5%, rounded to nearest 0.5kg
            if recommended_weight == curr_weight: recommended_weight += 1.0
        else:
            recommended_weight = curr_weight + 2.5
            
        return {
            "exerciseId": exercise_id,
            "currentWeight": curr_weight,
            "recommendedWeight": recommended_weight,
            "suggestedReps": "6-8",
            "message": f"Overload Ready! Last session you hit {curr_weight}kg x {curr_reps} reps cleanly. Recommend increasing weight to {recommended_weight}kg next session.",
            "shouldIncrease": True,
            "overloadType": "WEIGHT_UP"
        }
    else:
        return {
            "exerciseId": exercise_id,
            "currentWeight": curr_weight,
            "recommendedWeight": curr_weight,
            "suggestedReps": f"{curr_reps + 1}-10",
            "message": f"Maintain {curr_weight}kg and aim to increase reps from {curr_reps} to 8 before advancing weight.",
            "shouldIncrease": False,
            "overloadType": "MAINTAIN"
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
            "sets": True,
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
    total_volume = sum(log.weight * log.reps for log in session.sets) if session.sets else 0.0
    duration = session.durationSeconds or 60
    goal = "Build Muscle"

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
    top_pr = await db.workoutset.find_first(
        where={
            "session": {"characterId": character_id},
            "isPr": True,
        },
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
        "Iron Golem - Fortress of Steel",
        "Titan of Iron - Overload Lord",
        "Colossus of Muscle - Gym Behemoth",
        "Obsidian Sentinel - Heavy Crusher",
    ]
    boss_name = boss_names[hash(character_id) % len(boss_names)]

    sprites = [
        "bat_cropped.gif", "bringer_of_death_cropped.png", "crab_cropped.gif",
        "golem_cropped.png", "gollux_cropped.png", "mushroom_cropped.png",
        "necromancer_cropped.png", "necromancer_sheet_cropped.png", "nightborne_cropped.png",
        "pebble_cropped.png", "rat_cropped.gif", "skull_cropped.png",
        "slime_cropped.gif", "wizard_cropped.png"
    ]
    boss_sprite = sprites[hash(character_id) % len(sprites)]

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
            "bossSprite": boss_sprite,
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
            "sets": {
                "include": {
                    "exercise": True,
                }
            }
        }
    )

    if not session or not session.sets:
        return False, None

    # Check if any log meets or exceeds boss target
    boss_defeated = False
    for log in session.sets:
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
        
    # Check for partial damage if not defeated
    total_damage = 0.0
    for log in session.sets:
        if not log.exercise: continue
        ex_name = log.exercise.name.lower()
        target_ex = active_boss.targetExercise.lower()
        if target_ex in ex_name or ex_name in target_ex:
            damage = calculate_boss_damage(float(log.weight), log.reps, float(active_boss.targetWeight), active_boss.targetReps)
            total_damage += damage

    if total_damage > 0.0:
        new_damage = min(1.0, active_boss.currentDamage + total_damage)
        await db.weeklyboss.update(
            where={"id": active_boss.id},
            data={"currentDamage": new_damage}
        )
        if new_damage >= 1.0:
            await db.weeklyboss.update(
                where={"id": active_boss.id},
                data={"isDefeated": True}
            )
            rewards_dict = json.loads(active_boss.rewards)
            # Grant Boss Rewards
            character = await db.character.find_unique(where={"id": character_id}, include={"stats": True})
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
                        data={"strength": (character.stats.strength or 1) + rewards_dict.get("statAmount", 1)}
                    )
            return True, rewards_dict

    return False, None


def calculate_boss_damage(log_weight: float, log_reps: int, target_weight: float, target_reps: int) -> float:
    """
    Returns percentage damage dealt by a set, scaled proportionally.
    Damage caps at 1.0 (100%) per set if perfectly matched.
    """
    if target_weight <= 0 or target_reps <= 0: return 0.0
    weight_ratio = min(1.0, log_weight / target_weight)
    reps_ratio = min(1.0, log_reps / target_reps)
    # Give weight ratio a slightly higher exponent so light weight high reps isn't overly rewarded
    return (weight_ratio ** 1.5) * reps_ratio


def normalize_exercise_name(name: str) -> str:
    """Normalizes exercise names by removing punctuation and common equipment modifiers."""
    import re
    cleaned = re.sub(r'[^\w\s]', ' ', name.lower())
    words = [w for w in cleaned.split() if w not in ["barbell", "dumbbell", "smith", "machine", "flat", "incline", "decline", "db", "bb"]]
    return " ".join(words).strip()


def check_exercise_match(ex1: str, ex2: str) -> bool:
    e1_raw = ex1.lower().strip()
    e2_raw = ex2.lower().strip()
    if e1_raw in e2_raw or e2_raw in e1_raw:
        return True
    
    norm1 = normalize_exercise_name(ex1)
    norm2 = normalize_exercise_name(ex2)
    if norm1 and norm2 and (norm1 in norm2 or norm2 in norm1):
        return True
        
    set1 = set(norm1.split())
    set2 = set(norm2.split())
    common = set1 & set2
    return len(common) >= 1 and any(token in ["bench", "press", "squat", "deadlift", "row", "pullup", "overhead", "curl"] for token in common)


async def apply_set_boss_damage(character_id: str, exercise_name: str, weight: float, reps: int) -> Dict[str, Any]:
    """
    Checks if a logged exercise set targets the active WeeklyBoss.
    If matched, calculates and deducts boss HP in DB and returns updated boss telemetry.
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
        return {"matched": False, "damageDealt": 0.0, "isDefeated": False, "hpPercent": 0.0}

    is_match = check_exercise_match(exercise_name, active_boss.targetExercise)

    if not is_match:
        current_hp_pct = max(0.0, 100.0 - (active_boss.currentDamage * 100.0))
        return {"matched": False, "damageDealt": 0.0, "isDefeated": active_boss.isDefeated, "hpPercent": round(current_hp_pct, 1)}

    target_vol = active_boss.targetWeight * active_boss.targetReps
    logged_vol = weight * reps
    
    if target_vol <= 0:
        damage_ratio = 1.0
    else:
        damage_ratio = min(1.0, logged_vol / target_vol)

    # Each set meeting full target deals 20% max HP damage (1.0 / 5.0)
    set_damage_percent = damage_ratio / 5.0
    damage_points = int(set_damage_percent * 10000)

    new_damage = min(1.0, active_boss.currentDamage + set_damage_percent)
    is_now_defeated = new_damage >= 1.0

    # Parse and append combat log
    existing_logs = []
    if hasattr(active_boss, "damageLogs") and active_boss.damageLogs:
        try:
            existing_logs = json.loads(active_boss.damageLogs)
        except:
            existing_logs = []

    log_entry = {
        "id": f"log-{int(now.timestamp())}-{len(existing_logs)}",
        "exerciseName": exercise_name,
        "weight": weight,
        "reps": reps,
        "damageDealt": damage_points,
        "damagePercent": round(set_damage_percent * 100.0, 1),
        "hpPercentAfter": round(max(0.0, 100.0 - (new_damage * 100.0)), 1),
        "createdAt": now.isoformat()
    }
    existing_logs.insert(0, log_entry)

    await db.weeklyboss.update(
        where={"id": active_boss.id},
        data={
            "currentDamage": new_damage,
            "isDefeated": is_now_defeated,
            "damageLogs": json.dumps(existing_logs[:20])
        }
    )

    rewards_granted = None
    if is_now_defeated and not active_boss.isDefeated:
        rewards_dict = json.loads(active_boss.rewards)
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
                    data={"strength": (character.stats.strength or 1) + rewards_dict.get("statAmount", 1)}
                )
        rewards_granted = rewards_dict

    hp_percent = max(0.0, 100.0 - (new_damage * 100.0))

    return {
        "matched": True,
        "exerciseName": exercise_name,
        "damagePoints": damage_points,
        "damageDealt": round(set_damage_percent * 100.0, 1),
        "isDefeated": is_now_defeated,
        "hpPercent": round(hp_percent, 1),
        "bossName": active_boss.name,
        "rewardsGranted": rewards_granted,
        "damageLog": log_entry
    }
