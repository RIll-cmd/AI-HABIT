import json
from fastapi import APIRouter, HTTPException, status
from db import db
from schemas.skills import SkillUnlockRequestSchema, SkillUnlockResponseSchema
from db_utils import ensure_character_exists

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("/{character_id}")
async def get_skills(character_id: str):
    """
    Fetches all global SkillDefinition records and the specific PlayerSkill records for the character.
    Returns an object with 'definitions' and 'playerSkills'.
    """
    await ensure_character_exists(character_id)
    
    definitions = await db.skilldefinition.find_many()
    player_skills = await db.playerskill.find_many(
        where={"characterId": character_id},
        include={"skillDefinition": True}
    )
    
    return {
        "definitions": definitions,
        "playerSkills": player_skills
    }

@router.post("/{character_id}/unlock", response_model=SkillUnlockResponseSchema)
async def unlock_skill(character_id: str, request: SkillUnlockRequestSchema):
    """
    Validates and unlocks (or levels up) a skill for a character.
    """
    character = await db.character.find_unique(
        where={"id": character_id},
        include={"stats": True, "playerSkills": True}
    )
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    skill_def = await db.skilldefinition.find_unique(
        where={"id": request.skillDefinitionId}
    )
    if not skill_def:
        raise HTTPException(status_code=404, detail="Skill definition not found")

    # 1. Check if the player already has this skill and if it is at max level
    existing_skill = next((ps for ps in character.playerSkills if ps.skillDefinitionId == skill_def.id), None)
    
    if existing_skill and existing_skill.currentLevel >= skill_def.maxLevel:
        raise HTTPException(status_code=400, detail="Skill is already at maximum level")

    # 2. Check Available SP
    cost = skill_def.baseCostSP
    if character.availableSP < cost:
        raise HTTPException(status_code=400, detail="Not enough Skill Points")

    # 3. Check Stat Requirements
    # statRequirements is a JSON string e.g. {"Strength": 55, "Focus": 35, "skills": ["flame_03"]}
    try:
        reqs = json.loads(skill_def.statRequirements)
    except:
        reqs = {}

    stats = character.stats
    if reqs:
        # Check standard attributes
        stat_map = {
            "Strength": stats.strength if stats else 1,
            "Knowledge": stats.knowledge if stats else 1,
            "Endurance": stats.endurance if stats else 1,
            "Recovery": stats.recovery if stats else 1,
            "Focus": stats.focus if stats else 1,
            "Discipline": stats.discipline if stats else 1,
            "Consistency": stats.consistency if stats else 1,
        }
        
        for req_stat, required_val in reqs.items():
            if req_stat == "skills":
                # Check prerequisite skills
                for prereq_skill_id in required_val:
                    has_prereq = any(ps.skillDefinitionId == prereq_skill_id for ps in character.playerSkills)
                    if not has_prereq:
                        raise HTTPException(
                            status_code=400, 
                            detail=f"Missing prerequisite skill: {prereq_skill_id}"
                        )
            else:
                current_val = stat_map.get(req_stat, 0)
                if current_val < required_val:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Insufficient {req_stat}: requires {required_val}, but you have {current_val}"
                    )

    # 4. Perform Unlock / Upgrade
    if existing_skill:
        updated_skill = await db.playerskill.update(
            where={"id": existing_skill.id},
            data={"currentLevel": existing_skill.currentLevel + 1},
            include={"skillDefinition": True}
        )
    else:
        updated_skill = await db.playerskill.create(
            data={
                "characterId": character_id,
                "skillDefinitionId": skill_def.id,
                "currentLevel": 1
            },
            include={"skillDefinition": True}
        )

    # Deduct SP
    updated_character = await db.character.update(
        where={"id": character_id},
        data={"availableSP": character.availableSP - cost}
    )

    return {
        "status": "success",
        "message": f"Successfully unlocked/upgraded {skill_def.name}!",
        "playerSkill": updated_skill,
        "availableSP": updated_character.availableSP
    }
