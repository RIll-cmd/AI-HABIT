from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.aira import AIRAChatSchema, AIRACombatAnalysisSchema
from services.aira_service import (
    generate_aira_response,
    analyze_tower_combat,
    generate_daily_report,
)

router = APIRouter(prefix="/api/aira", tags=["aira"])


async def get_character_context_dict(character_id: str) -> dict:
    """Helper to fetch full character dictionary including stats for AIRA context."""
    character = await db.character.find_unique(
        where={"id": character_id},
        include={"stats": True},
    )
    if not character:
        character = await ensure_character_exists(character_id)
        character = await db.character.find_unique(
            where={"id": character_id},
            include={"stats": True},
        )

    char_dict = character.model_dump() if hasattr(character, "model_dump") else dict(character)
    return char_dict


@router.post("/chat")
async def chat_with_aira(payload: AIRAChatSchema):
    """
    POST /api/aira/chat
    Accepts user prompt and character ID, injects current character stats as context,
    and returns AIRA's Ciel-style response.
    """
    character_id = payload.characterId or "char-id-123"
    context_dict = await get_character_context_dict(character_id)

    response_text = await generate_aira_response(
        prompt=payload.prompt,
        character_context=context_dict,
    )

    return {"response": response_text}


@router.post("/analyze-combat")
async def analyze_combat(payload: AIRACombatAnalysisSchema):
    """
    POST /api/aira/analyze-combat
    Accepts combat logs and character data, processes tactical combat analysis through AIRA,
    and returns her analytical recommendation.
    """
    character_id = payload.characterId or "char-id-123"
    context_dict = await get_character_context_dict(character_id)

    analysis_text = await analyze_tower_combat(
        character_data=context_dict,
        battle_logs=payload.battleLogs,
        floor_number=payload.floorNumber or 1,
        is_victory=payload.isVictory,
        turns_elapsed=payload.turnsElapsed,
        player_hp=payload.playerHpRemaining,
    )

    return {"analysis": analysis_text}


@router.get("/daily-report/{character_id}")
async def get_daily_report(character_id: str):
    """
    GET /api/aira/daily-report/{character_id}
    Aggregates character consistency, pending habits, and power score to generate AIRA's
    signature morning briefing (<< Report. >>).
    """
    context_dict = await get_character_context_dict(character_id)

    # Count pending habits for today
    pending_count = await db.mission.count(
        where={"characterId": character_id, "status": "PENDING"}
    )

    report_text = await generate_daily_report(
        character_context=context_dict,
        pending_habits_count=pending_count,
    )

    return {"report": report_text}
