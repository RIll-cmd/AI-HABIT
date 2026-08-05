import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from routers.fitness import start_workout_session, create_exercise_log, finish_workout_session
from schemas.fitness import WorkoutSessionStartSchema, ExerciseLogCreateSchema

async def main():
    await db.connect()
    print("Ensuring test character exists...")
    char = await ensure_character_exists("char-id-123")
    print(f"Character ready: {char.name} ({char.id})")

    # 1. Get an exercise ID
    exercise = await db.exercise.find_first(where={"category": "Chest"})
    assert exercise is not None, "No exercise found!"
    print(f"Using test exercise: {exercise.name} ({exercise.id})")

    # 2. Start session
    print("Testing POST /api/fitness/sessions/start...")
    session = await start_workout_session(
        WorkoutSessionStartSchema(characterId=char.id)
    )
    print(f"Started session ID: {session.id}, completed={session.completed}")

    # 3. Log set 1
    print("Testing POST /api/fitness/sessions/{id}/log (Set 1)...")
    log1 = await create_exercise_log(
        session.id,
        ExerciseLogCreateSchema(
            exerciseId=exercise.id,
            set=1,
            weight=80.0,
            reps=8,
            rpe=8.5,
            restTime=90,
            notes="Felt strong",
        )
    )
    print(f"Logged Set #1: {log1.weight}kg x {log1.reps} reps (ID: {log1.id})")

    # 4. Log set 2
    print("Testing POST /api/fitness/sessions/{id}/log (Set 2)...")
    log2 = await create_exercise_log(
        session.id,
        ExerciseLogCreateSchema(
            exerciseId=exercise.id,
            set=2,
            weight=82.5,
            reps=6,
            rpe=9.0,
            restTime=120,
            notes="PR attempt",
        )
    )
    print(f"Logged Set #2: {log2.weight}kg x {log2.reps} reps (ID: {log2.id})")

    # 5. Finish session
    print("Testing POST /api/fitness/sessions/{id}/finish...")
    finished_session = await finish_workout_session(session.id)
    print(f"Finished Session: completed={finished_session.completed}, duration={finished_session.duration}s, logs={len(finished_session.exerciseLogs)}")

    await db.disconnect()
    print("Workout session flow test completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
