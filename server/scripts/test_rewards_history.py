import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from routers.fitness import start_workout_session, create_exercise_log, finish_workout_session, get_workout_history
from schemas.fitness import WorkoutSessionStartSchema, ExerciseLogCreateSchema

async def main():
    await db.connect()
    char = await ensure_character_exists("char-id-123")
    print(f"Testing rewards for Character: {char.name} (EXP: {char.exp}, Gold: {char.gold})")

    exercise = await db.exercise.find_first(where={"category": "Back"})
    assert exercise is not None

    # 1. Start workout session
    session = await start_workout_session(WorkoutSessionStartSchema(characterId=char.id))

    # 2. Log sets
    await create_exercise_log(
        session.id,
        ExerciseLogCreateSchema(
            exerciseId=exercise.id,
            set=1,
            weight=70.0,
            reps=10,
            rpe=8.0,
            restTime=60,
        )
    )
    await create_exercise_log(
        session.id,
        ExerciseLogCreateSchema(
            exerciseId=exercise.id,
            set=2,
            weight=75.0,
            reps=8,
            rpe=8.5,
            restTime=90,
        )
    )

    # 3. Finish session and verify rewards return
    result = await finish_workout_session(session.id)
    rewards = result.get("rewards")
    print("Workout Session Finished! Received Rewards:", rewards)

    assert rewards is not None, "Rewards payload missing!"
    assert rewards["exp"] > 0, "EXP reward should be > 0"
    assert rewards["gold"] > 0, "Gold reward should be > 0"

    # 4. Verify updated Character in DB
    updated_char = await db.character.find_unique(
        where={"id": char.id},
        include={"stats": True}
    )
    print(f"Updated Character: EXP={updated_char.exp}, Gold={updated_char.gold}, Stats={updated_char.stats}")

    # 5. Verify Workout History API
    history = await get_workout_history(char.id)
    print(f"Workout History returned {len(history)} sessions.")
    assert len(history) > 0, "Workout history should return completed sessions!"

    await db.disconnect()
    print("Workout Rewards & History tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
