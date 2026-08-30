from typing import Dict, Any, List
import asyncio
import concurrent.futures
from db import db, ensure_db_connected
from db_utils import ensure_character_exists

def _run_sync(coro):
    """Safely runs an async coroutine synchronously inside any event loop context."""
    try:
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                return pool.submit(asyncio.run, coro).result(timeout=10)
        elif loop:
            return loop.run_until_complete(coro)
        else:
            return asyncio.run(coro)
    except Exception as e:
        print(f"[AIRA Tool Sync Runner Warning]: {e}")
        return {}


async def _async_get_character_stats(character_id: str) -> Dict[str, Any]:
    try:
        await ensure_db_connected()
        character = await ensure_character_exists(character_id)
        if not character:
            return {"name": "Master", "level": 1, "power": 50, "stats": {"strength": 1, "knowledge": 1, "recovery": 1, "focus": 1, "discipline": 1, "endurance": 1, "consistency": 1}}
            
        stats_data = character.stats.model_dump() if character.stats and hasattr(character.stats, "model_dump") else (character.stats if character.stats else {})
        return {
            "name": getattr(character, "name", "Master"),
            "level": getattr(character, "level", 1),
            "power": getattr(character, "power", 50),
            "rank": getattr(character, "rank", "F"),
            "gold": getattr(character, "gold", 0),
            "gems": getattr(character, "gems", 0),
            "stats": stats_data
        }
    except Exception as e:
        print(f"[AIRA Tool get_character_stats Warning]: {e}")
        return {"name": "Master", "level": 1, "power": 50, "stats": {"strength": 1, "knowledge": 1, "recovery": 1, "focus": 1, "discipline": 1, "endurance": 1, "consistency": 1}}

def get_character_stats(character_id: str) -> Dict[str, Any]:
    """
    Fetches the core stats, level, and power of the character.
    Use this to answer questions about the user's current attributes or status.
    
    Args:
        character_id: The ID of the character to look up.
    """
    return _run_sync(_async_get_character_stats(character_id))


async def _async_get_today_missions(character_id: str) -> List[Dict[str, Any]]:
    try:
        await ensure_db_connected()
        missions = await db.mission.find_many(
            where={"characterId": character_id}
        )
        result = []
        for m in (missions or []):
            result.append({
                "id": m.id,
                "title": m.title,
                "description": m.description,
                "status": m.status,
                "expReward": m.expReward,
                "statReward": m.statReward,
                "statType": m.statType
            })
        return result
    except Exception as e:
        print(f"[AIRA Tool get_today_missions Warning]: {e}")
        return []

def get_today_missions(character_id: str) -> List[Dict[str, Any]]:
    """
    Fetches the user's missions (habits/tasks) for the current day and their completion status.
    Use this when the user asks what they should do today, or asks about their pending/completed tasks.
    
    Args:
        character_id: The ID of the character to look up.
    """
    return _run_sync(_async_get_today_missions(character_id)) or []


async def _async_get_active_bosses(character_id: str) -> List[Dict[str, Any]]:
    try:
        await ensure_db_connected()
        bosses = await db.boss.find_many(
            where={
                "characterId": character_id,
                "isDefeated": False
            }
        )
        result = []
        for b in (bosses or []):
            result.append({
                "name": b.name,
                "currentHp": b.currentHp,
                "maxHp": b.maxHp,
                "deadline": str(b.deadline) if b.deadline else None
            })
        return result
    except Exception as e:
        print(f"[AIRA Tool get_active_bosses Warning]: {e}")
        return []

def get_active_bosses(character_id: str) -> List[Dict[str, Any]]:
    """
    Fetches the user's active, undefeated bosses.
    Use this when the user asks about their ongoing major goals or bosses.
    
    Args:
        character_id: The ID of the character to look up.
    """
    return _run_sync(_async_get_active_bosses(character_id)) or []


def log_completed_workout(character_id: str, exercise_name: str, sets: int, reps: int, weight: float) -> Dict[str, Any]:
    """
    Logs a completed workout for the user. Call this when the user says they completed an exercise.
    
    Args:
        character_id: The ID of the character.
        exercise_name: The name of the exercise (e.g. 'Bench Press', '5km Run').
        sets: Number of sets completed.
        reps: Number of reps completed per set.
        weight: Weight used in kg (use 0 for bodyweight/cardio).
    """
    return {"status": "pending_confirmation", "message": "Workout log requires user confirmation."}

