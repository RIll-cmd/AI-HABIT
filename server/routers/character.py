from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Optional
import json
from datetime import datetime
from db import db
from db_utils import ensure_character_exists
from schemas.character import CharacterUpdateSchema, ProgressionSyncSchema

router = APIRouter(prefix="/api/character", tags=["character"])


class AllocateStatsInput(BaseModel):
    characterId: str
    allocations: Dict[str, int]  # e.g. {"strength": 2, "discipline": 3}


class EquipTitleInput(BaseModel):
    characterId: str
    titleId: str


class SelectSpecializationInput(BaseModel):
    characterId: str
    specializationId: str


class RespecStatsInput(BaseModel):
    characterId: str


def calculate_power_score(level: int, stats: dict, title_multiplier: float = 1.0) -> int:
    total_stats = sum(stats.values())
    base_power = (level * 50) + (total_stats * 10)
    return int(base_power * title_multiplier)


@router.get("/{character_id}")
async def get_character(character_id: str):
    """
    Fetch a character by ID, including relations to CharacterStats, ProgressHistory, Titles, and Specialization.
    """
    character = await db.character.find_unique(
        where={"id": character_id},
        include={
            "stats": True,
            "history": True,
            "specialization": True,
            "activeBuffs": {"where": {"expiresAt": {"gt": datetime.now()}}},
            "characterTitles": {
                "include": {"title": True}
            }
        },
    )
    if not character:
        await ensure_character_exists(character_id)
        character = await db.character.find_unique(
            where={"id": character_id},
            include={
                "stats": True,
                "history": True,
                "specialization": True,
                "activeBuffs": {"where": {"expiresAt": {"gt": datetime.now()}}},
                "characterTitles": {
                    "include": {"title": True}
                }
            },
        )
    return character


@router.patch("/{character_id}")
async def update_character(character_id: str, payload: CharacterUpdateSchema):
    """
    Accept optional identity fields (name, title, theme, avatar) and update the Character record.
    """
    existing = await ensure_character_exists(character_id)

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}

    if not update_data:
        return existing

    updated_character = await db.character.update(
        where={"id": character_id},
        data=update_data,
        include={
            "stats": True,
            "history": True,
            "specialization": True,
            "characterTitles": {
                "include": {"title": True}
            }
        },
    )
    return updated_character


@router.post("/{character_id}/sync-progression")
async def sync_progression(character_id: str, payload: ProgressionSyncSchema):
    """
    Accept total_exp, level, power, rank, and history_entry to update progression stats
    and append a new ProgressHistory entry.
    """
    await ensure_character_exists(character_id)

    await db.character.update(
        where={"id": character_id},
        data={
            "exp": payload.total_exp,
            "level": payload.level,
            "power": payload.power,
            "rank": payload.rank,
        },
    )

    if payload.history_entry:
        await db.progresshistory.create(
            data={
                "characterId": character_id,
                "amount": payload.history_entry.amount,
                "type": payload.history_entry.type,
                "description": payload.history_entry.description,
            }
        )

    updated_character = await db.character.find_unique(
        where={"id": character_id},
        include={
            "stats": True,
            "history": True,
            "specialization": True,
            "characterTitles": {
                "include": {"title": True}
            }
        },
    )
    return updated_character


