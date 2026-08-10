from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from datetime import datetime

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

@router.get("/{character_id}")
async def get_achievements(character_id: str):
    """
    Returns all milestone achievements along with the specified character's completion progress.
    """
    await ensure_character_exists(character_id)
    await sync_achievements_for_character(character_id)

    achievements = await db.achievement.find_many(
        include={
            "characterAchievements": {
                "where": {"characterId": character_id}
            }
        }
    )

    result = []
    for a in achievements:
        ca = a.characterAchievements[0] if a.characterAchievements else None
        progress = ca.currentProgress if ca else 0
        is_claimed = ca.isClaimed if ca else False
        is_completed = progress >= a.targetValue

        result.append({
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "category": a.category,
            "icon": a.icon or "/icons/Icon10.png",
            "targetValue": a.targetValue,
            "currentProgress": progress,
            "isCompleted": is_completed,
            "isClaimed": is_claimed,
            "rewardGold": a.rewardGold,
            "rewardGems": a.rewardGems,
            "rewardTitleId": a.rewardTitleId
        })

    return {"achievements": result}


@router.post("/claim/{character_id}/{achievement_id}")
async def claim_achievement_reward(character_id: str, achievement_id: str):
    """
    Claims Gold, Gems, and Titles for a completed achievement.
    """
    char = await ensure_character_exists(character_id)
    ach = await db.achievement.find_unique(where={"id": achievement_id})
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")

    ca = await db.characterachievement.find_unique(
        where={"characterId_achievementId": {"characterId": character_id, "achievementId": achievement_id}}
    )

    progress = ca.currentProgress if ca else 0
    if progress < ach.targetValue:
        raise HTTPException(status_code=400, detail="Achievement requirement not yet reached.")

    if ca and ca.isClaimed:
        raise HTTPException(status_code=400, detail="Achievement reward already claimed.")

    # Update Character Gold and Gems
    new_gold = char.gold + ach.rewardGold
    new_gems = char.gems + ach.rewardGems

    await db.character.update(
        where={"id": character_id},
        data={"gold": new_gold, "gems": new_gems}
    )

    # Mark as claimed
    if ca:
        await db.characterachievement.update(
            where={"id": ca.id},
            data={"isClaimed": True, "unlockedAt": datetime.now()}
        )
    else:
        await db.characterachievement.create(
            data={
                "characterId": character_id,
                "achievementId": achievement_id,
                "currentProgress": ach.targetValue,
                "isClaimed": True,
                "unlockedAt": datetime.now()
            }
        )

    # Log History
    await db.progresshistory.create(
        data={
            "characterId": character_id,
            "type": "ACHIEVEMENT_CLAIM",
            "amount": ach.rewardGold,
            "description": f"🏆 Claimed Achievement '{ach.title}': +{ach.rewardGold} Gold, +{ach.rewardGems} Gems!"
        }
    )

    return {
        "message": f"Successfully claimed rewards for {ach.title}!",
        "rewardGold": ach.rewardGold,
        "rewardGems": ach.rewardGems,
        "gold": new_gold,
        "gems": new_gems
    }


async def sync_achievements_for_character(character_id: str):
    """
    Auto-Sync Engine: Recalculates achievement progress based on real database state.
    """
    char = await db.character.find_unique(
        where={"id": character_id},
        include={"habits": True, "workoutSessions": True, "towerProgresses": True}
    )
    if not char:
        return

    all_achs = await db.achievement.find_many()
    
    # Calculate stats
    total_workouts = len(char.workoutSessions) if char.workoutSessions else 0
    max_tower_floor = max([tp.floorNumber for tp in char.towerProgresses if tp.isCleared], default=0) if char.towerProgresses else 0
    max_habit_streak = max([h.streak for h in char.habits], default=0) if char.habits else 0
    total_missions = sum([h.streak for h in char.habits]) if char.habits else 0 # Rough proxy for total missions for now
    
    for ach in all_achs:
        new_progress = 0
        if ach.category == "WORKOUT":
            new_progress = total_workouts
        elif ach.category == "TOWER":
            new_progress = max_tower_floor
        elif ach.category == "HABITS":
            if "streak" in ach.description.lower():
                new_progress = max_habit_streak
            else:
                new_progress = total_missions
        elif ach.category == "SOCIAL":
            if "level" in ach.description.lower():
                new_progress = char.level
        
        if new_progress > 0:
            ca = await db.characterachievement.find_unique(
                where={"characterId_achievementId": {"characterId": character_id, "achievementId": ach.id}}
            )
            
            # Cap progress at targetValue
            capped_progress = min(new_progress, ach.targetValue)
            
            if not ca:
                await db.characterachievement.create(
                    data={
                        "characterId": character_id,
                        "achievementId": ach.id,
                        "currentProgress": capped_progress,
                        "isClaimed": False
                    }
                )
            elif ca.currentProgress < capped_progress:
                await db.characterachievement.update(
                    where={"id": ca.id},
                    data={"currentProgress": capped_progress}
                )
