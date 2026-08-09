from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.aira import AIRAChatSchema, AIRAChatResponseSchema, AIRAExecuteActionSchema, AIRACombatAnalysisSchema
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


@router.post("/chat", response_model=AIRAChatResponseSchema)
async def chat_with_aira(payload: AIRAChatSchema):
    """
    POST /api/aira/chat
    Accepts user prompt and character ID, injects current character stats as context,
    and returns AIRA's Ciel-style response.
    """
    character_id = payload.characterId or "char-id-123"
    context_dict = await get_character_context_dict(character_id)

    response_data = await generate_aira_response(
        prompt=payload.prompt,
        character_context=context_dict,
        character_id=character_id
    )

    return {
        "response": response_data.get("response", "Analysis complete."),
        "pending_action": response_data.get("pending_action")
    }

@router.post("/execute")
async def execute_aira_action(payload: AIRAExecuteActionSchema):
    """
    POST /api/aira/execute
    Executes a mutative action that was confirmed by the user.
    """
    character_id = payload.characterId or "char-id-123"
    action_type = payload.action_type
    args = payload.action_args
    
    if action_type == "log_completed_workout":
        # Simplified workout logging for AI
        from routers.workouts import WorkoutLogInput, SetInput, log_workout
        
        # We need an exercise ID. In a real app we'd look it up.
        # For now, we will create a dummy or try to find one.
        exercise_name = args.get("exercise_name", "Unknown Exercise")
        exercise = await db.exercise.find_first(where={"name": exercise_name})
        if not exercise:
            exercise = await db.exercise.create(data={
                "name": exercise_name,
                "targetMuscleGroup": "FULL_BODY",
                "mechanic": "COMPOUND"
            })
            
        sets_count = int(args.get("sets", 1))
        reps_count = int(args.get("reps", 1))
        weight = float(args.get("weight", 0.0))
        
        sets = []
        for _ in range(sets_count):
            sets.append(SetInput(exerciseId=exercise.id, weight=weight, reps=reps_count))
            
        workout_data = WorkoutLogInput(
            characterId=character_id,
            durationSeconds=1800, # Assume 30 mins
            sets=sets
        )
        
        result = await log_workout(workout_data)
        return {"success": True, "message": result["message"]}
        
    elif action_type == "complete_daily_mission":
        mission_id = args.get("mission_id")
        if not mission_id:
            raise HTTPException(status_code=400, detail="Missing mission_id")
            
        from routers.missions import complete_mission
        from schemas.habit import MissionCompleteSchema
        
        schema = MissionCompleteSchema(
            completionType="SYSTEM_AUTO",
            expEarned=100,
            statsEarned={}
        )
        await complete_mission(mission_id, schema)
        return {"success": True, "message": f"Mission '{args.get('mission_title', 'Unknown')}' completed successfully."}
        
    elif action_type == "create_new_mission":
        # Create a basic mission directly
        title = args.get("title", "New Mission")
        description = args.get("description", "")
        stat_type = args.get("stat_type", "strength")
        
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        
        await db.mission.create(data={
            "characterId": character_id,
            "title": title,
            "description": description,
            "statType": stat_type,
            "expReward": 50,
            "date": now,
            "status": "PENDING"
        })
        
        return {"success": True, "message": f"Mission '{title}' created successfully."}
        
    elif action_type == "generate_progression_plan":
        # Extract habits from args, or fallback to some default if not parsed well
        # In a real app we'd ask LLM to provide a JSON array, here we might have generic args
        title1 = args.get("habit1_title", "Read for 30m")
        title2 = args.get("habit2_title", "Code for 1h")
        title3 = args.get("habit3_title", "Review notes")
        
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        
        # Batch create habits
        await db.habit.create(data={
            "characterId": character_id,
            "name": title1,
            "category": "Mind",
            "difficulty": "MEDIUM",
            "primaryStat": "knowledge",
            "status": "ACTIVE"
        })
        await db.habit.create(data={
            "characterId": character_id,
            "name": title2,
            "category": "Mind",
            "difficulty": "HARD",
            "primaryStat": "focus",
            "status": "ACTIVE"
        })
        await db.habit.create(data={
            "characterId": character_id,
            "name": title3,
            "category": "Mind",
            "difficulty": "EASY",
            "primaryStat": "discipline",
            "status": "ACTIVE"
        })
        
        return {"success": True, "message": f"Successfully initialized new progression plan."}
        
    else:
        raise HTTPException(status_code=400, detail=f"Unknown action_type: {action_type}")


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


@router.get("/status/{character_id}")
async def get_system_status(character_id: str):
    """
    GET /api/aira/status/{character_id}
    Retrieves proactive insights and warnings for the Attention Panel.
    """
    from services.aira_service import generate_proactive_insight
    
    insight = await generate_proactive_insight(character_id)
    
    if insight:
        return {"status": "warning", "message": insight}
    else:
        return {"status": "optimal", "message": "System optimal. No critical warnings."}


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

