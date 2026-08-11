import asyncio
from db import db
from db_utils import ensure_character_exists
from services.fitness_engine import generate_weekly_boss
from routers.tower import get_tower_floors
from routers.shop import get_shop_items

async def test():
    await db.connect()
    print("--- Testing ensure_character_exists ---")
    char = await ensure_character_exists('char-id-123')
    print("Char:", char.id)
    
    print("\n--- Testing generate_weekly_boss ---")
    try:
        boss = await generate_weekly_boss('char-id-123')
        print("Boss:", boss)
    except Exception as e:
        print("Weekly boss error:", e)

    print("\n--- Testing get_tower_floors ---")
    try:
        floors = await get_tower_floors('char-id-123')
        print("Floors count:", len(floors))
    except Exception as e:
        print("Tower floors error:", e)

    print("\n--- Testing get_shop_items ---")
    try:
        items = await get_shop_items('char-id-123')
        print("Shop items count:", len(items))
    except Exception as e:
        print("Shop items error:", e)

    await db.disconnect()

if __name__ == '__main__':
    asyncio.run(test())