def complete_daily_mission(character_id: str, mission_id: str, mission_title: str) -> Dict[str, Any]:
    """
    Marks a daily mission or habit as completed. Call this when the user says they finished a specific habit.
    
    Args:
        character_id: The ID of the character.
        mission_id: The unique ID of the mission.
        mission_title: The title of the mission.
    """
    return {"status": "pending_confirmation", "message": "Mission completion requires user confirmation."}

def create_new_mission(character_id: str, title: str, description: str, stat_type: str) -> Dict[str, Any]:
    """
    Creates a new mission based on the user's goals. Call this when proposing a new habit to the user.
    
    Args:
        character_id: The ID of the character.
        title: The title of the new mission.
        description: A short description of the new mission.
        stat_type: The attribute it improves (e.g., 'strength', 'knowledge', 'recovery', 'focus', 'endurance', 'discipline').
    """
    return {"status": "pending_confirmation", "message": "Mission creation requires user confirmation."}

def generate_progression_plan(character_id: str, goal_description: str) -> Dict[str, Any]:
    """
    Formulates a structured JSON payload containing 2-3 recommended Habits based on a high-level goal.
    Call this when the user says they want to get better at something or achieve a long-term goal.
    
    Args:
        character_id: The ID of the character.
        goal_description: The user's high-level goal (e.g., "I want to get better at programming").
    """
    return {"status": "pending_confirmation", "message": "Progression plan requires user confirmation."}


async def _async_analyze_tower_readiness(character_id: str, floor_number: int) -> Dict[str, Any]:
    try:
        await ensure_db_connected()
        character = await ensure_character_exists(character_id)
        
        char_record = await db.character.find_unique(
            where={"id": character.id if character else character_id},
            include={
                "stats": True,
                "playerItems": {
                    "include": {"itemDefinition": True}
                }
            }
        )
        
        if not char_record or not char_record.stats:
            return {"readiness_summary": "Ready for Level 1", "recommendation": "Maintain daily habit completion."}

        floor = await db.towerfloor.find_unique(
            where={"floorNumber": floor_number}
        )
        
        if not floor:
            return {"floor_analyzed": floor_number, "readiness_summary": "Ready", "critical_weaknesses": []}

        # Aggregate stats including equipped items
        total_stats = {
            "power": char_record.power,
            "strength": char_record.stats.strength,
            "endurance": char_record.stats.endurance,
            "knowledge": char_record.stats.knowledge,
            "recovery": char_record.stats.recovery,
            "focus": char_record.stats.focus,
            "discipline": char_record.stats.discipline,
        }

        # Add bonuses from equipped items
        equipped_items = [item for item in (char_record.playerItems or []) if item.isEquipped]
        for p_item in equipped_items:
            defi = p_item.itemDefinition
            if defi:
                total_stats["strength"] += getattr(defi, "strength", 0)
                total_stats["endurance"] += getattr(defi, "endurance", 0)
                total_stats["knowledge"] += getattr(defi, "knowledge", 0)
                total_stats["recovery"] += getattr(defi, "recovery", 0)
                total_stats["focus"] += getattr(defi, "focus", 0)
                total_stats["discipline"] += getattr(defi, "discipline", 0)

        # Compare against floor requirements
        comparison = {
            "power": {"required": floor.requiredPower, "actual": total_stats["power"], "delta": total_stats["power"] - floor.requiredPower},
            "strength": {"required": floor.requiredStrength, "actual": total_stats["strength"], "delta": total_stats["strength"] - floor.requiredStrength},
            "endurance": {"required": floor.requiredEndurance, "actual": total_stats["endurance"], "delta": total_stats["endurance"] - floor.requiredEndurance},
            "knowledge": {"required": floor.requiredKnowledge, "actual": total_stats["knowledge"], "delta": total_stats["knowledge"] - floor.requiredKnowledge},
            "recovery": {"required": floor.requiredRecovery, "actual": total_stats["recovery"], "delta": total_stats["recovery"] - floor.requiredRecovery},
            "focus": {"required": floor.requiredFocus, "actual": total_stats["focus"], "delta": total_stats["focus"] - floor.requiredFocus},
            "discipline": {"required": floor.requiredDiscipline, "actual": total_stats["discipline"], "delta": total_stats["discipline"] - floor.requiredDiscipline},
        }

        critical_weaknesses = []
        for stat, data in comparison.items():
            if data["delta"] < 0:
                critical_weaknesses.append(f"{stat.capitalize()} is {abs(data['delta'])} points below requirement.")

        return {
            "floor_analyzed": floor_number,
            "readiness_summary": "Ready" if not critical_weaknesses else "Not Ready",
            "critical_weaknesses": critical_weaknesses,
            "detailed_comparison": comparison
        }
    except Exception as e:
        print(f"[AIRA Tool analyze_tower_readiness Warning]: {e}")
        return {"floor_analyzed": floor_number, "readiness_summary": "Ready", "critical_weaknesses": []}

