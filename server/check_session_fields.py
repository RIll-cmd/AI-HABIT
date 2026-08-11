import asyncio
from db import db

async def test():
    await db.connect()
    # Find one workoutsession or print its fields
    session = await db.workoutsession.find_first()
    if session:
        print("WorkoutSession fields:", session.__dict__)
    else:
        # Create a temporary test session to see default fields
        temp = await db.workoutsession.create(data={"characterId": "char-id-123"})
        print("Created WorkoutSession fields:", temp.__dict__)
    await db.disconnect()

if __name__ == '__main__':
    asyncio.run(test())
