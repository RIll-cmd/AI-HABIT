from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.tower import ChallengeRequest, CombatLog
from services.combat_engine import simulate_combat
from routers.inventory import grant_item

router = APIRouter(prefix="/api/tower", tags=["tower"])

@router.get("/{character_id}")
async def get_tower_floors(character_id: str):
    """
    Returns all 20 floors, including character eligibility status (Power/Stat requirement checks) 
    and clear history from TowerProgress.
    """
    await ensure_character_exists(character_id)
    
    character = await db.character.find_unique(
        where={"id": character_id},
        include={"stats": True}
    )
    
    stats = character.stats
    c_strength = stats.strength if stats else 1
    c_endurance = stats.endurance if stats else 1
    c_knowledge = stats.knowledge if stats else 1
    c_recovery = stats.recovery if stats else 1
    c_focus = stats.focus if stats else 1
    c_discipline = stats.discipline if stats else 1
    c_power = character.power

    floors = await db.towerfloor.find_many(
        include={"enemy": True},
        order={"floorNumber": "asc"},
    )

    progress_records = await db.towerprogress.find_many(
        where={"characterId": character_id}
    )

    progress_map = {p.floorNumber: p for p in progress_records}

    merged_floors = []
    highest_cleared = 0
    for p in progress_records:
        if p.isCleared and p.floorNumber > highest_cleared:
            highest_cleared = p.floorNumber

    for floor in floors:
        prog = progress_map.get(floor.floorNumber)
        
        is_eligible = (
            c_power >= floor.requiredPower and
            c_strength >= floor.requiredStrength and
            c_endurance >= floor.requiredEndurance and
            c_knowledge >= floor.requiredKnowledge and
            c_recovery >= floor.requiredRecovery and
            c_focus >= floor.requiredFocus and
            c_discipline >= floor.requiredDiscipline
        )
        
        is_unlocked = floor.floorNumber == 1 or floor.floorNumber <= (highest_cleared + 1)
        
        floor_status = "LOCKED"
        if prog and prog.isCleared:
            floor_status = "CLEARED"
        elif is_unlocked:
            if is_eligible:
                floor_status = "AVAILABLE"
            else:
                floor_status = "LOCKED"
        
        if prog and not prog.isCleared and floor_status == "AVAILABLE":
            floor_status = "ATTEMPTED"

        floor_dict = floor.model_dump() if hasattr(floor, "model_dump") else dict(floor)
        floor_dict["status"] = floor_status
        floor_dict["isEligible"] = is_eligible
        floor_dict["attempts"] = prog.attempts if prog else 0
        floor_dict["bestClearTimeSeconds"] = prog.bestClearTimeSeconds if prog else None
        floor_dict["clearedAt"] = prog.clearedAt if prog else None
        merged_floors.append(floor_dict)

    return merged_floors


@router.post("/{character_id}/challenge", response_model=CombatLog)
async def challenge_floor(character_id: str, request: ChallengeRequest):
    """
    Accepts { floorNumber }.
    Validates requirement eligibility.
    Executes combat_engine.py.
    On Victory: Updates TowerProgress, updates highestTowerFloor, grants Gold/EXP, and grants equipment.
    On Defeat: Increments attempt count in TowerProgress.
    """
    await ensure_character_exists(character_id)
    
    floor_num = request.floorNumber
    
    character = await db.character.find_unique(
        where={"id": character_id},
        include={"stats": True}
    )
    
    floor = await db.towerfloor.find_unique(
        where={"floorNumber": floor_num}
    )
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
        
    stats = character.stats
    if not stats:
        raise HTTPException(status_code=400, detail="Character has no stats")

    if (
        character.power < floor.requiredPower or
        stats.strength < floor.requiredStrength or
        stats.endurance < floor.requiredEndurance or
        stats.knowledge < floor.requiredKnowledge or
        stats.recovery < floor.requiredRecovery or
        stats.focus < floor.requiredFocus or
        stats.discipline < floor.requiredDiscipline
    ):
        raise HTTPException(status_code=400, detail="Character does not meet the requirements for this floor")
        
    progress = await db.towerprogress.find_first(
        where={"characterId": character_id, "floorNumber": floor_num}
    )
    if not progress:
        progress = await db.towerprogress.create(
            data={
                "characterId": character_id,
                "floorNumber": floor_num,
                "attempts": 0,
            }
        )

    combat_log = await simulate_combat(character_id, floor_num)
    
    if combat_log.isVictory:
        new_attempts = progress.attempts + 1
        
        simulated_time_seconds = combat_log.turnsElapsed * 5
        new_best_time = simulated_time_seconds
        
        if progress.bestClearTimeSeconds is not None:
            new_best_time = min(progress.bestClearTimeSeconds, simulated_time_seconds)
            
        await db.towerprogress.update(
            where={"id": progress.id},
            data={
                "isCleared": True,
                "attempts": new_attempts,
                "bestClearTimeSeconds": new_best_time,
                "clearedAt": datetime.now(timezone.utc) if not progress.isCleared else progress.clearedAt
            }
        )
        
        if floor_num > character.highestTowerFloor:
            await db.character.update(
                where={"id": character_id},
                data={
                    "highestTowerFloor": floor_num,
                    "gold": character.gold + floor.goldReward,
                    "exp": character.exp + floor.expReward
                }
            )
            if floor.goldReward > 0:
                await db.economylog.create(data={
                    "characterId": character_id,
                    "currency": "GOLD",
                    "amount": floor.goldReward,
                    "reason": f"Cleared Tower Floor {floor_num}",
                    "source": "TOWER"
                })
            if floor.expReward > 0:
                await db.economylog.create(data={
                    "characterId": character_id,
                    "currency": "EXP",
                    "amount": floor.expReward,
                    "reason": f"Cleared Tower Floor {floor_num}",
                    "source": "TOWER"
                })
                
            rewards_dict = {
                "gold": floor.goldReward,
                "exp": floor.expReward,
                "items": []
            }
            if floor.itemRewardDefinitionId:
                item = await grant_item(character_id, floor.itemRewardDefinitionId, 1, "TOWER_REWARD")
                rewards_dict["items"].append(item.itemDefinition.name if item.itemDefinition else "Item")
                
            combat_log.rewards = rewards_dict
        else:
            combat_log.rewards = {"gold": 0, "exp": 0, "items": []}
            
    else:
        await db.towerprogress.update(
            where={"id": progress.id},
            data={"attempts": progress.attempts + 1}
        )
        
    return combat_log
