import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from routers.fitness import get_exercises

async def main():
    await db.connect()
    exercises = await get_exercises()
    print(f"Total exercises retrieved: {len(exercises)}")
    print("Sample exercises:")
    for ex in exercises[:5]:
        print(f" - [{ex.category}] {ex.name} ({ex.equipment} / {ex.difficulty})")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