@router.post("/stats/allocate")
async def allocate_stat_points(payload: AllocateStatsInput):
    """
    Allocates availableSP to character attributes (strength, knowledge, discipline, focus, endurance, recovery, consistency).
    """
    char = await db.character.find_unique(
        where={"id": payload.characterId},
        include={"stats": True, "characterTitles": True}
    )
    if not char or not char.stats:
        raise HTTPException(status_code=404, detail="Character stats not found.")

    total_requested = sum(max(0, v) for v in payload.allocations.values())
    if total_requested > char.availableSP:
        raise HTTPException(status_code=400, detail=f"Insufficient stat points. Requested {total_requested}, available {char.availableSP}.")

    # Compute new stat values
    current_stats = {
        "strength": char.stats.strength,
        "knowledge": char.stats.knowledge,
        "discipline": char.stats.discipline,
        "focus": char.stats.focus,
        "endurance": char.stats.endurance,
        "recovery": char.stats.recovery,
        "consistency": char.stats.consistency,
    }

    updates = {}
    for stat_name, pts in payload.allocations.items():
        stat_key = stat_name.lower()
        if stat_key in current_stats and pts > 0:
            current_stats[stat_key] += pts
            updates[stat_key] = {"increment": pts}

    # Update CharacterStats
    await db.characterstats.update(
        where={"characterId": payload.characterId},
        data=updates
    )

    # Calculate new Power Score
    title_mult = 1.0
    if char.activeTitleId:
        active_title = await db.title.find_unique(where={"id": char.activeTitleId})
        if active_title:
            title_mult = active_title.powerMultiplier

    new_power = calculate_power_score(char.level, current_stats, title_mult)

    # Update Character availableSP and power score
    updated_char = await db.character.update(
        where={"id": payload.characterId},
        data={
            "availableSP": char.availableSP - total_requested,
            "power": new_power
        },
        include={"stats": True, "specialization": True}
    )

    # Log Progress History
    await db.progresshistory.create(
        data={
            "characterId": payload.characterId,
            "type": "STAT_ALLOCATION",
            "amount": total_requested,
            "description": f"Allocated {total_requested} stat points. Power Score increased to {new_power}."
        }
    )

    # Check for Milestone Title Unlocks
    all_milestones = await db.title.find_many(where={"category": "Milestone"})
    already_unlocked_ids = {ct.titleId for ct in char.characterTitles} if char.characterTitles else set()
    
    newly_unlocked_titles = []
    for m in all_milestones:
        if m.id in already_unlocked_ids:
            continue
            
        req_type = m.requirementType
        req_val = m.requirementValue
        
        if req_type and req_type.startswith("STAT_") and req_val is not None:
            stat_key = req_type.split("_")[1].lower()
            if stat_key in current_stats and current_stats[stat_key] >= req_val:
                # Unlock!
                await db.charactertitle.create(
                    data={
                        "characterId": payload.characterId,
                        "titleId": m.id,
                        "isEquipped": False
                    }
                )
                newly_unlocked_titles.append(m.model_dump())

    return {
        "message": f"Successfully allocated {total_requested} points.",
        "character": updated_char,
        "newlyUnlockedTitles": newly_unlocked_titles
    }


@router.post("/stats/respec")
async def respec_stat_points(payload: RespecStatsInput):
    """
    Resets character attributes back to baseline (1) for a 500 Gold fee, refunding allocated points to availableSP.
    """
    char = await db.character.find_unique(
        where={"id": payload.characterId},
        include={"stats": True}
    )
    if not char or not char.stats:
        raise HTTPException(status_code=404, detail="Character stats not found.")

    if char.gold < 500:
        raise HTTPException(status_code=400, detail="Insufficient Gold for Respec. Requires 500 Gold.")

    current_stats = [
        char.stats.strength,
        char.stats.knowledge,
        char.stats.discipline,
        char.stats.focus,
        char.stats.endurance,
        char.stats.recovery,
        char.stats.consistency,
    ]
    
    # Points to refund = sum(current_stats) - 7 (base stats of 1)
    points_to_refund = max(0, sum(current_stats) - 7)

    # Reset stats to 1
    await db.characterstats.update(
        where={"characterId": payload.characterId},
        data={
            "strength": 1,
            "knowledge": 1,
            "discipline": 1,
            "focus": 1,
            "endurance": 1,
            "recovery": 1,
            "consistency": 1,
        }
    )

    base_stats = {k: 1 for k in ["strength", "knowledge", "discipline", "focus", "endurance", "recovery", "consistency"]}
    new_power = calculate_power_score(char.level, base_stats)

    updated_char = await db.character.update(
        where={"id": payload.characterId},
        data={
            "gold": char.gold - 500,
            "availableSP": char.availableSP + points_to_refund,
            "power": new_power
        },
        include={"stats": True}
    )

    return {
        "message": f"Stats respec'd successfully! Refunded {points_to_refund} stat points for 500 Gold.",
        "character": updated_char
    }