def analyze_tower_readiness(character_id: str, floor_number: int) -> Dict[str, Any]:
    """
    Analyzes if a player is ready to beat a specific Tower floor based on their stats and equipment.
    
    Args:
        character_id: The ID of the character.
        floor_number: The tower floor number to analyze.
    """
    return _run_sync(_async_analyze_tower_readiness(character_id, floor_number))


async def _async_compare_equipment(character_id: str) -> Dict[str, Any]:
    try:
        await ensure_db_connected()
        character = await ensure_character_exists(character_id)
        
        char_record = await db.character.find_unique(
            where={"id": character.id if character else character_id},
            include={
                "stats": True,
                "playerItems": {
                    "include": {"itemDefinition": True}
                }
            }
        )
        
        if not char_record or not char_record.stats:
            return {"recommendation": "Complete quests to acquire higher tier gear."}

        stats_dict = {
            "strength": char_record.stats.strength,
            "endurance": char_record.stats.endurance,
            "knowledge": char_record.stats.knowledge,
            "recovery": char_record.stats.recovery,
            "focus": char_record.stats.focus,
            "discipline": char_record.stats.discipline,
        }
        lowest_stat = min(stats_dict, key=stats_dict.get)

        equipped = []
        unequipped = []
        
        for p_item in (char_record.playerItems or []):
            if not p_item.itemDefinition:
                continue
                
            item_data = {
                "id": p_item.id,
                "name": p_item.itemDefinition.name,
                "type": p_item.itemDefinition.type,
                "rarity": p_item.itemDefinition.rarity,
                "bonus_to_lowest_stat": getattr(p_item.itemDefinition, lowest_stat, 0)
            }
            
            if p_item.isEquipped:
                equipped.append(item_data)
            else:
                unequipped.append(item_data)

        unequipped.sort(key=lambda x: x["bonus_to_lowest_stat"], reverse=True)

        recommendations = []
        if unequipped and unequipped[0]["bonus_to_lowest_stat"] > 0:
            recommendations.append(f"Recommend equipping {unequipped[0]['name']} to boost your lowest stat ({lowest_stat.capitalize()}).")
        elif unequipped:
            recommendations.append(f"No unequipped gear provides a direct boost to your lowest stat ({lowest_stat.capitalize()}).")
        else:
            recommendations.append("You have no unequipped gear in your inventory.")

        return {
            "lowest_base_stat": lowest_stat,
            "equipped_items": equipped,
            "top_unequipped_items_for_weakness": unequipped[:3],
            "recommendation": recommendations[0]
        }
    except Exception as e:
        print(f"[AIRA Tool compare_equipment Warning]: {e}")
        return {"recommendation": "Maintain daily habit completion to unlock new gear."}

def compare_equipment(character_id: str) -> Dict[str, Any]:
    """
    Analyzes player's inventory to recommend best gear for their lowest stats.
    
    Args:
        character_id: The ID of the character.
    """
    return _run_sync(_async_compare_equipment(character_id))


AIRA_TOOLS = [
    get_character_stats, 
    get_today_missions, 
    get_active_bosses,
    log_completed_workout,
    complete_daily_mission,
    create_new_mission,
    analyze_tower_readiness,
    compare_equipment,
    generate_progression_plan
]
