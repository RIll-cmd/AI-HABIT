import json
import os
import random
import asyncio
from prisma import Prisma

# Item Types
WEAPON = "WEAPON"
HELMET = "HELMET"
ARMOR = "ARMOR"
GLOVES = "GLOVES"
BOOTS = "BOOTS"
RING = "RING"
NECKLACE = "NECKLACE"
ARTIFACT = "ARTIFACT"
RELIC = "RELIC"
CONSUMABLE = "CONSUMABLE"
MATERIAL = "MATERIAL"

# Rarities
RARITIES = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"]

def guess_type(name):
    name_lower = name.lower()
    
    if any(k in name_lower for k in ["sword", "blade", "bow", "staff", "wand", "axe", "mace", "spear", "dagger", "hammer", "sickle", "glaive", "whip", "halberd"]):
        return WEAPON
    if any(k in name_lower for k in ["helmet", "crown", "hood", "cap", "mask"]):
        return HELMET
    if any(k in name_lower for k in ["armor", "plate", "mail", "robe", "tunic", "cuirass", "shield"]):
        return ARMOR
    if any(k in name_lower for k in ["glove", "gauntlet", "bracer"]):
        return GLOVES
    if any(k in name_lower for k in ["boot", "shoe", "greave", "sandal", "runners"]):
        return BOOTS
    if "ring" in name_lower or "band" in name_lower:
        return RING
    if "necklace" in name_lower or "amulet" in name_lower or "pendant" in name_lower or "choker" in name_lower:
        return NECKLACE
    if "potion" in name_lower or "flask" in name_lower or "elixir" in name_lower:
        return CONSUMABLE
    if any(k in name_lower for k in ["gem", "crystal", "stone", "shard", "ore", "ingot", "material"]):
        return MATERIAL
    if any(k in name_lower for k in ["relic", "artifact"]):
        if "relic" in name_lower:
            return RELIC
        return ARTIFACT
        
    return MATERIAL # Default fallback

async def main():
    json_path = os.path.join(os.path.dirname(__file__), "..", "..", "client", "public", "icons", "item-names.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        item_names = json.load(f)

    db = Prisma()
    await db.connect()
    
    # Optional: Clear existing item definitions to avoid duplicates if re-run
    await db.itemdefinition.delete_many()
    print("Cleared existing ItemDefinitions.")

    print(f"Loaded {len(item_names)} items from JSON.")

    inserted = 0
    for filename, item_name in item_names.items():
        item_type = guess_type(item_name)
        item_rarity = random.choice(RARITIES)
        
        icon_path = f"/icons/{filename}"
        
        # Placeholder stats
        base_stat = random.randint(1, 50)
        
        # Try to guess stat based on type
        attack = base_stat if item_type == WEAPON else 0
        defense = base_stat if item_type in [HELMET, ARMOR, GLOVES, BOOTS] else 0
        strength = random.randint(0, 15) if item_type != CONSUMABLE and item_type != MATERIAL else 0
        knowledge = random.randint(0, 15) if item_type != CONSUMABLE and item_type != MATERIAL else 0
        
        sell_value = random.randint(10, 500)
        
        await db.itemdefinition.create(
            data={
                "name": item_name,
                "description": f"A {item_rarity.lower()} {item_name}.",
                "type": item_type,
                "rarity": item_rarity,
                "icon": icon_path,
                "sellValue": sell_value,
                "attack": attack,
                "defense": defense,
                "strength": strength,
                "knowledge": knowledge,
            }
        )
        inserted += 1
        if inserted % 50 == 0:
            print(f"Inserted {inserted} items...")
            
    print(f"Successfully seeded {inserted} items into ItemDefinition.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
