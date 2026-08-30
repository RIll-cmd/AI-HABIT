from fastapi import APIRouter, HTTPException
from typing import List
from prisma import Prisma
from db import db
from db_utils import ensure_character_exists
from schemas.bosses import BossCreate, BossSchema
from services.boss_engine import calculate_boss_hp, generate_boss_phases

router = APIRouter()

@router.post("/{character_id}", response_model=BossSchema)
async def create_boss(character_id: str, payload: BossCreate):
    # Verify character exists or auto-create
    character = await db.character.find_unique(where={"id": character_id})
    if not character:
        character = await ensure_character_exists(character_id)
        
    # Calculate HP based on difficulty
    max_hp = calculate_boss_hp(payload.difficulty)
    
    # Create the Boss
    boss = await db.boss.create(
        data={
            "characterId": character.id,
            "name": payload.name,
            "description": payload.description,
            "category": payload.category,
            "difficulty": payload.difficulty,
            "maxHp": max_hp,
            "currentHp": max_hp,
            "deadline": payload.deadline,
            "status": "ACTIVE"
        }
    )
    
    # Create phases
    await generate_boss_phases(db, boss.id, max_hp)
    
    # Create linked activities
    for activity in payload.activities:
        await db.bossactivity.create(
            data={
                "bossId": boss.id,
                "activityType": activity.activityType,
                "referenceId": activity.referenceId,
                "damageValue": activity.damageValue
            }
        )
        
    # Fetch complete boss with relations
    complete_boss = await db.boss.find_unique(
        where={"id": boss.id},
        include={
            "phases": {"order": {"orderIndex": "asc"}},
            "activities": True,
            "damageLogs": True
        }
    )
    
    return complete_boss

@router.get("/{character_id}", response_model=List[BossSchema])
async def get_bosses(character_id: str):
    await ensure_character_exists(character_id)
    bosses = await db.boss.find_many(
        where={"characterId": character_id},
        include={
            "phases": {"order": {"orderIndex": "asc"}},
            "activities": True,
            "damageLogs": {"order": {"createdAt": "desc"}}
        },
        order={"createdAt": "desc"}
    )
    
    return bosses

