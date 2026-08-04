from db import db


async def ensure_character_exists(character_id: str):
    """
    Ensures that a Character record with the given character_id exists in SQLite.
    If missing (e.g. dev mock session 'char-id-123'), creates a default User and Character.
    """
    character = await db.character.find_unique(where={"id": character_id})
    if character:
        return character

    user_id = f"user-{character_id}"
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        email = f"mock_{character_id}@ascend.os"
        user = await db.user.find_unique(where={"email": email})
        if not user:
            user = await db.user.create(
                data={
                    "id": user_id,
                    "email": email,
                    "password": "mock_password_hash_dev",
                }
            )

    character = await db.character.create(
        data={
            "id": character_id,
            "userId": user.id,
            "name": "Shadow Monarch",
            "title": "Shadow Seeker",
            "avatar": "/avatars/shadow-monarch.png",
            "theme": "dark-rpg",
            "level": 1,
            "exp": 0,
            "power": 50,
            "rank": "F",
            "gold": 0,
            "stats": {
                "create": {
                    "strength": 1,
                    "knowledge": 1,
                    "discipline": 1,
                    "focus": 1,
                    "endurance": 1,
                    "recovery": 1,
                    "consistency": 1,
                }
            },
        }
    )
    return character


async def ensure_tower_seeded(character_id: str = "char-id-123"):
    """
    Ensures that default Tower, Boss Enemy, 5 Floors, and character FloorProgress exist in SQLite.
    """
    await ensure_character_exists(character_id)

    tower = await db.tower.find_first()
    if not tower:
        tower = await db.tower.create(
            data={
                "id": "tower-ascension-1",
                "name": "Tower of Ascension",
                "description": "The ancient spire of trial where Ascendants test their attributes against dungeon guardians.",
                "theme": "dark-rpg",
                "maxFloor": 100,
            }
        )

    boss = await db.enemy.find_unique(where={"id": "enemy-boss-fl5"})
    if not boss:
        boss = await db.enemy.create(
            data={
                "id": "enemy-boss-fl5",
                "name": "Shadow Overlord",
                "type": "Shadow",
                "rarity": "Boss",
                "baseHp": 500,
                "baseAttack": 35,
                "baseDefense": 15,
                "baseSpeed": 12,
                "image": "/enemies/shadow-overlord.png",
            }
        )

    existing_floors = await db.floor.find_many(where={"towerId": tower.id})
    if len(existing_floors) < 5:
        floor_configs = [
            {"floorNumber": 1, "recommendedPower": 50, "minStrength": 1, "minKnowledge": 1, "minRecovery": 1, "minDiscipline": 1, "minFocus": 1, "minEndurance": 1, "bossId": None},
            {"floorNumber": 2, "recommendedPower": 120, "minStrength": 2, "minKnowledge": 2, "minRecovery": 2, "minDiscipline": 2, "minFocus": 2, "minEndurance": 2, "bossId": None},
            {"floorNumber": 3, "recommendedPower": 200, "minStrength": 3, "minKnowledge": 3, "minRecovery": 3, "minDiscipline": 3, "minFocus": 3, "minEndurance": 3, "bossId": None},
            {"floorNumber": 4, "recommendedPower": 350, "minStrength": 5, "minKnowledge": 5, "minRecovery": 5, "minDiscipline": 5, "minFocus": 5, "minEndurance": 5, "bossId": None},
            {"floorNumber": 5, "recommendedPower": 500, "minStrength": 10, "minKnowledge": 10, "minRecovery": 10, "minDiscipline": 10, "minFocus": 10, "minEndurance": 10, "bossId": boss.id},
        ]
        for config in floor_configs:
            f = await db.floor.find_first(
                where={"towerId": tower.id, "floorNumber": config["floorNumber"]}
            )
            if not f:
                await db.floor.create(
                    data={
                        "id": f"floor-{tower.id}-{config['floorNumber']}",
                        "towerId": tower.id,
                        "floorNumber": config["floorNumber"],
                        "recommendedPower": config["recommendedPower"],
                        "minStrength": config["minStrength"],
                        "minKnowledge": config["minKnowledge"],
                        "minRecovery": config["minRecovery"],
                        "minDiscipline": config["minDiscipline"],
                        "minFocus": config["minFocus"],
                        "minEndurance": config["minEndurance"],
                        "bossId": config["bossId"],
                        "rewardPool": "{}",
                    }
                )

    floor_1 = await db.floor.find_first(where={"towerId": tower.id, "floorNumber": 1})
    if floor_1:
        prog = await db.floorprogress.find_first(
            where={"characterId": character_id, "floorId": floor_1.id}
        )
        if not prog:
            await db.floorprogress.create(
                data={
                    "characterId": character_id,
                    "floorId": floor_1.id,
                    "status": "UNLOCKED",
                    "attempts": 0,
                }
            )

    return tower
