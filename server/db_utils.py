from db import db


async def ensure_character_exists(character_id: str, user_id: str = None, username: str = None):
    """
    Ensures that a Character record with the given character_id exists in the database.
    Resolves gracefully whether character_id is a Character.id, User.id, or guest username.
    """
    if not character_id:
        character_id = "char-id-123"

    candidates = [character_id]
    if character_id.startswith("char-"):
        candidates.append(character_id[5:])
    if character_id.startswith("user-"):
        candidates.append(f"char-{character_id}")

    # 1. Direct lookup by character ID candidates
    for cid in candidates:
        try:
            character = await db.character.find_unique(where={"id": cid})
            if character:
                return character
        except Exception:
            pass

    # 2. Lookup by userId on Character table
    for uid in candidates:
        try:
            character_by_user = await db.character.find_unique(where={"userId": uid})
            if character_by_user:
                return character_by_user
        except Exception:
            pass

    # 3. Lookup user by ID, username, or email
    user = None
    for uid in candidates:
        try:
            user = await db.user.find_first(
                where={
                    "OR": [
                        {"id": uid},
                        {"username": uid},
                        {"email": uid}
                    ]
                },
                include={"character": True}
            )
            if user:
                if user.character:
                    return user.character
                break
        except Exception:
            pass

    # 4. User exists but has no character -> Create character for existing user
    if user:
        try:
            target_char_id = f"char-{user.id}"
            character = await db.character.create(
                data={
                    "id": target_char_id,
                    "userId": user.id,
                    "name": user.username or "Shadow Monarch",
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
        except Exception:
            pass

    # 5. Create default User and Character if not found
    actual_user_id = user_id or (candidates[1] if len(candidates) > 1 and candidates[1].startswith("user-") else f"user-{character_id}")
    actual_username = username or (character_id.replace("char-", "").replace("user-", "") if "Guest" in character_id else f"Hunter_{character_id[-4:]}")

    try:
        user = await db.user.find_unique(where={"id": actual_user_id})
        if not user:
            user = await db.user.find_unique(where={"username": actual_username})
            if not user:
                user = await db.user.create(
                    data={
                        "id": actual_user_id,
                        "username": actual_username,
                        "password": "guest_session_placeholder",
                    }
                )

        target_char_id = character_id if character_id.startswith("char-") else f"char-{character_id}"
        character = await db.character.create(
            data={
                "id": target_char_id,
                "userId": user.id,
                "name": actual_username if "Guest" in actual_username else "Shadow Monarch",
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
    except Exception as e:
        print(f"[db_utils Warning] Fallback in-memory character for {character_id}: {e}")
        # Return fallback object
        class FallbackStats:
            strength = 1
            knowledge = 1
            discipline = 1
            focus = 1
            endurance = 1
            recovery = 1
            consistency = 1
            def model_dump(self):
                return {"strength": 1, "knowledge": 1, "discipline": 1, "focus": 1, "endurance": 1, "recovery": 1, "consistency": 1}

        class FallbackChar:
            id = character_id
            userId = actual_user_id
            name = actual_username
            title = "Shadow Seeker"
            level = 1
            exp = 0
            power = 50
            rank = "F"
            gold = 0
            gems = 0
            availableSP = 0
            stats = FallbackStats()
            def model_dump(self):
                return {"id": self.id, "userId": self.userId, "name": self.name, "title": self.title, "level": self.level}
        return FallbackChar()



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
