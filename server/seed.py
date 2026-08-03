import asyncio
from prisma import Prisma

async def main() -> None:
    db = Prisma()
    await db.connect()

    print("Cleaning database...")
    await db.character.delete_many()
    await db.user.delete_many()

    print("Seeding default SaaS User and Character...")
    user = await db.user.create(
        data={
            "email": "shadowmonarch@ascend.os",
            "password": "hashed_password_placeholder",
            "character": {
                "create": {
                    "name": "Shadow Monarch",
                    "avatar": "/avatars/shadow-monarch.png",
                    "theme": "dark-rpg",
                    "title": "Shadow Seeker",
                }
            },
        },
        include={
            "character": True,
        }
    )

    print(f"Successfully seeded user: '{user.email}' (ID: {user.id})")
    if user.character:
        print(f"Character: Name={user.character.name}, Title={user.character.title}")

    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
