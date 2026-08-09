from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.aira import AIRAChatSchema, AIRACombatAnalysisSchema
from services.aira_service import (
    generate_aira_response,
    analyze_tower_combat,
    generate_daily_report,
    analyze_boss_trajectory,
    analyze_workout_performance,
    analyze_shop_efficiency
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


@router.get("/boss-trajectory/{character_id}/{boss_id}")
async def get_boss_trajectory(character_id: str, boss_id: str):
    """
    GET /api/aira/boss-trajectory/{character_id}/{boss_id}
    Retrieves Boss data, Damage Log history, and generates Ciel's tactical coaching on trajectory.
    """
    context_dict = await get_character_context_dict(character_id)
    
    # Fetch Boss
    boss = await db.boss.find_first(
        where={"id": boss_id, "characterId": character_id},
        include={"damageLogs": {"orderBy": {"createdAt": "desc"}}}
    )
    if not boss:
        raise HTTPException(status_code=404, detail="Boss not found")
        
    boss_dict = boss.model_dump() if hasattr(boss, "model_dump") else dict(boss)
    # Ensure datetime objects are converted to strings if needed for JSON serialization later, but we just need them in memory here
    if "deadline" in boss_dict and boss_dict["deadline"]:
        boss_dict["deadline"] = str(boss_dict["deadline"])
        
    damage_logs = [log.model_dump() if hasattr(log, "model_dump") else dict(log) for log in boss_dict.get("damageLogs", [])]
    
    analysis_text = await analyze_boss_trajectory(
        character_context=context_dict,
        boss_data=boss_dict,
        damage_logs=damage_logs,
    )

    return {"analysis": analysis_text}

@router.post("/analyze-workout")
async def analyze_workout(payload: AIRAChatSchema):
    """
    POST /api/aira/analyze-workout
    Takes standard AIRAChatSchema. Analyzes the character's recent workout ranks 
    and returns a tactical Ciel assessment.
    """
    from routers.workouts import get_workout_ranks
    
    character_id = payload.characterId or "char-id-123"
    context_dict = await get_character_context_dict(character_id)
    
    ranks_res = await get_workout_ranks(character_id)
    workout_ranks = ranks_res.get("ranks", [])
    
    analysis_text = await analyze_workout_performance(
        character_context=context_dict,
        workout_ranks=workout_ranks
    )
    
    return {"analysis": analysis_text}

@router.get("/shop-analysis/{character_id}")
async def get_shop_analysis(character_id: str):
    """
    GET /api/aira/shop-analysis/{character_id}
    Retrieves Shop items, character's equipped inventory, and generates Ciel's tactical coaching on optimal purchases.
    """
    context_dict = await get_character_context_dict(character_id)
    
    # Fetch shop items
    shop_items = await db.shopitem.find_many(include={"item": True})
    shop_items_dict = []
    for si in shop_items:
        s_dict = si.model_dump() if hasattr(si, "model_dump") else dict(si)
        if si.item:
            i_dict = si.item.model_dump() if hasattr(si.item, "model_dump") else dict(si.item)
            s_dict.update(i_dict)
            s_dict['name'] = si.item.name
            s_dict['type'] = si.item.type
            s_dict['rarity'] = si.item.rarity
        shop_items_dict.append(s_dict)
        
    # Fetch equipped inventory
    inventory = await db.playeritem.find_many(
        where={"characterId": character_id, "isEquipped": True},
        include={"itemDefinition": True}
    )
    inv_dict = []
    for inv in inventory:
        i_dict = inv.itemDefinition.model_dump() if hasattr(inv.itemDefinition, "model_dump") else dict(inv.itemDefinition)
        inv_dict.append(i_dict)
        
    analysis_text = await analyze_shop_efficiency(
        character_context=context_dict,
        shop_items=shop_items_dict,
        inventory=inv_dict
    )

    return {"analysis": analysis_text}

