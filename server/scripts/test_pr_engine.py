import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from utils.fitness_math import calculate_estimated_1rm
from services.fitness_engine import detect_personal_records, generate_overload_suggestion
from routers.fitness import start_workout_session, create_exercise_log, finish_workout_session, get_personal_records
from schemas.fitness import WorkoutSessionStartSchema, ExerciseLogCreateSchema

async def main():
    await db.connect()
    
    # 1. Test 1RM Brzycki Math
    print("Testing 1RM Brzycki formula...")
    orm_100_5 = calculate_estimated_1rm(100.0, 5)
    print(f"100kg x 5 reps -> Estimated 1RM = {orm_100_5}kg")
    assert abs(orm_100_5 - 112.5) < 1.0, f"Unexpected 1RM value: {orm_100_5}"

    # 2. Setup character and exercise
    char = await ensure_character_exists("char-id-123")
    exercise = await db.exercise.find_first(where={"category": "Chest"})
    assert exercise is not None

    # Clean old PRs for clean test
    await db.personalrecord.delete_many(
        where={"characterId": char.id, "exerciseId": exercise.id}
    )

    # 3. Start workout session
    session = await start_workout_session(WorkoutSessionStartSchema(characterId=char.id))

    # 4. Log a PR set: 100kg x 5
    await create_exercise_log(
        session.id,
        ExerciseLogCreateSchema(
            exerciseId=exercise.id,
            set=1,
            weight=100.0,
            reps=8,
            rpe=9.0,
            restTime=120,
            notes="PR Test Set",
        )
    )

    # 5. Finish session & verify PR detection
    res = await finish_workout_session(session.id)
    new_prs = res.get("newPRs", [])
    print(f"Detected PRs on finish: {len(new_prs)}")
    assert len(new_prs) > 0, "Failed to detect new PR!"
    print(f"PR Created: {new_prs[0].exercise.name} - {new_prs[0].weight}kg x {new_prs[0].reps} (1RM: {new_prs[0].estimated1RM}kg)")

    # 6. Verify GET /api/fitness/prs/{characterId}
    prs = await get_personal_records(char.id)
    print(f"Character PR History total: {len(prs)}")
    assert len(prs) > 0

    # 7. Verify Progressive Overload Suggestion
    overload = await generate_overload_suggestion(char.id, exercise.id)
    print(f"Overload Suggestion: {overload['message']}")
    assert overload["shouldIncrease"] is True, "Overload should recommend weight increase!"

    await db.disconnect()
    print("PR Engine & Progressive Overload tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
