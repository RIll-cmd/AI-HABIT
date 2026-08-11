import asyncio
from db import db

async def test():
    await db.connect()
    # Print all attribute names on db that are Prisma models
    models = [attr for attr in dir(db) if not attr.startswith("_") and not callable(getattr(db, attr))]
    print("Prisma Models on db:", models)
    await db.disconnect()

if __name__ == '__main__':
    asyncio.run(test())
