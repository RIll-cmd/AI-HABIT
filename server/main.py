from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import db
from routers import character, habits, missions, progression, achievements, analytics, tower, inventory, aira, fitness, skills, bosses

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    if db.is_connected():
        await db.disconnect()

app = FastAPI(
    title="Ascend OS Core Server",
    description="Backend API service for Ascend OS SaaS Architecture",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Domain Routers
app.include_router(character.router)
app.include_router(habits.router)
app.include_router(missions.router)
app.include_router(progression.router)
app.include_router(achievements.router)
app.include_router(analytics.router)
app.include_router(tower.router)
app.include_router(inventory.router)
app.include_router(aira.router)
app.include_router(skills.router)
app.include_router(fitness.router)
app.include_router(bosses.router, prefix="/api/bosses", tags=["bosses"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Ascend OS Core Server",
        "version": "2.0.0",
        "architecture": "SaaS Feature Skeleton"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "services": {
            "api": "operational",
            "orm": "prisma"
        }
    }

@app.get("/api/user/{user_id_or_email}")
async def get_user(user_id_or_email: str):
    user = await db.user.find_first(
        where={
            "OR": [
                {"id": user_id_or_email},
                {"email": user_id_or_email}
            ]
        },
        include={
            "character": True,
        }
    )
    if not user:
        # Fallback query by character name if username/name passed
        char = await db.character.find_first(
            where={"name": user_id_or_email},
            include={"user": True}
        )
        if char and char.user:
            user = await db.user.find_unique(
                where={"id": char.userId},
                include={"character": True}
            )

    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id_or_email}' not found")

    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
