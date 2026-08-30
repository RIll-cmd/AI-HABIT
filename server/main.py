from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from prisma.errors import RecordNotFoundError
from db import db
from routers import auth, character, habits, missions, progression, achievements, analytics, tower, inventory, aira, fitness, skills, bosses, workouts, shop, season_pass, crafting, beasts

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

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "https://ai-habit-omega.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|.*\.vercel\.app)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.exception_handler(RecordNotFoundError)
async def prisma_record_not_found_handler(request: Request, exc: RecordNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": "The requested resource was not found in the database."}
    )

# Register Domain Routers
app.include_router(auth.router)
app.include_router(character.router)
app.include_router(habits.router)
app.include_router(missions.router)
app.include_router(progression.router)
app.include_router(achievements.router)
app.include_router(season_pass.router)
app.include_router(analytics.router)
app.include_router(tower.router)
app.include_router(inventory.router)
app.include_router(aira.router)
app.include_router(skills.router)
app.include_router(fitness.router)
app.include_router(bosses.router, prefix="/api/bosses", tags=["bosses"])
app.include_router(workouts.router, prefix="/api/workouts", tags=["workouts"])
app.include_router(shop.router, prefix="/api/shop", tags=["shop"])
app.include_router(crafting.router)
app.include_router(beasts.router)

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
        "database": "postgresql (neon)",
        "services": {
            "api": "operational",
            "orm": "prisma",
            "neon": {
                "projectId": "silent-grass-83641044",
                "orgId": "org-calm-art-43579859"
            }
        }
    }


@app.get("/api/user/{user_id_or_email}")
async def get_user(user_id_or_email: str):
    user = await db.user.find_first(
        where={
            "OR": [
                {"id": user_id_or_email},
                {"email": user_id_or_email},
                {"username": user_id_or_email}
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
