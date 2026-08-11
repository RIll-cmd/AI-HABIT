import asyncio
from db import db
from routers.fitness import start_workout_session
from schemas.fitness import WorkoutSessionStartSchema

async def test():
    await db.connect()
    print("--- Testing start_workout_session ---")
    try:
        payload = WorkoutSessionStartSchema(characterId="char-id-123")
        res = await start_workout_session(payload)
        print("Session started successfully:", res)
    except Exception as e:
        import traceback
        print("Error starting session:", e)
        traceback.print_exc()
    await db.disconnect()

if __name__ == '__main__':
    asyncio.run(test())
