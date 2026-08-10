import json
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from db import db
from db_utils import ensure_character_exists

router = APIRouter(prefix="/api/season-pass", tags=["season_pass"])

class ClaimTierSchema(BaseModel):
    characterId: str
    tierNumber: Optional[int] = None # None means Claim All
    claimType: str = "ALL" # 'FREE', 'PREMIUM', 'ALL'

class UnlockPremiumSchema(BaseModel):
    characterId: str
    currency: str = "GEMS" # 'GEMS' or 'GOLD'

@router.get("/{character_id}")
async def get_season_pass(character_id: str):
    """
    Returns active season details, 50 tiers with reward info/icons, and character pass progress.
    """
    char = await ensure_character_exists(character_id)

    season = await db.seasonpass.find_first(
        where={"seasonNumber": 1},
        include={"tiers": {"order": {"tierNumber": "asc"}}}
    )

    if not season:
        raise HTTPException(status_code=404, detail="Active Season Pass not found.")

    progress = await db.characterseasonprogress.find_unique(
        where={"characterId_seasonId": {"characterId": character_id, "seasonId": season.id}}
    )

    if not progress:
        progress = await db.characterseasonprogress.create(
            data={
                "characterId": character_id,
                "seasonId": season.id,
                "passXp": char.level * 100,
                "isPremium": True,
                "claimedFreeTiers": "[]",
                "claimedPremiumTiers": "[]"
            }
        )

    claimed_free = json.loads(progress.claimedFreeTiers or "[]")
    claimed_premium = json.loads(progress.claimedPremiumTiers or "[]")

    tiers_list = []
    for t in season.tiers:
        is_unlocked = progress.passXp >= t.requiredXp
        tiers_list.append({
            "id": t.id,
            "tierNumber": t.tierNumber,
            "requiredXp": t.requiredXp,
            "freeReward": json.loads(t.freeReward),
            "premiumReward": json.loads(t.premiumReward),
            "freeIcon": t.freeIcon,
            "premiumIcon": t.premiumIcon,
            "isUnlocked": is_unlocked,
            "isFreeClaimed": t.tierNumber in claimed_free,
            "isPremiumClaimed": t.tierNumber in claimed_premium,
        })

    return {
        "seasonId": season.id,
        "seasonNumber": season.seasonNumber,
        "title": season.title,
        "endDate": season.endDate,
        "passXp": progress.passXp,
        "isPremium": progress.isPremium,
        "claimedFreeTiers": claimed_free,
        "claimedPremiumTiers": claimed_premium,
        "tiers": tiers_list
    }


@router.post("/claim")
async def claim_season_pass_rewards(payload: ClaimTierSchema):
    """
    Claims rewards for unlocked Season Pass tiers. Supports single-tier or batch Claim All.
    """
    char = await ensure_character_exists(payload.characterId)
    season = await db.seasonpass.find_first(
        where={"seasonNumber": 1},
        include={"tiers": True}
    )
    if not season:
        raise HTTPException(status_code=404, detail="Season Pass not found")

    progress = await db.characterseasonprogress.find_unique(
        where={"characterId_seasonId": {"characterId": payload.characterId, "seasonId": season.id}}
    )
    if not progress:
        raise HTTPException(status_code=404, detail="Character Season Progress not found")

    claimed_free = set(json.loads(progress.claimedFreeTiers or "[]"))
    claimed_premium = set(json.loads(progress.claimedPremiumTiers or "[]"))

    gold_rewarded = 0
    gems_rewarded = 0

    tiers_to_process = season.tiers
    if payload.tierNumber is not None:
        tiers_to_process = [t for t in season.tiers if t.tierNumber == payload.tierNumber]

    for t in tiers_to_process:
        if progress.passXp >= t.requiredXp:
            # Free Track
            if payload.claimType in ["FREE", "ALL"] and t.tierNumber not in claimed_free:
                claimed_free.add(t.tierNumber)
                free_rew = json.loads(t.freeReward)
                if free_rew.get("type") == "GOLD":
                    gold_rewarded += free_rew.get("amount", 0)
                elif free_rew.get("type") == "GEMS":
                    gems_rewarded += free_rew.get("amount", 0)

            # Premium Track
            if progress.isPremium and payload.claimType in ["PREMIUM", "ALL"] and t.tierNumber not in claimed_premium:
                claimed_premium.add(t.tierNumber)
                prem_rew = json.loads(t.premiumReward)
                if prem_rew.get("type") == "GOLD":
                    gold_rewarded += prem_rew.get("amount", 0)
                elif prem_rew.get("type") == "GEMS":
                    gems_rewarded += prem_rew.get("amount", 0)

    # Update Database
    new_gold = char.gold + gold_rewarded
    new_gems = char.gems + gems_rewarded

    await db.character.update(
        where={"id": payload.characterId},
        data={"gold": new_gold, "gems": new_gems}
    )

    await db.characterseasonprogress.update(
        where={"id": progress.id},
        data={
            "claimedFreeTiers": json.dumps(list(claimed_free)),
            "claimedPremiumTiers": json.dumps(list(claimed_premium))
        }
    )

    if gold_rewarded > 0 or gems_rewarded > 0:
        await db.progresshistory.create(
            data={
                "characterId": payload.characterId,
                "type": "SEASON_PASS_CLAIM",
                "amount": gold_rewarded,
                "description": f"🎁 Season Pass Claim: +{gold_rewarded} Gold, +{gems_rewarded} Gems!"
            }
        )

    return {
        "message": f"Successfully claimed rewards: +{gold_rewarded} Gold, +{gems_rewarded} Gems!",
        "goldRewarded": gold_rewarded,
        "gemsRewarded": gems_rewarded,
        "gold": new_gold,
        "gems": new_gems
    }


@router.post("/unlock-premium")
async def unlock_premium_pass(payload: UnlockPremiumSchema):
    """
    Unlocks Premium Season Pass track for 500 Gems or 1,500 Gold.
    """
    char = await ensure_character_exists(payload.characterId)
    season = await db.seasonpass.find_first(where={"seasonNumber": 1})
    if not season:
        raise HTTPException(status_code=404, detail="Season Pass not found")

    progress = await db.characterseasonprogress.find_unique(
        where={"characterId_seasonId": {"characterId": payload.characterId, "seasonId": season.id}}
    )

    if progress and progress.isPremium:
        raise HTTPException(status_code=400, detail="Premium Pass already unlocked.")

    if payload.currency == "GEMS":
        if char.gems < 500:
            raise HTTPException(status_code=400, detail="Insufficient Gems. Premium Pass costs 500 Gems.")
        await db.character.update(
            where={"id": payload.characterId},
            data={"gems": char.gems - 500}
        )
    else:
        if char.gold < 1500:
            raise HTTPException(status_code=400, detail="Insufficient Gold. Premium Pass costs 1,500 Gold.")
        await db.character.update(
            where={"id": payload.characterId},
            data={"gold": char.gold - 1500}
        )

    if progress:
        await db.characterseasonprogress.update(
            where={"id": progress.id},
            data={"isPremium": True}
        )

    return {"message": "Successfully unlocked Season 1 Premium Ascension Pass! 🌟", "isPremium": True}
