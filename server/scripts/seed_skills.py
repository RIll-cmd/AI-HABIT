import os
import sys
import json
import re
import asyncio
from pathlib import Path

# Setup paths
CURRENT_DIR = Path(__file__).resolve().parent
SERVER_DIR = CURRENT_DIR.parent
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

from db import db

SEEDS_JSON_PATH = SERVER_DIR / "db" / "seeds" / "skills_data.json"
MARKDOWN_PATH = SERVER_DIR.parent / "client" / "public" / "skills_icon" / "skill_name.md"

def determine_element_path(skill_id: str) -> str:
    s_id = skill_id.lower()
    if s_id.startswith("flame"):
        return "Flame"
    elif s_id.startswith("tempest"):
        return "Tempest"
    elif s_id.startswith("earth"):
        return "Earth"
    elif s_id.startswith("tide"):
        return "Tide"
    elif s_id.startswith("asc"):
        return "Ascension"
    return "Neutral"

def load_skills_data():
    # 1. Try local JSON seed first (guaranteed in server deployment)
    if SEEDS_JSON_PATH.exists():
        try:
            return json.loads(SEEDS_JSON_PATH.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[Seed Warning] Failed to read {SEEDS_JSON_PATH}: {e}")

    # 2. Try markdown extraction fallback
    if MARKDOWN_PATH.exists():
        try:
            content = MARKDOWN_PATH.read_text(encoding="utf-8")
            pattern = re.compile(r"```json\s*([\s\S]*?)\s*```", re.IGNORECASE)
            matches = pattern.findall(content)
            all_skills = []
            for match in matches:
                parsed = json.loads(match)
                if isinstance(parsed, list):
                    all_skills.extend(parsed)
                elif isinstance(parsed, dict):
                    all_skills.append(parsed)
            return all_skills
        except Exception as e:
            print(f"[Seed Warning] Failed to parse markdown: {e}")

    return []

async def seed_skills(db_instance=None):
    """
    Upserts all baseline skills into the SkillDefinition table.
    """
    database = db_instance or db
    disconnect_after = False
    
    if not database.is_connected():
        await database.connect()
        disconnect_after = True

    skills = load_skills_data()
    if not skills:
        print("[Seed Error] No skill definitions available to seed.")
        return 0

    print(f"[Skill Seeder] Upserting {len(skills)} baseline skill definitions...")
    seeded_count = 0

    for s in skills:
        skill_id = s.get("id")
        if not skill_id:
            continue

        element_path = determine_element_path(skill_id)
        stat_requirements = json.dumps(s.get("requirements", {}))
        
        data = {
            "name": s.get("name", "Unknown Skill"),
            "description": s.get("description"),
            "elementPath": element_path,
            "tier": s.get("tier", 1),
            "maxLevel": 5,
            "skillType": s.get("type", "Active").upper(),
            "baseCostSP": 1,
            "statRequirements": stat_requirements,
            "icon": s.get("icon"),
        }

        try:
            existing = await database.skilldefinition.find_unique(where={"id": skill_id})
            if existing:
                await database.skilldefinition.update(where={"id": skill_id}, data=data)
            else:
                data["id"] = skill_id
                await database.skilldefinition.create(data=data)
            seeded_count += 1
        except Exception as e:
            print(f"[Skill Seeder Error] Failed to upsert skill '{skill_id}': {e}")

    print(f"[Skill Seeder] Successfully seeded {seeded_count} skills into the database.")

    if disconnect_after and database.is_connected():
        await database.disconnect()

    return seeded_count

async def seed_skills_if_empty(db_instance=None):
    """
    Quick check to seed skills if the SkillDefinition table is empty.
    """
    database = db_instance or db
    try:
        count = await database.skilldefinition.count()
        if count == 0:
            print("[Skill Seeder] SkillDefinition table is empty. Running baseline skill seeder...")
            return await seed_skills(database)
    except Exception as e:
        print(f"[Skill Seeder Check Error]: {e}")
    return 0

if __name__ == "__main__":
    asyncio.run(seed_skills())
