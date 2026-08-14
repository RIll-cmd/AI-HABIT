from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from db import db
from services.workout_engine import calculate_e1rm, determine_rank, get_exercise_standard
from services.boss_engine import deal_boss_damage

router = APIRouter()

class SetInput(BaseModel):
    exerciseId: str
    weight: float
    reps: int
    rpe: Optional[float] = None

class WorkoutLogInput(BaseModel):
    characterId: str
    durationSeconds: int
    sets: List[SetInput]
    sex: Optional[str] = "M"           # Default to M for MVP
    bodyweight: Optional[float] = 70.0 # Default to 70kg for MVP

@router.post("/log")
async def log_workout(data: WorkoutLogInput):
    # Verify character exists
    character = await db.character.find_unique(where={"id": data.characterId})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
        
    # Create the WorkoutSession
    session = await db.workoutsession.create(
        data={
            "characterId": data.characterId,
            "durationSeconds": data.durationSeconds
        }
    )
    
    results = []
    
    # Process each set in the workout session
    for s in data.sets:
        # Calculate Estimated 1RM
        e1rm = calculate_e1rm(s.weight, s.reps)
        
        # Fetch the Exercise Standard based on sex and bodyweight
        standard = await get_exercise_standard(db, s.exerciseId, data.sex, data.bodyweight)
        
        # Determine Rank
        rank = "E"
        if standard:
            rank = determine_rank(e1rm, standard)
            
        # Determine if this is a new PR
        # Look up previous sets for this character and exercise
        previous_sets = await db.workoutset.find_many(
            where={
                "session": {
                    "characterId": data.characterId
                },
                "exerciseId": s.exerciseId
            }
        )
        
        is_pr = True
        for prev_set in previous_sets:
            prev_e1rm = calculate_e1rm(prev_set.weight, prev_set.reps)
            if prev_e1rm >= e1rm:
                is_pr = False
                break
                
        # Save the WorkoutSet
        new_set = await db.workoutset.create(
            data={
                "sessionId": session.id,
                "exerciseId": s.exerciseId,
                "weight": s.weight,
                "reps": s.reps,
                "rpe": s.rpe,
                "isPr": is_pr
            }
        )
        
        # Directly trigger the Boss Damage engine to ensure workouts deal damage to Bosses
        boss_damage_results = await deal_boss_damage(db, data.characterId, "WORKOUT", s.exerciseId)
        
        results.append({
            "setId": new_set.id,
            "exerciseId": s.exerciseId,
            "e1rm": round(e1rm, 2),
            "rank": rank,
            "isPr": is_pr,
            "bossDamage": boss_damage_results
        })
        
    # Calculate Stat Rewards based on Muscle Groups logged
    strength_inc = 0
    endurance_inc = 0
    consistency_inc = 0
    discipline_inc = 2  # Session Finish reward
    recovery_inc = 2    # Session Finish reward

    for s in data.sets:
        ex_def = await db.exercisedefinition.find_unique(where={"id": s.exerciseId})
        muscle = (ex_def.primaryMuscle.lower() if ex_def else "chest")
        
        if muscle in ["chest", "back", "legs", "shoulders", "arms", "biceps", "triceps"]:
            strength_inc += 1
            endurance_inc += 1
        elif muscle in ["core", "abs", "cardio"]:
            endurance_inc += 2
            consistency_inc += 1
        else:
            strength_inc += 1

    exp_reward = len(data.sets) * 50
    gold_reward = len(data.sets) * 10
    
    # Calculate PR bonuses
    pr_count = sum(1 for r in results if r.get("isPr"))
    pr_gems = pr_count * 10
    pr_tokens = pr_count * 25
    pr_gold = pr_count * 50

    total_gold = gold_reward + pr_gold
    
    await db.character.update(
        where={"id": data.characterId},
        data={
            "exp": {"increment": exp_reward},
            "gold": {"increment": total_gold},
            "gems": {"increment": pr_gems},
            "towerTokens": {"increment": pr_tokens},
            "stats": {
                "update": {
                    "strength": {"increment": max(1, strength_inc)},
                    "endurance": {"increment": max(1, endurance_inc)},
                    "discipline": {"increment": discipline_inc},
                    "recovery": {"increment": recovery_inc},
                    "consistency": {"increment": max(1, consistency_inc)},
                }
            }
        }
    )

    if pr_count > 0:
        await db.economylog.create(
            data={
                "characterId": data.characterId,
                "currency": "GEMS",
                "amount": pr_gems,
                "reason": f"New PR Achieved ({pr_count} PR sets)",
                "source": "WORKOUT_PR"
            }
        )
        await db.economylog.create(
            data={
                "characterId": data.characterId,
                "currency": "TOWER_TOKENS",
                "amount": pr_tokens,
                "reason": f"New PR Achieved ({pr_count} PR sets)",
                "source": "WORKOUT_PR"
            }
        )
        await db.progresshistory.create(
            data={
                "characterId": data.characterId,
                "type": "WORKOUT_PR",
                "amount": pr_gems,
                "description": f"🔥 New Personal Record! Earned +{pr_gold} Gold, +{pr_gems} Gems, +{pr_tokens} Tower Tokens!"
            }
        )
        
    return {
        "sessionId": session.id,
        "message": "Workout successfully logged, character attributes enhanced, and boss damage applied.",
        "results": results
    }

@router.post("/finish")
async def finish_workout(data: WorkoutLogInput):
    """Alias endpoint for finishing workout sessions."""
    return await log_workout(data)

