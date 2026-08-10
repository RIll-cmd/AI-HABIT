import asyncio
import json
from prisma import Prisma

db = Prisma()

# Define Milestone Titles for stats
# Schema: name, description, category, statBonus, powerMultiplier, requirementType, requirementValue, icon

TITLES = [
    # STRENGTH
    {
        "name": "Brawler",
        "description": "Your physical strikes hit with notable force.",
        "category": "Milestone",
        "statBonus": json.dumps({"strength": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_STRENGTH",
        "requirementValue": 10,
        "icon": "⚔️"
    },
    {
        "name": "Gladiator",
        "description": "A seasoned fighter forged in the arena of discipline.",
        "category": "Milestone",
        "statBonus": json.dumps({"strength": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_STRENGTH",
        "requirementValue": 25,
        "icon": "🛡️"
    },
    {
        "name": "Titan's Grip",
        "description": "You can crush boulders with your bare hands.",
        "category": "Milestone",
        "statBonus": json.dumps({"strength": 10, "endurance": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_STRENGTH",
        "requirementValue": 50,
        "icon": "🔥"
    },
    {
        "name": "God of War",
        "description": "Unrivaled physical supremacy.",
        "category": "Milestone",
        "statBonus": json.dumps({"strength": 25, "endurance": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_STRENGTH",
        "requirementValue": 100,
        "icon": "👑"
    },

    # KNOWLEDGE
    {
        "name": "Student",
        "description": "You have begun the path of learning.",
        "category": "Milestone",
        "statBonus": json.dumps({"knowledge": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_KNOWLEDGE",
        "requirementValue": 10,
        "icon": "📖"
    },
    {
        "name": "Scholar",
        "description": "Your intellect commands respect.",
        "category": "Milestone",
        "statBonus": json.dumps({"knowledge": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_KNOWLEDGE",
        "requirementValue": 25,
        "icon": "📜"
    },
    {
        "name": "Archmage",
        "description": "Master of ancient and modern wisdom.",
        "category": "Milestone",
        "statBonus": json.dumps({"knowledge": 10, "focus": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_KNOWLEDGE",
        "requirementValue": 50,
        "icon": "🔮"
    },
    {
        "name": "Omniscient",
        "description": "To know all is to control all.",
        "category": "Milestone",
        "statBonus": json.dumps({"knowledge": 25, "focus": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_KNOWLEDGE",
        "requirementValue": 100,
        "icon": "👁️"
    },

    # DISCIPLINE
    {
        "name": "Initiate",
        "description": "You have taken the first step toward self-control.",
        "category": "Milestone",
        "statBonus": json.dumps({"discipline": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_DISCIPLINE",
        "requirementValue": 10,
        "icon": "🌱"
    },
    {
        "name": "Monk",
        "description": "Distractions bounce off your iron will.",
        "category": "Milestone",
        "statBonus": json.dumps({"discipline": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_DISCIPLINE",
        "requirementValue": 25,
        "icon": "🧘"
    },
    {
        "name": "Iron Will",
        "description": "Unbreakable and resolute.",
        "category": "Milestone",
        "statBonus": json.dumps({"discipline": 10, "consistency": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_DISCIPLINE",
        "requirementValue": 50,
        "icon": "⛓️"
    },
    {
        "name": "Ascetic Lord",
        "description": "Perfect mastery over mind and body.",
        "category": "Milestone",
        "statBonus": json.dumps({"discipline": 25, "consistency": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_DISCIPLINE",
        "requirementValue": 100,
        "icon": "🏔️"
    },

    # FOCUS
    {
        "name": "Attentive",
        "description": "Able to hold a thought for more than a minute.",
        "category": "Milestone",
        "statBonus": json.dumps({"focus": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_FOCUS",
        "requirementValue": 10,
        "icon": "🔍"
    },
    {
        "name": "Sharpshooter",
        "description": "Your aim is true, your mind is clear.",
        "category": "Milestone",
        "statBonus": json.dumps({"focus": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_FOCUS",
        "requirementValue": 25,
        "icon": "🎯"
    },
    {
        "name": "Laser Mind",
        "description": "Piercing through the noise with ease.",
        "category": "Milestone",
        "statBonus": json.dumps({"focus": 10, "knowledge": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_FOCUS",
        "requirementValue": 50,
        "icon": "⚡"
    },
    {
        "name": "The Observer",
        "description": "Time slows down when you concentrate.",
        "category": "Milestone",
        "statBonus": json.dumps({"focus": 25, "knowledge": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_FOCUS",
        "requirementValue": 100,
        "icon": "🌌"
    },

    # ENDURANCE
    {
        "name": "Runner",
        "description": "You don't get tired easily.",
        "category": "Milestone",
        "statBonus": json.dumps({"endurance": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_ENDURANCE",
        "requirementValue": 10,
        "icon": "🏃"
    },
    {
        "name": "Marathoner",
        "description": "Built for the long haul.",
        "category": "Milestone",
        "statBonus": json.dumps({"endurance": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_ENDURANCE",
        "requirementValue": 25,
        "icon": "🫀"
    },
    {
        "name": "Juggernaut",
        "description": "An unstoppable force with endless stamina.",
        "category": "Milestone",
        "statBonus": json.dumps({"endurance": 10, "strength": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_ENDURANCE",
        "requirementValue": 50,
        "icon": "🗿"
    },
    {
        "name": "Immortal",
        "description": "Your energy pool defies mortality.",
        "category": "Milestone",
        "statBonus": json.dumps({"endurance": 25, "strength": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_ENDURANCE",
        "requirementValue": 100,
        "icon": "♾️"
    },

    # RECOVERY
    {
        "name": "Rested",
        "description": "You know how to take a break.",
        "category": "Milestone",
        "statBonus": json.dumps({"recovery": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_RECOVERY",
        "requirementValue": 10,
        "icon": "💤"
    },
    {
        "name": "Healer",
        "description": "Your body bounces back quickly.",
        "category": "Milestone",
        "statBonus": json.dumps({"recovery": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_RECOVERY",
        "requirementValue": 25,
        "icon": "🩹"
    },
    {
        "name": "Troll Blood",
        "description": "Wounds close before they can even bleed.",
        "category": "Milestone",
        "statBonus": json.dumps({"recovery": 10, "endurance": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_RECOVERY",
        "requirementValue": 50,
        "icon": "🧪"
    },
    {
        "name": "Phoenix",
        "description": "From the ashes, you rise instantly.",
        "category": "Milestone",
        "statBonus": json.dumps({"recovery": 25, "endurance": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_RECOVERY",
        "requirementValue": 100,
        "icon": "🐦‍🔥"
    },

    # CONSISTENCY
    {
        "name": "Habitual",
        "description": "You've shown up more than once.",
        "category": "Milestone",
        "statBonus": json.dumps({"consistency": 2}),
        "powerMultiplier": 1.02,
        "requirementType": "STAT_CONSISTENCY",
        "requirementValue": 10,
        "icon": "📅"
    },
    {
        "name": "Reliable",
        "description": "Like clockwork.",
        "category": "Milestone",
        "statBonus": json.dumps({"consistency": 5}),
        "powerMultiplier": 1.05,
        "requirementType": "STAT_CONSISTENCY",
        "requirementValue": 25,
        "icon": "⚙️"
    },
    {
        "name": "Unwavering",
        "description": "A streak that spans seasons.",
        "category": "Milestone",
        "statBonus": json.dumps({"consistency": 10, "discipline": 5}),
        "powerMultiplier": 1.10,
        "requirementType": "STAT_CONSISTENCY",
        "requirementValue": 50,
        "icon": "📈"
    },
    {
        "name": "Eternal Engine",
        "description": "The universe ends before your streak does.",
        "category": "Milestone",
        "statBonus": json.dumps({"consistency": 25, "discipline": 15}),
        "powerMultiplier": 1.25,
        "requirementType": "STAT_CONSISTENCY",
        "requirementValue": 100,
        "icon": "🌌"
    }
]

async def seed():
    await db.connect()
    print(f"Connected. Seeding {len(TITLES)} Milestone Titles...")

    count = 0
    for title_data in TITLES:
        existing = await db.title.find_unique(where={"name": title_data["name"]})
        if not existing:
            await db.title.create(data=title_data)
            count += 1
            print(f"Created: {title_data['name']}")
        else:
            await db.title.update(
                where={"name": title_data["name"]},
                data=title_data
            )
            print(f"Updated: {title_data['name']}")
            
    print(f"Finished. Seeded {count} new Titles.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(seed())
