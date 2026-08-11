from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.fitness import WorkoutSessionStartSchema, ExerciseLogCreateSchema, TextLogSchema
from services.fitness_engine import (
    detect_personal_records,
    generate_overload_suggestion,
    calculate_workout_rewards,
    generate_weekly_boss,
    check_boss_defeat,
)
from services.text_parser import parse_workout_text
from services.boss_engine import deal_boss_damage

router = APIRouter(prefix="/api/fitness", tags=["fitness"])


@router.get("/exercises")
async def get_exercises():
    """
    Returns all master exercises from the database ordered by category and name.
    """
    try:
        from routers.workouts import seed_exercises_auto
        await seed_exercises_auto()
        exercises = await db.exercisedefinition.find_many(
            order={"name": "asc"}
        )
        return exercises
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch exercises: {str(e)}"
        )


@router.post("/sessions/start")
async def start_workout_session(payload: WorkoutSessionStartSchema):
    """
    Starts a new active WorkoutSession for a character.
    Automatically ensures the character exists in the database.
    """
    character = await ensure_character_exists(payload.characterId)

    try:
        existing_active = await db.workoutsession.find_first(
            where={
                "characterId": character.id,
                "durationSeconds": None,
            },
            include={
                "sets": {
                    "include": {
                        "exercise": True,
                    }
                }
            }
        )
        if existing_active:
            return existing_active

        session = await db.workoutsession.create(
            data={
                "characterId": character.id,
                "date": datetime.now(timezone.utc),
            },
            include={
                "sets": {
                    "include": {
                        "exercise": True,
                    }
                }
            }
        )
        return session
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start workout session: {str(e)}"
        )


@router.post("/sessions/{session_id}/log")
async def create_exercise_log(session_id: str, payload: ExerciseLogCreateSchema):
    """
    Appends a new WorkoutSet entry to the specified WorkoutSession.
    Log entries are strictly append-only.
    """
    session = await db.workoutsession.find_unique(where={"id": session_id})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workout session '{session_id}' not found."
        )

    exercise = await db.exercisedefinition.find_unique(where={"id": payload.exerciseId})
    if not exercise:
        exercise = await db.exercisedefinition.find_first(
            where={
                "OR": [
                    {"name": payload.exerciseId},
                    {"id": payload.exerciseId}
                ]
            }
        )
    if not exercise:
        from routers.workouts import seed_exercises_auto
        await seed_exercises_auto()
        exercise = await db.exercisedefinition.find_first(
            where={
                "OR": [
                    {"id": payload.exerciseId},
                    {"name": payload.exerciseId}
                ]
            }
        )
    if not exercise:
        exercise = await db.exercisedefinition.create(
            data={
                "id": payload.exerciseId if payload.exerciseId.startswith("ex") else f"ex-{payload.exerciseId}",
                "name": payload.exerciseId,
                "primaryMuscle": "Chest",
                "equipment": "Barbell",
                "trackingMetrics": "Weight, Reps"
            }
        )

    try:
        log_entry = await db.workoutset.create(
            data={
                "sessionId": session_id,
                "exerciseId": exercise.id,
                "weight": payload.weight,
                "reps": payload.reps,
                "rpe": payload.rpe,
                "createdAt": datetime.now(timezone.utc),
            },
            include={
                "exercise": True,
            }
        )
        
        # Calculate & deduct real-time Weekly Boss PR damage
        from services.fitness_engine import apply_set_boss_damage
        boss_damage = await apply_set_boss_damage(
            character_id=session.characterId,
            exercise_name=exercise.name,
            weight=payload.weight,
            reps=payload.reps
        )

        res_dict = log_entry.model_dump() if hasattr(log_entry, "model_dump") else log_entry.__dict__
        res_dict["bossDamage"] = boss_damage
        return res_dict
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to log exercise set: {str(e)}"
        )


@router.post("/sessions/{session_id}/log-text")
async def create_exercise_log_from_text(session_id: str, payload: TextLogSchema):
    """
    Parses a raw text string (Phase 1 Voice Simulator) such as 'Bench Press 60 for 8'
    and appends a new WorkoutSet entry to the WorkoutSession.
    """
    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={"sets": True}
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workout session '{session_id}' not found."
        )

    parsed = await parse_workout_text(payload.text)
    if "error" in parsed or not parsed.get("exerciseId"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=parsed.get("error", "Failed to parse workout text.")
        )

    exercise_id = parsed["exerciseId"]
    weight = parsed["weight"]
    reps = parsed["reps"]
    rpe = parsed.get("rpe")

    existing_sets = [log for log in (session.sets or []) if log.exerciseId == exercise_id]
    set_num = len(existing_sets) + 1

    if parsed.get("isSameWeight") and weight == -1.0:
        if existing_sets:
            weight = float(existing_sets[-1].weight)
        else:
            # Fallback to history
            last_log = await db.workoutset.find_first(
                where={"exerciseId": exercise_id, "session": {"characterId": session.characterId}},
                order={"createdAt": "desc"}
            )
            weight = float(last_log.weight) if last_log else 20.0

    try:
        log_entry = await db.workoutset.create(
            data={
                "sessionId": session_id,
                "exerciseId": exercise_id,
                "weight": weight,
                "reps": reps,
                "rpe": rpe,
                "createdAt": datetime.now(timezone.utc),
            },
            include={
                "exercise": True,
            }
        )
        
        # Calculate & deduct real-time Weekly Boss PR damage
        from services.fitness_engine import apply_set_boss_damage
        ex_def = log_entry.exercise
        ex_name = ex_def.name if ex_def else "Bench Press"
        boss_damage = await apply_set_boss_damage(
            character_id=session.characterId,
            exercise_name=ex_name,
            weight=weight,
            reps=reps
        )

        res_dict = log_entry.model_dump() if hasattr(log_entry, "model_dump") else log_entry.__dict__
        res_dict["bossDamage"] = boss_damage
        return res_dict
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to log exercise set from text: {str(e)}"
        )


