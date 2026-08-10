import asyncio
import os
from prisma import Prisma

# Featured Bosses every 5 floors with Stat & Elemental Weaknesses
BOSS_DATA = {
    5: {"name": "Golux", "stat": "Discipline", "element": "Ascension"},
    10: {"name": "Arcane Wizard", "stat": "Strength", "element": "Tempest"},
    15: {"name": "Necromancer", "stat": "Recovery", "element": "Flame"},
    20: {"name": "NightBorne", "stat": "Consistency", "element": "Tide"},
    25: {"name": "Bringer of Death", "stat": "Discipline", "element": "Ascension"},
}

# Regular Guardians with thematic Stat & Elemental Weaknesses based on enemy name
REGULAR_DATA = {
    1: {"name": "Spiked Slime", "stat": "Knowledge", "element": "Flame"},
    2: {"name": "Vampire Bat", "stat": "Focus", "element": "Tempest"},
    3: {"name": "Dungeon Rat", "stat": "Strength", "element": "Tide"},
    4: {"name": "Armored Crab", "stat": "Knowledge", "element": "Earth"},
    6: {"name": "Flying Skull", "stat": "Endurance", "element": "Flame"},
    7: {"name": "Pebble Elemental", "stat": "Strength", "element": "Tide"},
    8: {"name": "Forest Mushroom", "stat": "Focus", "element": "Flame"},
    9: {"name": "Stone Golem", "stat": "Knowledge", "element": "Earth"},
    11: {"name": "Toxic Slime", "stat": "Knowledge", "element": "Flame"},
    12: {"name": "Dread Bat", "stat": "Focus", "element": "Tempest"},
    13: {"name": "Plague Rat", "stat": "Strength", "element": "Tide"},
    14: {"name": "Deep Sea Crab", "stat": "Knowledge", "element": "Earth"},
    16: {"name": "Cursed Skull", "stat": "Endurance", "element": "Flame"},
    17: {"name": "Boulder Elemental", "stat": "Strength", "element": "Tide"},
    18: {"name": "Poison Mushroom", "stat": "Focus", "element": "Flame"},
    19: {"name": "Magma Golem", "stat": "Knowledge", "element": "Tide"},
}

async def main():
    db = Prisma()
    await db.connect()
    
    print("Clearing existing Tower data...")
    await db.towerprogress.delete_many()
    await db.towerfloor.delete_many()
    await db.towerenemy.delete_many()
    
    print("Seeding Tower Floors 1-20 (No stat gating, scaled difficulty & thematic weaknesses)...")
    
    boss_cycle = [
        {"name": "Golux", "stat": "Discipline", "element": "Ascension"},
        {"name": "Arcane Wizard", "stat": "Strength", "element": "Tempest"},
        {"name": "Necromancer", "stat": "Recovery", "element": "Flame"},
        {"name": "NightBorne", "stat": "Consistency", "element": "Tide"},
        {"name": "Bringer of Death", "stat": "Discipline", "element": "Ascension"},
    ]
    regular_cycle = [
        {"name": "Spiked Slime", "stat": "Knowledge", "element": "Flame"},
        {"name": "Vampire Bat", "stat": "Focus", "element": "Tempest"},
        {"name": "Dungeon Rat", "stat": "Strength", "element": "Tide"},
        {"name": "Armored Crab", "stat": "Knowledge", "element": "Earth"},
        {"name": "Flying Skull", "stat": "Endurance", "element": "Flame"},
        {"name": "Pebble Elemental", "stat": "Strength", "element": "Tide"},
        {"name": "Forest Mushroom", "stat": "Focus", "element": "Flame"},
        {"name": "Stone Golem", "stat": "Knowledge", "element": "Earth"},
    ]

    for floor_num in range(1, 21):
        is_boss = (floor_num % 5 == 0)
        level = floor_num
        hp_multiplier = 4 if is_boss else 1
        
        if is_boss:
            enemy_info = BOSS_DATA.get(floor_num) or boss_cycle[(floor_num // 5 - 1) % len(boss_cycle)]
        else:
            enemy_info = REGULAR_DATA.get(floor_num) or regular_cycle[(floor_num - 1) % len(regular_cycle)]
        
        enemy_name = enemy_info["name"]
        weakness_stat = enemy_info["stat"]
        weakness_element = enemy_info["element"]

        # Difficulty Scaling Formula (HP, Attack, Defense, Speed scale per floor)
        hp = int(120 * level * hp_multiplier)
        attack = int(12 * level * (1.8 if is_boss else 1))
        defense = int(8 * level * (1.4 if is_boss else 1))
        speed = int(5 * level)
        
        # Create Enemy with Stat & Elemental Weakness
        enemy = await db.towerenemy.create(
            data={
                "name": enemy_name,
                "level": level,
                "hp": hp,
                "attack": attack,
                "defense": defense,
                "speed": speed,
                "weaknessStat": weakness_stat,
                "resistanceStat": weakness_element,
                "icon": "/icons/boss.png" if is_boss else "/icons/enemy.png",
                "isBoss": is_boss
            }
        )
        
        # Create Floor (Stat gating requirements set to 0, keeping difficulty scaling)
        await db.towerfloor.create(
            data={
                "floorNumber": floor_num,
                "requiredPower": 0,
                "requiredStrength": 0,
                "requiredEndurance": 0,
                "requiredKnowledge": 0,
                "requiredRecovery": 0,
                "requiredFocus": 0,
                "requiredDiscipline": 0,
                "enemyId": enemy.id,
                "isBoss": is_boss,
                "goldReward": int(50 * floor_num * (3 if is_boss else 1)),
                "expReward": int(20 * floor_num * (3 if is_boss else 1))
            }
        )
        
    print("Successfully seeded 20 floors with thematic Stat & Elemental weaknesses and 0 stat gating.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