@router.get("/ranks/{character_id}")
async def get_workout_ranks(character_id: str):
    """
    Computes the max e1RM and current Rank for all exercises the character has logged.
    """
    sessions = await db.workoutsession.find_many(
        where={"characterId": character_id},
        include={"sets": {"include": {"exercise": True}}}
    )
    
    exercise_maxes = {}
    for session in sessions:
        for s in session.sets:
            e1rm = calculate_e1rm(s.weight, s.reps)
            ex_id = s.exerciseId
            if ex_id not in exercise_maxes or e1rm > exercise_maxes[ex_id]["e1rm"]:
                exercise_maxes[ex_id] = {
                    "exercise": s.exercise,
                    "e1rm": e1rm
                }
                
    results = []
    
    # Ranks order
    ranks_ladder = ["E", "D", "C", "B", "A", "S", "SS", "SSS"]
    
    for ex_id, data in exercise_maxes.items():
        ex = data["exercise"]
        e1rm = data["e1rm"]
        standard = await get_exercise_standard(db, ex_id, "M", 70.0)
        
        current_rank = "E"
        next_rank = "D"
        next_threshold = 0
        progress = 0
        
        if standard:
            current_rank = determine_rank(e1rm, standard)
            
            thresholds = {
                "E": standard.rankE,
                "D": standard.rankD,
                "C": standard.rankC,
                "B": standard.rankB,
                "A": standard.rankA,
                "S": standard.rankS,
                "SS": standard.rankSS,
                "SSS": standard.rankSSS
            }
            
            idx = ranks_ladder.index(current_rank)
            if idx < len(ranks_ladder) - 1:
                next_rank = ranks_ladder[idx + 1]
                next_threshold = thresholds[next_rank]
                prev_threshold = thresholds[current_rank]
                
                # Progress calculation
                range_size = next_threshold - prev_threshold
                if range_size > 0:
                    progress = ((e1rm - prev_threshold) / range_size) * 100
                    progress = min(100, max(0, progress))
            else:
                next_rank = "MAX"
                next_threshold = thresholds["SSS"]
                progress = 100
                
        results.append({
            "exerciseId": ex_id,
            "exerciseName": ex.name,
            "e1rm": round(e1rm, 2),
            "currentRank": current_rank,
            "nextRank": next_rank,
            "nextThreshold": next_threshold,
            "progress": round(progress, 1)
        })
        
    return {"ranks": results}

DEFAULT_EXERCISES = [
    {"id": "ex1", "name": "Barbell Bench Press", "primaryMuscle": "Chest", "equipment": "Barbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex2", "name": "Barbell Back Squat", "primaryMuscle": "Legs", "equipment": "Barbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex3", "name": "Barbell Deadlift", "primaryMuscle": "Back", "equipment": "Barbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex4", "name": "Overhead Barbell Press", "primaryMuscle": "Shoulders", "equipment": "Barbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex5", "name": "Dumbbell Bicep Curl", "primaryMuscle": "Arms", "equipment": "Dumbbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex6", "name": "Barbell Row", "primaryMuscle": "Back", "equipment": "Barbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex7", "name": "Incline Dumbbell Press", "primaryMuscle": "Chest", "equipment": "Dumbbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex8", "name": "Pull Up", "primaryMuscle": "Back", "equipment": "Bodyweight", "trackingMetrics": "Weight, Reps"},
    {"id": "ex9", "name": "Tricep Rope Pushdown", "primaryMuscle": "Arms", "equipment": "Cable", "trackingMetrics": "Weight, Reps"},
    {"id": "ex10", "name": "Dumbbell Lateral Raise", "primaryMuscle": "Shoulders", "equipment": "Dumbbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex11", "name": "Dips", "primaryMuscle": "Chest", "equipment": "Bodyweight", "trackingMetrics": "Weight, Reps"},
    {"id": "ex12", "name": "Lat Pulldown", "primaryMuscle": "Back", "equipment": "Cable", "trackingMetrics": "Weight, Reps"},
    {"id": "ex13", "name": "Romanian Deadlift", "primaryMuscle": "Legs", "equipment": "Barbell", "trackingMetrics": "Weight, Reps"},
    {"id": "ex14", "name": "Leg Press", "primaryMuscle": "Legs", "equipment": "Machine", "trackingMetrics": "Weight, Reps"},
    {"id": "ex15", "name": "Lying Leg Curl", "primaryMuscle": "Legs", "equipment": "Machine", "trackingMetrics": "Weight, Reps"},
    {"id": "ex16", "name": "Calf Raises", "primaryMuscle": "Legs", "equipment": "Machine", "trackingMetrics": "Weight, Reps"},
    {"id": "ex17", "name": "Cable Woodchoppers", "primaryMuscle": "Core", "equipment": "Cable", "trackingMetrics": "Weight, Reps"},
    {"id": "ex18", "name": "Hanging Leg Raises", "primaryMuscle": "Core", "equipment": "Bodyweight", "trackingMetrics": "Weight, Reps"},
    {"id": "ex19", "name": "Planks", "primaryMuscle": "Core", "equipment": "Bodyweight", "trackingMetrics": "Weight, Reps"},
    {"id": "ex20", "name": "Push-ups", "primaryMuscle": "Chest", "equipment": "Bodyweight", "trackingMetrics": "Weight, Reps"},
]

async def seed_exercises_auto():
    count = await db.exercisedefinition.count()
    if count == 0:
        for ex in DEFAULT_EXERCISES:
            await db.exercisedefinition.create(data=ex)

@router.get("/exercises")
async def get_exercises():
    """
    Returns all cataloged exercises across Chest, Back, Legs, Shoulders, Arms, and Core.
    """
    await seed_exercises_auto()
    exercises = await db.exercisedefinition.find_many(
        order={"name": "asc"}
    )
    return exercises
