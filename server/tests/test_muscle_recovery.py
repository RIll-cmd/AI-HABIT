import os
import sys
import asyncio

# Ensure server root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from routers.workouts import get_muscle_status, log_workout, reset_muscle_recovery, WorkoutLogInput, SetInput

async def run_tests():
    print("Connecting to DB for Muscle Recovery Test Suite...", flush=True)
    await db.connect()
    
    test_user_id = "test-muscle-user-99"
    char = await ensure_character_exists(test_user_id)
    print(f"Character ready: id={char.id}, name={char.name}", flush=True)

    # 1. Reset recovery
    reset_res = await reset_muscle_recovery(char.id)
    assert reset_res["status"]["summary"]["freshCount"] == 16, "All 16 muscles should be fresh!"

    # 2. Log a workout targeting Chest (ex1) and Quads (ex2)
    workout_input = WorkoutLogInput(
        characterId=char.id,
        durationSeconds=1800,
        sets=[
            SetInput(exerciseId="ex1", weight=100.0, reps=8, rpe=8.5),
            SetInput(exerciseId="ex1", weight=100.0, reps=8, rpe=9.0),
            SetInput(exerciseId="ex1", weight=105.0, reps=6, rpe=9.5),
            SetInput(exerciseId="ex2", weight=140.0, reps=5, rpe=8.0),
            SetInput(exerciseId="ex2", weight=140.0, reps=5, rpe=8.5),
        ],
        sex="M",
        bodyweight=75.0
    )
    
    log_res = await log_workout(workout_input)
    assert log_res['sessionId'] is not None
    
    # 3. Check updated muscle status
    status_res = await get_muscle_status(char.id)
    
    chest_data = status_res["muscles"]["CHEST"]
    triceps_data = status_res["muscles"]["TRICEPS"]
    quads_data = status_res["muscles"]["QUADS"]
    biceps_data = status_res["muscles"]["BICEPS"]
    
    assert chest_data["fatigue"] >= 40.0, "Chest fatigue should be >= 40%"
    assert triceps_data["fatigue"] >= 15.0, "Triceps fatigue should be >= 15%"
    assert biceps_data["freshness"] == 100.0, "Biceps should be 100% fresh"
    
    print("[SUCCESS] All Muscle Recovery Engine tests passed successfully!", flush=True)
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(run_tests())
