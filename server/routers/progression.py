from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.progression import GoldLogSchema

router = APIRouter(prefix="/api/progression", tags=["progression"])


@router.post("/{character_id}/gold")
async def log_gold_transaction(character_id: str, payload: GoldLogSchema):
    """
    Log a gold economy transaction into EconomyLog (currency='GOLD') and update character gold.
    """
    await ensure_character_exists(character_id)

    log_entry = await db.economylog.create(
        data={
            "characterId": character_id,
            "currency": "GOLD",
            "amount": payload.amount,
            "reason": payload.reason,
            "source": payload.source,
        }
    )

    character = await db.character.find_unique(where={"id": character_id})
    if character:
        new_gold = max(0, character.gold + payload.amount)
        await db.character.update(
            where={"id": character_id},
            data={"gold": new_gold},
        )

    return log_entry


@router.get("/{character_id}/history")
async def get_economy_history(character_id: str):
    """
    Return all EconomyLog records for the character, ordered by createdAt descending (limit 50).
    """
    await ensure_character_exists(character_id)

    logs = await db.economylog.find_many(
        where={"characterId": character_id},
        order={"createdAt": "desc"},
        take=50,
    )
    return logs
