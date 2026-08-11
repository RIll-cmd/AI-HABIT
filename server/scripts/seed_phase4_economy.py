import asyncio
import json
import os
os.environ["PRISMA_PY_DEBUG_GENERATOR"] = "1"
from datetime import datetime, timedelta
from prisma import Prisma
from dotenv import load_dotenv

load_dotenv()

async def main():
    db = Prisma()
    await db.connect()
    print("Connected to database. Seeding Phase 4 Economy, Achievements & Season Pass...")

    # 1. SEED ACHIEVEMENTS
    achievements_data = [
        {"title": "First Step of Greatness", "description": "Complete your first daily habit mission.", "category": "HABITS", "icon": "/icons/Icon10.png", "targetValue": 1, "rewardGold": 100, "rewardGems": 10},
        {"title": "Unbroken Streak", "description": "Maintain a 7-day habit streak.", "category": "HABITS", "icon": "/icons/Icon15.png", "targetValue": 7, "rewardGold": 250, "rewardGems": 25},
        {"title": "Consistency Sovereign", "description": "Complete 50 daily habit missions.", "category": "HABITS", "icon": "/icons/Icon20.png", "targetValue": 50, "rewardGold": 500, "rewardGems": 50},
        {"title": "Iron Will", "description": "Maintain a 30-day habit streak.", "category": "HABITS", "icon": "/icons/Icon25.png", "targetValue": 30, "rewardGold": 1000, "rewardGems": 100},

        {"title": "Novice Lifter", "description": "Complete 1 workout session.", "category": "WORKOUT", "icon": "/icons/Icon30.png", "targetValue": 1, "rewardGold": 100, "rewardGems": 10},
        {"title": "Strength Unleashed", "description": "Log 10 workout sessions.", "category": "WORKOUT", "icon": "/icons/Icon35.png", "targetValue": 10, "rewardGold": 300, "rewardGems": 30},
        {"title": "Barbell Master", "description": "Log 25 workout sessions.", "category": "WORKOUT", "icon": "/icons/Icon40.png", "targetValue": 25, "rewardGold": 750, "rewardGems": 75},
        {"title": "Titan of the Gym", "description": "Achieve an S-Rank on any exercise e1RM.", "category": "WORKOUT", "icon": "/icons/Icon45.png", "targetValue": 1, "rewardGold": 1500, "rewardGems": 150},

        {"title": "Tower Challenger", "description": "Conquer Floor 5 in the Tower.", "category": "TOWER", "icon": "/icons/Icon50.png", "targetValue": 5, "rewardGold": 200, "rewardGems": 20},
        {"title": "Floor Dominator", "description": "Conquer Floor 15 in the Tower.", "category": "TOWER", "icon": "/icons/Icon55.png", "targetValue": 15, "rewardGold": 500, "rewardGems": 50},
        {"title": "Tower Monarch", "description": "Conquer Floor 30 in the Tower.", "category": "TOWER", "icon": "/icons/Icon60.png", "targetValue": 30, "rewardGold": 1200, "rewardGems": 120},
        {"title": "Grandmaster Ascendant", "description": "Reach the 50th Floor of the Tower.", "category": "TOWER", "icon": "/icons/Icon65.png", "targetValue": 50, "rewardGold": 2500, "rewardGems": 250},

        {"title": "AI Assistant Partner", "description": "Send 10 prompts to AIRA.", "category": "SOCIAL", "icon": "/icons/Icon70.png", "targetValue": 10, "rewardGold": 150, "rewardGems": 15},
        {"title": "Guild Contributor", "description": "Earn 1,000 Total Power Score.", "category": "SOCIAL", "icon": "/icons/Icon75.png", "targetValue": 1000, "rewardGold": 400, "rewardGems": 40},
        {"title": "Ascended Being", "description": "Reach Character Level 25.", "category": "SOCIAL", "icon": "/icons/Icon80.png", "targetValue": 25, "rewardGold": 1000, "rewardGems": 100},
        {"title": "Shadow Monarch Ascended", "description": "Reach Character Level 50.", "category": "SOCIAL", "icon": "/icons/Icon85.png", "targetValue": 50, "rewardGold": 3000, "rewardGems": 300},
    ]

    ach_seeded = 0
    for a in achievements_data:
        existing = await db.achievement.find_first(where={"title": a["title"]})
        if not existing:
            await db.achievement.create(data=a)
            ach_seeded += 1

    print(f"Seeded {ach_seeded} new Milestone Achievements.")

    # 2. SEED ACTIVE SEASON PASS
    existing_season = await db.seasonpass.find_first(where={"seasonNumber": 1})
    if not existing_season:
        season = await db.seasonpass.create(
            data={
                "seasonNumber": 1,
                "title": "Season 1: Shadows of Ascension",
                "startDate": datetime.now(),
                "endDate": datetime.now() + timedelta(days=90)
            }
        )
        print("Created Season 1 Pass record.")

        # Seed 50 Tiers
        tier_count = 0
        for t in range(1, 51):
            free_gold = t * 50
            free_icon = f"/icons/Icon{((t * 2) % 300) + 1}.png"
            premium_gems = t * 10
            premium_icon = f"/icons/Icon{((t * 2 + 1) % 300) + 1}.png"

            free_reward = json.dumps({"type": "GOLD", "amount": free_gold, "name": f"{free_gold} Gold"})
            premium_reward = json.dumps({"type": "GEMS", "amount": premium_gems, "name": f"{premium_gems} Gems"})

            await db.seasontier.create(
                data={
                    "seasonId": season.id,
                    "tierNumber": t,
                    "requiredXp": t * 100,
                    "freeReward": free_reward,
                    "premiumReward": premium_reward,
                    "freeIcon": free_icon,
                    "premiumIcon": premium_icon
                }
            )
            tier_count += 1
        print(f"Seeded {tier_count} Season Pass Tiers (Tier 1 - Tier 50).")

    # 2.5 SEED SHOP CONSUMABLES
    consumables = [
        {"name": "Double-EXP Token (1Hr)", "desc": "A synthesized system chip encoded with double experience algorithms. Temporarily doubles all EXP earned from daily disciplines and workouts.", "type": "CONSUMABLE", "rarity": "RARE", "icon": "/icons/Icon88.png", "price": 500, "currency": "GOLD"},
        {"name": "Double-Gold Potion", "desc": "A sparkling golden tonic infused with fortune-channeling mana. Temporarily doubles all Gold currency rewards earned across missions.", "type": "CONSUMABLE", "rarity": "RARE", "icon": "/icons/Icon95.png", "price": 500, "currency": "GOLD"},
        {"name": "Title Scroll: The Awakened", "desc": "An ancient parchment carrying the soul seal of an Awakened Monarch. Grants the prestige title 'The Awakened'.", "type": "COSMETIC", "rarity": "EPIC", "icon": "/icons/Icon102.png", "price": 100, "currency": "GEMS"},
        {"name": "Glowing Profile Border", "desc": "A luminous holographic ring forged from high-frequency energy particles. Displays a radiant border around the Ascendant's avatar.", "type": "COSMETIC", "rarity": "LEGENDARY", "icon": "/icons/Icon155.png", "price": 300, "currency": "GEMS"},
    ]

    for item in consumables:
        item_def = await db.itemdefinition.find_first(where={"name": item["name"]})
        if not item_def:
            item_def = await db.itemdefinition.create(
                data={
                    "name": item["name"],
                    "description": item["desc"],
                    "type": item["type"],
                    "rarity": item["rarity"],
                    "icon": item["icon"],
                    "sellValue": item["price"] // 2
                }
            )
        
        existing_shop = await db.shopitem.find_first(where={"itemId": item_def.id})
        if not existing_shop:
            await db.shopitem.create(
                data={
                    "itemId": item_def.id,
                    "currencyType": item["currency"],
                    "price": item["price"],
                    "stock": -1, # Infinite
                    "requiredLevel": 1
                }
            )
            print(f"Seeded Shop Item: {item['name']}")


    # 3. ENSURE CHARACTER SEASON PROGRESS & ACHIEVEMENTS LINKED
    chars = await db.character.find_many()
    season = await db.seasonpass.find_first(where={"seasonNumber": 1})

    for c in chars:
        if season:
            sp = await db.characterseasonprogress.find_unique(
                where={"characterId_seasonId": {"characterId": c.id, "seasonId": season.id}}
            )
            if not sp:
                await db.characterseasonprogress.create(
                    data={
                        "characterId": c.id,
                        "seasonId": season.id,
                        "passXp": c.level * 100,
                        "isPremium": True
                    }
                )

        # Link character achievements
        all_achs = await db.achievement.find_many()
        for ach in all_achs:
            ca = await db.characterachievement.find_unique(
                where={"characterId_achievementId": {"characterId": c.id, "achievementId": ach.id}}
            )
            if not ca:
                await db.characterachievement.create(
                    data={
                        "characterId": c.id,
                        "achievementId": ach.id,
                        "currentProgress": 1 if ach.targetValue == 1 else 0,
                        "isClaimed": False
                    }
                )

    print("Successfully seeded Phase 4 Economy, Achievements & Season Pass!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
