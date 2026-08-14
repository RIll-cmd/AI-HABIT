import os
import sys
import asyncio
from dotenv import load_dotenv

# Load env from server/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from prisma import Prisma

MATERIAL_DEFINITIONS = [
    {
        "name": "Large Silver Gem",
        "type": "MATERIAL",
        "rarity": "COMMON",
        "icon": "/icons/Icon341.png",
        "sellValue": 120,
        "description": "A refined gem crystal harvested from Gate rifts. Highly valued for gear enhancement and forge crafting."
    },
    {
        "name": "Shadow Steel Ingot",
        "type": "MATERIAL",
        "rarity": "RARE",
        "icon": "/icons/Icon390.png",
        "sellValue": 150,
        "description": "High-density steel alloy imbued with compressed dark mana. Forms the resilient backbone of shadow armaments."
    },
    {
        "name": "Obsidian Core Crystal",
        "type": "MATERIAL",
        "rarity": "EPIC",
        "icon": "/icons/Icon392.png",
        "sellValue": 280,
        "description": "A volcanic core crystal formed under immense gravitational pressure in S-Rank rift gates."
    },
    {
        "name": "Dragon Drake Scale",
        "type": "MATERIAL",
        "rarity": "EPIC",
        "icon": "/icons/Icon380.png",
        "sellValue": 320,
        "description": "An impenetrable scale shedding from an ancient Drake boss. Possesses supreme kinetic resistance."
    },
    {
        "name": "Ocean Sapphire Shard",
        "type": "MATERIAL",
        "rarity": "RARE",
        "icon": "/icons/Icon338.png",
        "sellValue": 180,
        "description": "A crystalline water gem fragment that cools neural pathways and channels tempest mana."
    },
    {
        "name": "Mana Root Essence",
        "type": "MATERIAL",
        "rarity": "COMMON",
        "icon": "/icons/Icon276.png",
        "sellValue": 80,
        "description": "Distilled herbal sap rich in bio-mana. Used in high-grade EXP elixirs and alchemical potions."
    },
    {
        "name": "Crimson Life Herb",
        "type": "MATERIAL",
        "rarity": "COMMON",
        "icon": "/icons/Icon279.png",
        "sellValue": 75,
        "description": "A rare crimson flora known to accelerate cellular mitosis and heal severe lacerations."
    },
    {
        "name": "Solar Titan Quartz",
        "type": "MATERIAL",
        "rarity": "RARE",
        "icon": "/icons/Icon331.png",
        "sellValue": 220,
        "description": "A glowing radiant quartz that stores solar energy to fortify armor plates against dark magic."
    },
    {
        "name": "Monarch Soul Fragment",
        "type": "MATERIAL",
        "rarity": "LEGENDARY",
        "icon": "/icons/Icon268.png",
        "sellValue": 600,
        "description": "A spectral remnant of an ancient Monarch. Radiates overwhelming sovereign aura and authority."
    },
    {
        "name": "System Processor Chip",
        "type": "MATERIAL",
        "rarity": "EPIC",
        "icon": "/icons/Icon261.png",
        "sellValue": 250,
        "description": "A synthesized holographic core processor capable of calculating experience multipliers."
    }
]

