import os
import sys
import asyncio
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from prisma import Prisma

CLASSES_DATA = [
    {
        "name": "Shadow Monarch",
        "baseClass": "SHADOW_MONARCH",
        "tier": 1,
        "requiredLevel": 5,
        "requiredStats": json.dumps({
            "focus": 25,
            "knowledge": 20,
            "discipline": 15
        }),
        "description": "Supreme sovereign of the shadow realm who commands fallen shadows and gravitational void fields with pure mental dominance.",
        "lore": "Long before the System awakened mortal hunters, the Shadow Monarch ruled the boundary between light and eternal abyss. Ascendants who awaken this lineage master telekinesis, dimensional void compression, and the authority to extract spiritual essence into obedient soldiers.",
        "icon": "/class_icons/icHunter.png",
        "statBonus": json.dumps({
            "focus": 35,
            "knowledge": 25,
            "discipline": 20
        }),
        "powerMultiplier": 1.25,
        "passivePerk": "Shadow Extraction",
        "passiveEffect": "+20% EXP boost from all habit & workout missions, plus +15% bonus damage against Tower bosses."
    },
    {
        "name": "Berserker Juggernaut",
        "baseClass": "WARRIOR",
        "tier": 1,
        "requiredLevel": 5,
        "requiredStats": json.dumps({
            "strength": 30,
            "endurance": 20,
            "recovery": 15
        }),
        "description": "An unstoppable frontline vanguard who channels sheer physical fury into devastating crushing strikes that rupture enemy defenses.",
        "lore": "Forged in the bloodied coliseums of ancient S-Rank gates. Berserkers ignore physical pain, converting cardiovascular adrenaline and muscle strain into shockwaves capable of shattering iron ramparts with bare fists.",
        "icon": "/class_icons/icStrenght.png",
        "statBonus": json.dumps({
            "strength": 40,
            "endurance": 25,
            "recovery": 15
        }),
        "powerMultiplier": 1.20,
        "passivePerk": "Blood Fury",
        "passiveEffect": "+25% physical Attack power in Tower battles and +10% Max HP."
    },
    {
        "name": "Arcane Archmage",
        "baseClass": "MAGE",
        "tier": 1,
        "requiredLevel": 5,
        "requiredStats": json.dumps({
            "knowledge": 30,
            "focus": 25,
            "discipline": 15
        }),
        "description": "Supreme master of fundamental cosmic formulas and elemental resonance who weaves destructive spell matrices from ambient mana.",
        "lore": "The High Sages spent centuries mapping the geometric ley lines of dimensional rifts. Archmages do not merely cast magic—they rewrite the physical laws of entropy, accelerating neural cognition and materializing elemental fury at will.",
        "icon": "/class_icons/icKnowledge.png",
        "statBonus": json.dumps({
            "knowledge": 45,
            "focus": 30,
            "discipline": 20
        }),
        "powerMultiplier": 1.25,
        "passivePerk": "Aether Mastery",
        "passiveEffect": "+30% Mana regeneration efficiency and +20% bonus Gold earned from quests and habits."
    },
    {
        "name": "Phantom Assassin",
        "baseClass": "ASSASSIN",
        "tier": 1,
        "requiredLevel": 5,
        "requiredStats": json.dumps({
            "discipline": 25,
            "focus": 25,
            "strength": 20
        }),
        "description": "A lethal shadow of the threshold who strikes unseen, calculating anatomical vulnerabilities before the enemy can react.",
        "lore": "Trained in the silent monastic order of the Obsidian Veil. Phantom Assassins manipulate localized refraction, stepping between milliseconds to land devastating surgical strikes directly into critical vital centers.",
        "icon": "/class_icons/icPrecision.png",
        "statBonus": json.dumps({
            "discipline": 30,
            "focus": 30,
            "strength": 20
        }),
        "powerMultiplier": 1.22,
        "passivePerk": "Lethal Precision",
        "passiveEffect": "+35% Critical Strike Chance and +15% Attack Speed in all combat encounters."
    },
    {
        "name": "Ironclad Aegis Guardian",
        "baseClass": "TANK",
        "tier": 1,
        "requiredLevel": 5,
        "requiredStats": json.dumps({
            "endurance": 35,
            "recovery": 25,
            "consistency": 20
        }),
        "description": "An immovable fortress clad in high-density titan alloys, shielding allies with unyielding kinetic barriers.",
        "lore": "The Stone Wardens of the Iron Gate held the line against apocalyptic monster swarms for four hundred days without retreat. Their defensive techniques absorb colossal impacts and convert shock energy into fortified vitality.",
        "icon": "/class_icons/icTough.png",
        "statBonus": json.dumps({
            "endurance": 50,
            "recovery": 35,
            "consistency": 25
        }),
        "powerMultiplier": 1.20,
        "passivePerk": "Unshakable Fortress",
        "passiveEffect": "30% Flat Damage Reduction in Tower combat and +2 Streak Shield maximum capacity."
    },
    {
        "name": "Grand Chronomancer",
        "baseClass": "CHRONOMANCER",
        "tier": 2,
        "requiredLevel": 10,
        "requiredStats": json.dumps({
            "consistency": 30,
            "discipline": 25,
            "knowledge": 20
        }),
        "description": "Transcendental mystic who manipulates the flow of temporal reality, rewinding physical fatigue and accelerating habit momentum.",
        "lore": "Guardians of the Infinite Timeline. By synchronizing circadian rhythm with the eternal clockwork of the cosmos, Chronomancers can instantly refresh expended stamina and multiply the momentum of daily discipline.",
        "icon": "/class_icons/icContemplative.png",
        "statBonus": json.dumps({
            "consistency": 35,
            "discipline": 35,
            "knowledge": 25
        }),
        "powerMultiplier": 1.25,
        "passivePerk": "Temporal Flow",
        "passiveEffect": "+1.5x Habit Streak multiplier and accelerates daily recovery cooldowns by 50%."
    },
    {
        "name": "Solar Champion",
        "baseClass": "WARRIOR",
        "tier": 2,
        "requiredLevel": 10,
        "requiredStats": json.dumps({
            "strength": 25,
            "endurance": 25,
            "focus": 20
        }),
        "description": "A radiant vanguard bathed in the thermonuclear fires of the sun, projecting blinding incandescent heat that purges corruption.",
        "lore": "Consecrated beneath the zenith of the Golden Rift. Solar Champions ignite their blood with plasma flames, bathing the battlefield in daylight that incinerates shadows and fortifies physical resilience.",
        "icon": "/class_icons/icCourage.png",
        "statBonus": json.dumps({
            "strength": 35,
            "endurance": 30,
            "focus": 20
        }),
        "powerMultiplier": 1.25,
        "passivePerk": "Solar Flare",
        "passiveEffect": "+20% Thermal Fire damage to all skills and boosts total Character Power by +15%."
    },
    {
        "name": "Abyssal Void Stalker",
        "baseClass": "HUNTER",
        "tier": 2,
        "requiredLevel": 10,
        "requiredStats": json.dumps({
            "focus": 30,
            "strength": 25,
            "recovery": 20
        }),
        "description": "A relentless dimensional tracker who traverses extreme abyssal trenches, hunting legendary monarchs across rifts.",
        "lore": "Bred in the dark abyssal canyons beyond the mortal veil. Void Stalkers track the scent of dimensional mana, surviving in zero-gravity environments and dismantling cosmic leviathans with surgical precision.",
        "icon": "/class_icons/icExplore.png",
        "statBonus": json.dumps({
            "focus": 35,
            "strength": 30,
            "recovery": 20
        }),
        "powerMultiplier": 1.25,
        "passivePerk": "Apex Predator",
        "passiveEffect": "+20% Rare Boss item drop rate and +15% Evasion against lethal strikes."
    }
]

