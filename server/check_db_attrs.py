import asyncio
from db import db

async def test():
    await db.connect()
    attrs = [a for a in dir(db) if not a.startswith('_')]
    print("Prisma models on db:")
    for a in attrs:
        print(" -", a)
    await db.disconnect()

if __name__ == '__main__':
    asyncio.run(test())
