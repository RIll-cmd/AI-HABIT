from db import db


async def ensure_character_exists(character_id: str):
    """
    Ensures that a Character record with the given character_id exists in SQLite.
    If missing (e.g. dev mock session 'char-id-123'), creates a default User and Character.
    """
    character = await db.character.find_unique(where={"id": character_id})
    if character:
        return character

    # Check if fallback User exists
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
