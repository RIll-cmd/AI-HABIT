import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from services.text_parser import parse_workout_text
from routers.fitness import start_workout_session, create_exercise_log_from_text
from schemas.fitness import WorkoutSessionStartSchema, TextLogSchema

async def main():
    await db.connect()

    # 1. Test text parser function directly
    print("Testing text_parser service...")
    parsed1 = await parse_workout_text("Bench Press 60 for 8")
    print(f"Parsed 'Bench Press 60 for 8': Exercise='{parsed1['exercise'].name}', Weight={parsed1['weight']}, Reps={parsed1['reps']}")
    assert parsed1["weight"] == 60.0 and parsed1["reps"] == 8

    parsed2 = await parse_workout_text("Squat 100 5 rpe 9")
    print(f"Parsed 'Squat 100 5 rpe 9': Exercise='{parsed2['exercise'].name}', Weight={parsed2['weight']}, Reps={parsed2['reps']}, RPE={parsed2['rpe']}")
    assert parsed2["weight"] == 100.0 and parsed2["reps"] == 5 and parsed2["rpe"] == 9.0

    # 2. Test log-text endpoint via FastAPI handler
    char = await ensure_character_exists("char-id-123")
    session = await start_workout_session(WorkoutSessionStartSchema(characterId=char.id))

    print("Testing POST /api/fitness/sessions/{session_id}/log-text...")
    log_entry = await create_exercise_log_from_text(
        session.id,
        TextLogSchema(text="Barbell Bench Press 85kg for 6 reps")
    )
    print(f"Log-Text Endpoint Success! Created log: {log_entry.exercise.name} - {log_entry.weight}kg x {log_entry.reps} (Set #{log_entry.set})")
    assert log_entry.weight == 85.0 and log_entry.reps == 6

    await db.disconnect()
    print("Text/Voice Parser & Quick Log API tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
