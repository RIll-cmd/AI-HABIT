import math
from datetime import datetime
from prisma import Prisma
from typing import Dict, Any, List

DIFFICULTY_HP = {
    "EASY": 5000,
    "NORMAL": 10000,
    "HARD": 25000,
    "ELITE": 50000,
    "LEGENDARY": 100000
}

def calculate_boss_hp(difficulty: str) -> int:
    return DIFFICULTY_HP.get(difficulty.upper(), 10000)

async def generate_boss_phases(db: Prisma, boss_id: str, max_hp: int) -> None:
    """Generate 4 default phases for a newly created boss."""
    phase_hp = max_hp // 4
    remainder = max_hp % 4
    
    phases_data = [
        {"bossId": boss_id, "name": "Phase 1 - Initiation", "maxHp": phase_hp, "orderIndex": 1},
        {"bossId": boss_id, "name": "Phase 2 - Development", "maxHp": phase_hp, "orderIndex": 2},
        {"bossId": boss_id, "name": "Phase 3 - Execution", "maxHp": phase_hp, "orderIndex": 3},
        {"bossId": boss_id, "name": "Phase 4 - Finalization", "maxHp": phase_hp + remainder, "orderIndex": 4},
    ]
    
    for phase in phases_data:
        await db.bossphase.create(data=phase)

async def deal_boss_damage(db: Prisma, character_id: str, activity_type: str, reference_id: str) -> List[Dict[str, Any]]:
    """
    Check if the activity is linked to an Active Boss.
    If so, deduct HP, log damage, and check for defeat.
    Returns a list of result summaries for each affected boss.
    """
    
    # 1. Find all active bosses for this character
    active_bosses = await db.boss.find_many(
        where={
            "characterId": character_id,
            "status": "ACTIVE"
        },
        include={
            "activities": True
        }
    )
    
    results = []
    
    for boss in active_bosses:
        # Check if the activity is linked to this boss
        # Match by activityType and referenceId (if provided)
        # referenceId can be a habitId or exerciseId
        linked_activity = next(
            (act for act in boss.activities if act.activityType == activity_type and (act.referenceId == reference_id or not act.referenceId)), 
            None
        )
        
        if linked_activity:
            damage = linked_activity.damageValue
            
            # Apply damage
            new_hp = max(0, boss.currentHp - damage)
            actual_damage_dealt = boss.currentHp - new_hp
            
            is_defeated = new_hp == 0
            
            # Update boss
            updated_boss = await db.boss.update(
                where={"id": boss.id},
                data={
                    "currentHp": new_hp,
                    "status": "DEFEATED" if is_defeated else "ACTIVE"
                }
            )
            
            # Create damage log
            await db.bossdamagelog.create(
                data={
                    "bossId": boss.id,
                    "activityId": linked_activity.id,
                    "damage": actual_damage_dealt
                }
            )
            
            result_summary = {
                "bossId": boss.id,
                "bossName": boss.name,
                "damageDealt": actual_damage_dealt,
                "newHp": new_hp,
                "isDefeated": is_defeated,
                "rewards": None
            }
            
            # If defeated, grant rewards
            if is_defeated:
                rewards = grant_boss_rewards(difficulty=boss.difficulty)
                
                # Apply rewards to character
                await db.character.update(
                    where={"id": character_id},
                    data={
                        "exp": {"increment": rewards["exp"]},
                        "gold": {"increment": rewards["gold"]}
                    }
                )
                
                # Log economy
                await db.economylog.create(
                    data={
                        "characterId": character_id,
                        "currency": "GOLD",
                        "amount": rewards["gold"],
                        "reason": f"Defeated Boss: {boss.name}",
                        "source": "BOSS"
                    }
                )
                await db.economylog.create(
                    data={
                        "characterId": character_id,
                        "currency": "EXP",
                        "amount": rewards["exp"],
                        "reason": f"Defeated Boss: {boss.name}",
                        "source": "BOSS"
                    }
                )
                
                result_summary["rewards"] = rewards
                
            results.append(result_summary)
            
    return results

def grant_boss_rewards(difficulty: str) -> Dict[str, int]:
    diff = difficulty.upper()
    rewards = {
        "EASY": {"exp": 1000, "gold": 500},
        "NORMAL": {"exp": 2500, "gold": 1200},
        "HARD": {"exp": 7500, "gold": 3000},
        "ELITE": {"exp": 15000, "gold": 7500},
        "LEGENDARY": {"exp": 35000, "gold": 20000}
    }
    return rewards.get(diff, rewards["NORMAL"])