async def seed_classes():
    db = Prisma()
    await db.connect()
    print("Connected to database. Seeding Ascendant Classes...")

    for c in CLASSES_DATA:
        existing = await db.classspecialization.find_unique(where={"name": c["name"]})
        if existing:
            await db.classspecialization.update(
                where={"id": existing.id},
                data={
                    "baseClass": c["baseClass"],
                    "tier": c["tier"],
                    "requiredLevel": c["requiredLevel"],
                    "requiredStats": c["requiredStats"],
                    "description": c["description"],
                    "lore": c["lore"],
                    "icon": c["icon"],
                    "statBonus": c["statBonus"],
                    "powerMultiplier": c["powerMultiplier"],
                    "passivePerk": c["passivePerk"],
                    "passiveEffect": c["passiveEffect"]
                }
            )
            print(f"Updated Class: {c['name']} (Req: Lv.{c['requiredLevel']}, Icon: {c['icon']})")
        else:
            await db.classspecialization.create(
                data={
                    "name": c["name"],
                    "baseClass": c["baseClass"],
                    "tier": c["tier"],
                    "requiredLevel": c["requiredLevel"],
                    "requiredStats": c["requiredStats"],
                    "description": c["description"],
                    "lore": c["lore"],
                    "icon": c["icon"],
                    "statBonus": c["statBonus"],
                    "powerMultiplier": c["powerMultiplier"],
                    "passivePerk": c["passivePerk"],
                    "passiveEffect": c["passiveEffect"]
                }
            )
            print(f"Created Class: {c['name']}")

    await db.disconnect()
    print("Class seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_classes())