@router.get("/titles/{character_id}")
async def get_titles(character_id: str):
    """
    Returns all cataloged titles with unlock and equipped status for the given character.
    """
    all_titles = await db.title.find_many(order={"createdAt": "asc"})
    char_titles = await db.charactertitle.find_many(
        where={"characterId": character_id}
    )
    
    unlocked_map = {ct.titleId: ct.isEquipped for ct in char_titles}

    results = []
    for t in all_titles:
        results.append({
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "icon": t.icon,
            "category": t.category,
            "statBonus": json.loads(t.statBonus) if t.statBonus else {},
            "powerMultiplier": t.powerMultiplier,
            "requirementType": t.requirementType,
            "requirementValue": t.requirementValue,
            "isUnlocked": t.id in unlocked_map,
            "isEquipped": unlocked_map.get(t.id, False)
        })

    return {"titles": results}


@router.post("/titles/equip")
async def equip_title(payload: EquipTitleInput):
    """
    Equips an unlocked title card, updating character identity and title power score bonus.
    """
    char = await db.character.find_unique(
        where={"id": payload.characterId},
        include={"stats": True}
    )
    if not char:
        raise HTTPException(status_code=404, detail="Character not found.")

    target_title = await db.title.find_unique(where={"id": payload.titleId})
    if not target_title:
        raise HTTPException(status_code=404, detail="Title definition not found.")

    # Unequip previous titles
    await db.charactertitle.update_many(
        where={"characterId": payload.characterId},
        data={"isEquipped": False}
    )

    # Check if character has unlocked this title, if not unlock it now for milestone demo
    char_title = await db.charactertitle.find_unique(
        where={
            "characterId_titleId": {
                "characterId": payload.characterId,
                "titleId": payload.titleId
            }
        }
    )
    if not char_title:
        char_title = await db.charactertitle.create(
            data={
                "characterId": payload.characterId,
                "titleId": payload.titleId,
                "isEquipped": True
            }
        )
    else:
        await db.charactertitle.update(
            where={"id": char_title.id},
            data={"isEquipped": True}
        )

    # Recalculate power score with title multiplier
    current_stats = {
        "strength": char.stats.strength if char.stats else 1,
        "knowledge": char.stats.knowledge if char.stats else 1,
        "discipline": char.stats.discipline if char.stats else 1,
        "focus": char.stats.focus if char.stats else 1,
        "endurance": char.stats.endurance if char.stats else 1,
        "recovery": char.stats.recovery if char.stats else 1,
        "consistency": char.stats.consistency if char.stats else 1,
    }
    new_power = calculate_power_score(char.level, current_stats, target_title.powerMultiplier)

    updated_char = await db.character.update(
        where={"id": payload.characterId},
        data={
            "activeTitleId": target_title.id,
            "title": target_title.name,
            "power": new_power
        },
        include={"stats": True}
    )

    return {
        "message": f"Equipped title '{target_title.name}'. Power multiplier: {target_title.powerMultiplier}x",
        "character": updated_char
    }


@router.get("/specializations/all")
async def get_specializations():
    """
    Returns all Class Specialization trees and skill definitions.
    """
    specs = await db.classspecialization.find_many(
        include={"skills": True}
    )
    return {"specializations": specs}


@router.post("/specializations/select")
async def select_specialization(payload: SelectSpecializationInput):
    """
    Unlocks and selects a Class Specialization for a character.
    """
    char = await db.character.find_unique(where={"id": payload.characterId})
    if not char:
        raise HTTPException(status_code=404, detail="Character not found.")

    spec = await db.classspecialization.find_unique(where={"id": payload.specializationId})
    if not spec:
        raise HTTPException(status_code=404, detail="Specialization not found.")

    if char.level < spec.requiredLevel:
        raise HTTPException(status_code=400, detail=f"Requires Level {spec.requiredLevel} to unlock {spec.name}.")

    updated_char = await db.character.update(
        where={"id": payload.characterId},
        data={"specializationId": spec.id},
        include={"specialization": True, "stats": True}
    )

    return {
        "message": f"Specialization '{spec.name}' selected successfully!",
        "character": updated_char
    }