@router.post("/sessions/{session_id}/finish")
async def finish_workout_session(session_id: str):
    """
    Marks a WorkoutSession as completed, calculates total duration, detects PRs,
    checks if active WeeklyBoss was defeated, computes & applies RPG rewards, and returns session payload.
    """
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
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workout session '{session_id}' not found."
        )

    finished_at = datetime.now(timezone.utc)
    started_at = session.date or finished_at
    duration_seconds = max(60, int((finished_at - started_at).total_seconds()))

    try:
        if session.durationSeconds is None:
            session = await db.workoutsession.update(
                where={"id": session_id},
                data={
                    "durationSeconds": duration_seconds,
                },
                include={
                    "sets": {
                        "include": {
                            "exercise": True,
                        }
                    }
                }
            )

        # Detect PRs
        new_prs = await detect_personal_records(session_id, session.characterId)

        # Check Weekly Boss Defeat
        is_boss_defeated, boss_rewards = await check_boss_defeat(session_id, session.characterId)

        # Calculate rewards
        rewards = await calculate_workout_rewards(session_id, len(new_prs))

        # Deal Real-Life Boss Damage (if linked)
        await deal_boss_damage(
            db=db,
            character_id=session.characterId,
            activity_type="WORKOUT",
            reference_id=""
        )

        res_dict = session.model_dump() if hasattr(session, "model_dump") else session.__dict__
        res_dict["newPRs"] = new_prs
        res_dict["rewards"] = rewards
        res_dict["bossDefeated"] = is_boss_defeated
        res_dict["bossRewards"] = boss_rewards
        return res_dict

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to finish workout session: {str(e)}"
        )


@router.get("/sessions/active/{character_id}")
async def get_active_session(character_id: str):
    """
    Returns any active (uncompleted) session for the specified character.
    """
    await ensure_character_exists(character_id)
    session = await db.workoutsession.find_first(
        where={
            "characterId": character_id,
            "durationSeconds": None,
        },
        include={
            "sets": {
                "include": {
                    "exercise": True,
                }
            }
        }
    )
    return session


@router.get("/sessions/history/{character_id}")
async def get_workout_history(character_id: str):
    """
    Returns completed workout sessions for a character, ordered by most recent,
    including nested exercise logs with exercise details.
    """
    await ensure_character_exists(character_id)
    history = await db.workoutsession.find_many(
        where={
            "characterId": character_id,
            "durationSeconds": {"not": None},
        },
        include={
            "sets": {
                "include": {
                    "exercise": True,
                }
            },
        },
        order={"date": "desc"}
    )
    return history


@router.get("/sessions/{session_id}")
async def get_session_details(session_id: str):
    """
    Returns session details with all logged exercises.
    """
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
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workout session '{session_id}' not found."
        )
    return session


@router.get("/prs/{character_id}")
async def get_personal_records(character_id: str):
    """
    Returns all Personal Record entries for a character ordered by date descending.
    """
    await ensure_character_exists(character_id)
    prs = await db.workoutset.find_many(
        where={
            "session": {"characterId": character_id},
            "isPr": True,
        },
        include={"exercise": True},
        order={"createdAt": "desc"}
    )
    return prs


@router.get("/overload/{character_id}/{exercise_id}")
async def get_overload_recommendation(character_id: str, exercise_id: str):
    """
    Generates a progressive overload recommendation for an exercise.
    """
    await ensure_character_exists(character_id)
    recommendation = await generate_overload_suggestion(character_id, exercise_id)
    return recommendation


@router.get("/overload-batch/{character_id}")
async def get_overload_batch(character_id: str):
    """
    Generates progressive overload recommendations for all exercises in recent sessions,
    avoiding N+1 fetches from the frontend.
    """
    await ensure_character_exists(character_id)
    pass

@router.post("/overload-batch/{character_id}")
async def post_overload_batch(character_id: str, exercise_ids: list[str]):
    """
    Batch overload recommendation for a list of exercises.
    """
    await ensure_character_exists(character_id)
    results = {}
    for ex_id in exercise_ids:
        results[ex_id] = await generate_overload_suggestion(character_id, ex_id)
    return results


@router.get("/boss/{character_id}")
async def get_weekly_boss_endpoint(character_id: str):
    """
    Returns the current active weekly boss for a character (or generates a new one if missing/expired).
    """
    await ensure_character_exists(character_id)
    boss = await generate_weekly_boss(character_id)
    return boss


@router.get("/boss/{character_id}/damage-preview")
async def get_boss_damage_preview(character_id: str, session_id: str):
    """
    Returns the accumulated damage from the active session without finalizing it.
    """
    await ensure_character_exists(character_id)
    
    now = datetime.now(timezone.utc)
    active_boss = await db.weeklyboss.find_first(
        where={
            "characterId": character_id,
            "isDefeated": False,
            "expiresAt": {"gt": now},
        }
    )
    if not active_boss:
        return {"damage": 0.0}
        
    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={"sets": {"include": {"exercise": True}}}
    )
    if not session or not session.sets:
        return {"damage": active_boss.currentDamage}

    from services.fitness_engine import calculate_boss_damage

    total_damage = active_boss.currentDamage
    for log in session.sets:
        if not log.exercise: continue
        ex_name = log.exercise.name.lower()
        target_ex = active_boss.targetExercise.lower()
        if target_ex in ex_name or ex_name in target_ex:
            damage = calculate_boss_damage(float(log.weight), log.reps, float(active_boss.targetWeight), active_boss.targetReps)
            total_damage += damage

    return {"damage": min(1.0, total_damage)}