UPDATED_ACHIEVEMENTS = [
    # Habits & Streaks (Using sliced achievement icons 1..4)
    {"title": "First Step of Greatness", "description": "Complete your first daily habit mission.", "category": "HABITS", "icon": "/achievements_icons/sliced/ach_icon_1.png", "targetValue": 1, "rewardGold": 100, "rewardGems": 10},
    {"title": "Unbroken Streak", "description": "Maintain a 7-day habit streak.", "category": "HABITS", "icon": "/achievements_icons/sliced/ach_icon_2.png", "targetValue": 7, "rewardGold": 250, "rewardGems": 25},
    {"title": "Consistency Sovereign", "description": "Complete 50 daily habit missions.", "category": "HABITS", "icon": "/achievements_icons/sliced/ach_icon_3.png", "targetValue": 50, "rewardGold": 500, "rewardGems": 50},
    {"title": "Iron Will", "description": "Maintain a 30-day habit streak.", "category": "HABITS", "icon": "/achievements_icons/sliced/ach_icon_4.png", "targetValue": 30, "rewardGold": 1000, "rewardGems": 100},

    # Workouts & Strength (Using sliced achievement icons 5..8)
    {"title": "Novice Lifter", "description": "Complete 1 workout session.", "category": "WORKOUT", "icon": "/achievements_icons/sliced/ach_icon_5.png", "targetValue": 1, "rewardGold": 100, "rewardGems": 10},
    {"title": "Strength Unleashed", "description": "Log 10 workout sessions.", "category": "WORKOUT", "icon": "/achievements_icons/sliced/ach_icon_6.png", "targetValue": 10, "rewardGold": 300, "rewardGems": 30},
    {"title": "Barbell Master", "description": "Log 25 workout sessions.", "category": "WORKOUT", "icon": "/achievements_icons/sliced/ach_icon_7.png", "targetValue": 25, "rewardGold": 750, "rewardGems": 75},
    {"title": "Titan of the Gym", "description": "Achieve an S-Rank on any exercise e1RM.", "category": "WORKOUT", "icon": "/achievements_icons/sliced/ach_icon_8.png", "targetValue": 1, "rewardGold": 1500, "rewardGems": 150},

    # Tower & Combat (Using sliced achievement icons 9..12)
    {"title": "Tower Challenger", "description": "Conquer Floor 5 in the Tower.", "category": "TOWER", "icon": "/achievements_icons/sliced/ach_icon_9.png", "targetValue": 5, "rewardGold": 200, "rewardGems": 20},
    {"title": "Floor Dominator", "description": "Conquer Floor 15 in the Tower.", "category": "TOWER", "icon": "/achievements_icons/sliced/ach_icon_10.png", "targetValue": 15, "rewardGold": 500, "rewardGems": 50},
    {"title": "Tower Monarch", "description": "Conquer Floor 30 in the Tower.", "category": "TOWER", "icon": "/achievements_icons/sliced/ach_icon_11.png", "targetValue": 30, "rewardGold": 1200, "rewardGems": 120},
    {"title": "Grandmaster Ascendant", "description": "Reach the 50th Floor of the Tower.", "category": "TOWER", "icon": "/achievements_icons/sliced/ach_icon_12.png", "targetValue": 50, "rewardGold": 2500, "rewardGems": 250},

    # Social & Prestige (Using sliced achievement icons 13..15 and ultimate monarch crown)
    {"title": "AI Assistant Partner", "description": "Send 10 prompts to AIRA.", "category": "SOCIAL", "icon": "/achievements_icons/sliced/ach_icon_13.png", "targetValue": 10, "rewardGold": 150, "rewardGems": 15},
    {"title": "Guild Contributor", "description": "Earn 1,000 Total Power Score.", "category": "SOCIAL", "icon": "/achievements_icons/sliced/ach_icon_14.png", "targetValue": 1000, "rewardGold": 400, "rewardGems": 40},
    {"title": "Ascended Being", "description": "Reach Character Level 25.", "category": "SOCIAL", "icon": "/achievements_icons/sliced/ach_icon_15.png", "targetValue": 25, "rewardGold": 1000, "rewardGems": 100},
    {"title": "Shadow Monarch Ascended", "description": "Reach Character Level 50.", "category": "SOCIAL", "icon": "/icons/Icon175.png", "targetValue": 50, "rewardGold": 3000, "rewardGems": 300},
]

async def main():
    db = Prisma()
    await db.connect()

    print("Connected to database...")

    # 1. Seed Material ItemDefinitions
    for mat in MATERIAL_DEFINITIONS:
        existing = await db.itemdefinition.find_first(where={"name": mat["name"]})
        if existing:
            await db.itemdefinition.update(
                where={"id": existing.id},
                data={
                    "type": mat["type"],
                    "rarity": mat["rarity"],
                    "icon": mat["icon"],
                    "sellValue": mat["sellValue"],
                    "description": mat["description"]
                }
            )
            print(f"Updated material: {mat['name']}")
        else:
            await db.itemdefinition.create(data=mat)
            print(f"Created material: {mat['name']}")

    # 2. Grant starter crafting materials to char-id-123 so the player can craft right away
    chars = await db.character.find_many()
    for c in chars:
        # Give 5000 Gold for testing forge
        if c.gold < 2000:
            await db.character.update(where={"id": c.id}, data={"gold": c.gold + 3000})

        for mat in MATERIAL_DEFINITIONS:
            item_def = await db.itemdefinition.find_first(where={"name": mat["name"]})
            if item_def:
                existing_p_item = await db.playeritem.find_first(
                    where={"characterId": c.id, "itemDefinitionId": item_def.id}
                )
                if not existing_p_item:
                    await db.playeritem.create(
                        data={
                            "characterId": c.id,
                            "itemDefinitionId": item_def.id,
                            "quantity": 5,
                            "acquiredFrom": "FORGE_SUPPLIES"
                        }
                    )
                    print(f"Granted 5x {mat['name']} to character {c.name}")
                elif existing_p_item.quantity < 3:
                    await db.playeritem.update(
                        where={"id": existing_p_item.id},
                        data={"quantity": existing_p_item.quantity + 4}
                    )

    # 3. Update Achievements with new Icons
    for ach in UPDATED_ACHIEVEMENTS:
        existing = await db.achievement.find_first(where={"title": ach["title"]})
        if existing:
            await db.achievement.update(
                where={"id": existing.id},
                data={
                    "icon": ach["icon"],
                    "description": ach["description"],
                    "category": ach["category"],
                    "targetValue": ach["targetValue"],
                    "rewardGold": ach["rewardGold"],
                    "rewardGems": ach["rewardGems"]
                }
            )
            print(f"Updated achievement '{ach['title']}' -> icon: {ach['icon']}")
        else:
            await db.achievement.create(data=ach)
            print(f"Created achievement '{ach['title']}'")

    print("\nSuccessfully seeded Crafting Materials and updated Achievement Icons!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
