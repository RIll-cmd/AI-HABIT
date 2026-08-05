import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from routers.fitness import (
    get_weekly_boss_endpoint,
    start_workout_session,
    create_exercise_log,
    finish_workout_session,
)
from schemas.fitness import WorkoutSessionStartSchema, ExerciseLogCreateSchema

async def main():
    await db.connect()
    char = await ensure_character_exists("char-id-123")

    # 1. Fetch/Generate Weekly Boss
    print("Testing GET /api/fitness/boss/{characterId}...")
    boss = await get_weekly_boss_endpoint(char.id)
    print(f"Weekly Boss: '{boss.name}' — Target: {boss.targetExercise} {boss.targetWeight}kg x {boss.targetReps} (isDefeated: {boss.isDefeated})")
    assert boss is not None and boss.name is not None

    # 2. Get exercise matching boss target exercise name
    exercise = await db.exercise.find_first(where={"name": boss.targetExercise})
    if not exercise:
        exercise = await db.exercise.find_first(where={"category": "Chest"})
    assert exercise is not None

    # 3. Start session & log set matching boss target
    session = await start_workout_session(WorkoutSessionStartSchema(characterId=char.id))

    print(f"Logging set to match boss target: {boss.targetWeight}kg x {boss.targetReps}...")
    await create_exercise_log(
        session.id,
        ExerciseLogCreateSchema(
            exerciseId=exercise.id,
            set=1,
            weight=boss.targetWeight,
            reps=boss.targetReps,
            rpe=9.5,
            restTime=120,
            notes="Boss Fight Set",
        )
    )

    # 4. Finish session & verify boss defeat check
    print("Testing POST /api/fitness/sessions/{id}/finish for Boss Defeat...")
    res = await finish_workout_session(session.id)
    is_boss_defeated = res.get("bossDefeated", False)
    print(f"Boss Defeated Result: {is_boss_defeated}")
    assert is_boss_defeated is True, "Boss should be marked as defeated!"

    # 5. Verify boss is marked defeated in DB
    updated_boss = await db.weeklyboss.find_unique(where={"id": boss.id})
    assert updated_boss.isDefeated is True, "WeeklyBoss record in DB should have isDefeated = True"

    await db.disconnect()
    print("Weekly Boss Capstone tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
