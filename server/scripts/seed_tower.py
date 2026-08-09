import asyncio
import os
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    
    print("Clearing existing Tower data...")
    await db.towerprogress.delete_many()
    await db.towerfloor.delete_many()
    await db.towerenemy.delete_many()
    
    print("Seeding Tower Floors 1-20...")
    
    for floor_num in range(1, 21):
        is_boss = floor_num % 10 == 0
        
        level = floor_num
        hp_multiplier = 5 if is_boss else 1
        
        enemy_name = f"Floor {floor_num} Guardian" if not is_boss else f"Floor {floor_num} Boss"
        
        # Create Enemy
        enemy = await db.towerenemy.create(
            data={
                "name": enemy_name,
                "level": level,
                "hp": 100 * level * hp_multiplier,
                "attack": 10 * level * (2 if is_boss else 1),
                "defense": 8 * level * (2 if is_boss else 1),
                "speed": 5 * level,
                "weaknessStat": "Knowledge" if level % 2 == 0 else "Strength",
                "resistanceStat": "Strength" if level % 2 == 0 else "Knowledge",
                "icon": "/icons/boss.png" if is_boss else "/icons/enemy.png",
                "isBoss": is_boss
            }
        )
        
        # Create Floor
        required_power = 100 * floor_num * (1.5 if is_boss else 1.0)
        
        await db.towerfloor.create(
            data={
                "floorNumber": floor_num,
                "requiredPower": int(required_power),
                "requiredStrength": int(10 * floor_num),
                "requiredEndurance": int(10 * floor_num),
                "requiredKnowledge": int(10 * floor_num),
                "requiredRecovery": int(10 * floor_num),
                "requiredFocus": int(10 * floor_num),
                "requiredDiscipline": int(10 * floor_num),
                "enemyId": enemy.id,
                "isBoss": is_boss,
                "goldReward": int(50 * floor_num * (3 if is_boss else 1)),
                "expReward": int(20 * floor_num * (3 if is_boss else 1))
            }
        )
        
    print("Successfully seeded 20 floors.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
