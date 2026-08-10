import os
os.environ["PRISMA_PY_DEBUG_GENERATOR"] = "1"

import asyncio
import json
from prisma import Prisma

TITLES = [
    {
        "name": "Hydration Monarch",
        "description": "Master of physical purity and daily hydration consistency.",
        "icon": "💧",
        "category": "Habits",
        "statBonus": json.dumps({"consistency": 2, "recovery": 1}),
        "powerMultiplier": 1.02,
        "requirementType": "HABIT_STREAK",
        "requirementValue": 7
    },
    {
        "name": "Tower Conqueror",
        "description": "Fierce climber who conquered the upper spires of the Tower.",
        "icon": "⚔️",
        "category": "Tower",
        "statBonus": json.dumps({"strength": 3, "knowledge": 2}),
        "powerMultiplier": 1.05,
        "requirementType": "TOWER_FLOOR",
        "requirementValue": 5
    },
    {
        "name": "Consistency Sovereign",
        "description": "Unwavering ruler of daily routine discipline and unbroken focus.",
        "icon": "👑",
        "category": "Milestone",
        "statBonus": json.dumps({"discipline": 3, "consistency": 3}),
        "powerMultiplier": 1.05,
        "requirementType": "COMPLETED_MISSIONS",
        "requirementValue": 25
    },
    {
        "name": "Shadow Monarch",
        "description": "Sovereign of shadows who transcends mortal stat limits.",
        "icon": "🌌",
        "category": "Special",
        "statBonus": json.dumps({"strength": 5, "focus": 5, "discipline": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "LEVEL_REACHED",
        "requirementValue": 10
    },
    {
        "name": "Early Riser",
        "description": "Disciplined morning warrior who conquers the day before dawn.",
        "icon": "🌅",
        "category": "Habits",
        "statBonus": json.dumps({"focus": 2, "discipline": 1}),
        "powerMultiplier": 1.02,
        "requirementType": "EARLY_MISSION",
        "requirementValue": 5
    },
    {
        "name": "Grandmaster Ascendant",
        "description": "Legendary entity of supreme physical and mental strength.",
        "icon": "✨",
        "category": "Milestone",
        "statBonus": json.dumps({"strength": 4, "knowledge": 4, "discipline": 4}),
        "powerMultiplier": 1.08,
        "requirementType": "LEVEL_REACHED",
        "requirementValue": 20
    }
]

SPECIALIZATIONS = [
    {
        "id": "spec-paladin",
        "name": "Paladin",
        "baseClass": "Warrior",
        "tier": 2,
        "requiredLevel": 10,
        "description": "Holy defender maximizing Recovery, Endurance, and Boss Damage Reduction.",
        "icon": "🛡️"
    },
    {
        "id": "spec-berserker",
        "name": "Berserker",
        "baseClass": "Warrior",
        "tier": 2,
        "requiredLevel": 10,
        "description": "Fierce combatant maximizing Strength, Focus, and raw physical damage.",
        "icon": "🪓"
    },
    {
        "id": "spec-stormweaver",
        "name": "Stormweaver",
        "baseClass": "Mage",
        "tier": 2,
        "requiredLevel": 10,
        "description": "Elemental caster wielding Tempest speed and Knowledge multipliers.",
        "icon": "⚡"
    },
    {
        "id": "spec-arcanist",
        "name": "Arcanist",
        "baseClass": "Mage",
        "tier": 2,
        "requiredLevel": 10,
        "description": "Master of pure mana boosting EXP gains and Focus precision.",
        "icon": "🔮"
    },
    {
        "id": "spec-shadow-monarch",
        "name": "Shadow Monarch",
        "baseClass": "Rogue",
        "tier": 2,
        "requiredLevel": 10,
        "description": "Sovereign of shadows granting massive stat scaling and stealth crits.",
        "icon": "👑"
    },
    {
        "id": "spec-assassin",
        "name": "Assassin",
        "baseClass": "Rogue",
        "tier": 2,
        "requiredLevel": 10,
        "description": "Deadly striker boosting Gold rewards and execution speed.",
        "icon": "🗡️"
    }
]

async def main():
    db = Prisma()
    await db.connect()
    print("Connected to database. Seeding Phase 2 RPG content...")

    # 1. Seed Titles
    seeded_titles = 0
    for t in TITLES:
        existing = await db.title.find_unique(where={"name": t["name"]})
        if not existing:
            await db.title.create(data=t)
            seeded_titles += 1
    print(f"Seeded {seeded_titles} new Titles.")

    # 2. Seed Class Specializations
    seeded_specs = 0
    for s in SPECIALIZATIONS:
        existing = await db.classspecialization.find_unique(where={"name": s["name"]})
        if not existing:
            await db.classspecialization.create(data=s)
            seeded_specs += 1
    print(f"Seeded {seeded_specs} Class Specializations.")

    # 3. Grant Retroactive Unallocated Points & Initial Title to Characters
    characters = await db.character.find_many()
    hydration_title = await db.title.find_unique(where={"name": "Hydration Monarch"})

    for char in characters:
        expected_sp = max(5, char.level * 5)
        new_sp = max(char.availableSP, expected_sp)
        
        await db.character.update(
            where={"id": char.id},
            data={"availableSP": new_sp}
        )

        if hydration_title:
            char_title = await db.charactertitle.find_unique(
                where={
                    "characterId_titleId": {
                        "characterId": char.id,
                        "titleId": hydration_title.id
                    }
                }
            )
            if not char_title:
                await db.charactertitle.create(
                    data={
                        "characterId": char.id,
                        "titleId": hydration_title.id,
                        "isEquipped": True
                    }
                )
                await db.character.update(
                    where={"id": char.id},
                    data={"activeTitleId": hydration_title.id, "title": hydration_title.name}
                )

    print(f"Updated {len(characters)} characters with retroactive SP and default title.")

    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
