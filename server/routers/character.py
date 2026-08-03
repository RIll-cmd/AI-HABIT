from fastapi import APIRouter, HTTPException, status
from db import db
from schemas.character import CharacterUpdateSchema, ProgressionSyncSchema

router = APIRouter(prefix="/api/character", tags=["character"])


@router.get("/{character_id}")
async def get_character(character_id: str):
    """
    Fetch a character by ID, including relations to CharacterStats and ProgressHistory.
    """
    character = await db.character.find_unique(
        where={"id": character_id},
        include={
            "stats": True,
            "history": True,
        },
    )
    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Character with ID '{character_id}' not found",
        )
    return character


@router.patch("/{character_id}")
async def update_character(character_id: str, payload: CharacterUpdateSchema):
    """
    Accept optional identity fields (name, title, theme, avatar) and update the Character record.
    """
    existing = await db.character.find_unique(where={"id": character_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Character with ID '{character_id}' not found",
        )

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}

    if not update_data:
        return existing

    updated_character = await db.character.update(
        where={"id": character_id},
        data=update_data,
        include={
            "stats": True,
            "history": True,
        },
    )
    return updated_character


@router.post("/{character_id}/sync-progression")
async def sync_progression(character_id: str, payload: ProgressionSyncSchema):
    """
    Accept total_exp, level, power, rank, and history_entry to update progression stats
    and append a new ProgressHistory entry.
    """
    existing = await db.character.find_unique(where={"id": character_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Character with ID '{character_id}' not found",
        )

    # Update character progression attributes
    await db.character.update(
        where={"id": character_id},
        data={
            "exp": payload.total_exp,
            "level": payload.level,
            "power": payload.power,
            "rank": payload.rank,
        },
    )

    # Create new ProgressHistory record if history_entry is provided
    if payload.history_entry:
        await db.progresshistory.create(
            data={
                "characterId": character_id,
                "amount": payload.history_entry.amount,
                "type": payload.history_entry.type,
                "description": payload.history_entry.description,
            }
        )

    # Return updated character with stats and history included
    updated_character = await db.character.find_unique(
        where={"id": character_id},
        include={
            "stats": True,
            "history": True,
        },
    )
    return updated_character
