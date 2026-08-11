import sys
from pathlib import Path

# Base paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "server"))

import json
import re
import asyncio
from db import db
MARKDOWN_PATH = PROJECT_ROOT / "client" / "public" / "skills_icon" / "skill_name.md"

def extract_json_blocks(markdown_content):
    """
    Extracts all JSON blocks from a markdown string.
    Returns a list of parsed JSON objects (usually lists of dicts).
    """
    # Regex to find ```json ... ``` blocks
    pattern = re.compile(r"```json\s*([\s\S]*?)\s*```", re.IGNORECASE)
    matches = pattern.findall(markdown_content)
    
    parsed_blocks = []
    for match in matches:
        try:
            parsed_blocks.append(json.loads(match))
        except json.JSONDecodeError as e:
            print(f"Failed to parse a JSON block: {e}")
            
    return parsed_blocks

def determine_element_path(skill_id: str) -> str:
    """
    Determine the element path based on the prefix of the skill ID.
    """
    if skill_id.startswith("flame"):
        return "Flame"
    elif skill_id.startswith("tempest"):
        return "Tempest"
    elif skill_id.startswith("earth"):
        return "Earth"
    elif skill_id.startswith("tide"):
        return "Tide"
    elif skill_id.startswith("asc"):
        return "Ascension"
    return "Unknown"

async def seed_skills():
    print("Connecting to database...")
    await db.connect()
    
    if not MARKDOWN_PATH.exists():
        print(f"Error: {MARKDOWN_PATH} does not exist.")
        return

    with open(MARKDOWN_PATH, "r", encoding="utf-8") as f:
        markdown_content = f.read()

    json_blocks = extract_json_blocks(markdown_content)
    
    # Flatten the list of lists into a single list of skill dicts
    all_skills = []
    for block in json_blocks:
        if isinstance(block, list):
            all_skills.extend(block)
        elif isinstance(block, dict):
            all_skills.append(block)

    print(f"Found {len(all_skills)} skills to seed.")

    seeded_count = 0
    
    # We use create or update (upsert is not natively supported directly by Prisma Py for non-unique combinations without a unique constraint,
    # but since `id` is the primary key, we can use upsert).
    for skill in all_skills:
        skill_id = skill.get("id")
        if not skill_id:
            continue
            
        element_path = determine_element_path(skill_id)
        
        stat_requirements = json.dumps(skill.get("requirements", {}))
        
        # Build the data dictionary matching the Prisma schema
        data = {
            "name": skill.get("name", "Unknown Skill"),
            "description": skill.get("description"),
            "elementPath": element_path,
            "tier": skill.get("tier", 1),
            "maxLevel": 5, # Default 5 as per instructions
            "skillType": skill.get("type", "Active").upper(),
            "baseCostSP": 1,
            "statRequirements": stat_requirements,
            "icon": skill.get("icon"),
        }

        try:
            # Check if exists first to decide create vs update
            existing = await db.skilldefinition.find_unique(where={"id": skill_id})
            if existing:
                await db.skilldefinition.update(
                    where={"id": skill_id},
                    data=data
                )
            else:
                data["id"] = skill_id
                await db.skilldefinition.create(data=data)
                
            seeded_count += 1
            print(f"[SUCCESS] Upserted skill: {skill.get('name')} ({skill_id})")
        except Exception as e:
            print(f"[ERROR] Failed to upsert {skill_id}: {e}")

    print(f"Successfully seeded {seeded_count} skills!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_skills())
