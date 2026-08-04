from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from prisma.errors import UniqueViolationError

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


@router.get("")
@router.get("/")
async def get_achievements():
    """
    Return all Achievement templates available in the game.
    """
    achievements = await db.achievement.find_many(
        order={"createdAt": "asc"}
    )
    return achievements


@router.post("/{character_id}/{achievement_id}")
async def unlock_achievement(character_id: str, achievement_id: str):
    """
    Create a CharacterAchievement record linking the character to the achievement.
    Handles unique constraint errors gracefully if already unlocked.
    """
    await ensure_character_exists(character_id)

    achievement = await db.achievement.find_unique(where={"id": achievement_id})
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Achievement with ID '{achievement_id}' not found.",
        )

    existing = await db.characterachievement.find_first(
        where={
            "characterId": character_id,
            "achievementId": achievement_id,
        },
        include={"achievement": True},
    )
    if existing:
        return {
            "status": "already_unlocked",
            "message": f"Achievement '{achievement.name}' was already unlocked.",
            "unlocked": existing,
        }

    try:
        unlocked = await db.characterachievement.create(
            data={
                "characterId": character_id,
                "achievementId": achievement_id,
            },
            include={"achievement": True},
        )
        return {
            "status": "success",
            "message": f"Achievement '{achievement.name}' unlocked successfully!",
            "unlocked": unlocked,
        }
    except UniqueViolationError:
        existing = await db.characterachievement.find_first(
            where={
                "characterId": character_id,
                "achievementId": achievement_id,
            },
            include={"achievement": True},
        )
        return {
            "status": "already_unlocked",
            "message": f"Achievement '{achievement.name}' was already unlocked.",
            "unlocked": existing,
        }
