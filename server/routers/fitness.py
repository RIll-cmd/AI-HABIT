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

router = APIRouter(prefix="/api/fitness", tags=["fitness"])


@router.get("/exercises")
async def get_exercises():
    """
    Returns all master exercises from the database ordered by category and name.
    """
    try:
        exercises = await db.exercise.find_many(
            order=[
                {"category": "asc"},
                {"name": "asc"},
            ]
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
                "completed": False,
            },
            include={
                "exerciseLogs": {
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
                "planId": payload.planId,
                "completed": False,
                "startedAt": datetime.now(timezone.utc),
            },
            include={
                "exerciseLogs": {
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
    Appends a new ExerciseLog set entry to the specified WorkoutSession.
    Log entries are strictly append-only.
    """
    session = await db.workoutsession.find_unique(where={"id": session_id})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workout session '{session_id}' not found."
        )

    exercise = await db.exercise.find_unique(where={"id": payload.exerciseId})
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise '{payload.exerciseId}' not found."
        )

    try:
        log_entry = await db.exerciselog.create(
            data={
                "sessionId": session_id,
                "exerciseId": payload.exerciseId,
                "set": payload.set,
                "weight": payload.weight,
                "reps": payload.reps,
                "rpe": payload.rpe,
                "restTime": payload.restTime,
                "notes": payload.notes,
                "createdAt": datetime.now(timezone.utc),
            },
            include={
                "exercise": True,
            }
        )
        return log_entry
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to log exercise set: {str(e)}"
        )


@router.post("/sessions/{session_id}/log-text")
async def create_exercise_log_from_text(session_id: str, payload: TextLogSchema):
    """
    Parses a raw text string (Phase 1 Voice Simulator) such as 'Bench Press 60 for 8'
    and appends a new ExerciseLog set entry to the WorkoutSession.
    """
    session = await db.workoutsession.find_unique(
        where={"id": session_id},
        include={"exerciseLogs": True}
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

    existing_sets = [log for log in (session.exerciseLogs or []) if log.exerciseId == exercise_id]
    set_num = len(existing_sets) + 1

    try:
        log_entry = await db.exerciselog.create(
            data={
                "sessionId": session_id,
                "exerciseId": exercise_id,
                "set": set_num,
                "weight": weight,
                "reps": reps,
                "rpe": rpe,
                "restTime": 60,
                "notes": f"Quick Text Log: '{payload.text}'",
                "createdAt": datetime.now(timezone.utc),
            },
            include={
                "exercise": True,
            }
        )
        return log_entry
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
            "exerciseLogs": {
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
    started_at = session.startedAt
    duration_seconds = int((finished_at - started_at).total_seconds())

    try:
        if not session.completed:
            session = await db.workoutsession.update(
                where={"id": session_id},
                data={
                    "completed": True,
                    "finishedAt": finished_at,
                    "duration": duration_seconds,
                },
                include={
                    "exerciseLogs": {
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
            "completed": False,
        },
        include={
            "exerciseLogs": {
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
            "completed": True,
        },
        include={
            "exerciseLogs": {
                "include": {
                    "exercise": True,
                }
            },
            "plan": True,
        },
        order={"startedAt": "desc"}
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
            "exerciseLogs": {
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
    prs = await db.personalrecord.find_many(
        where={"characterId": character_id},
        include={"exercise": True},
        order={"date": "desc"}
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


@router.get("/boss/{character_id}")
async def get_weekly_boss_endpoint(character_id: str):
    """
    Returns the current active weekly boss for a character (or generates a new one if missing/expired).
    """
    await ensure_character_exists(character_id)
    boss = await generate_weekly_boss(character_id)
    return boss
