import json
import os
import random
import asyncio
from dotenv import load_dotenv

# Load env variables from server/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

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

EXACT_ITEM_LORES = {
    "Shadow Blade": "Forged from shadow-tempered steel harvested from F-Rank Gate rift edges. It absorbs ambient darkness to maintain a razor-sharp edge.",
    "Dragon Slayer": "A colossal broadsword forged from the calcified rib cage of an S-Rank Drake. Legend says its blade ignites when wielded by an Ascendant with unyielding physical strength.",
    "Health Potion": "A distilled crimson solution infused with condensed life energy. Restores cellular integrity and seals physical wounds instantly upon consumption.",
    "EXP Elixir": "A luminous blue elixir brewed from distilled mana roots. Stimulates the Ascendant's neural pathways, accelerating overall experience growth and neural adaptation.",
    "Guardian Cuirass": "Heavy chest armor hammered from high-density titan alloys. Designed to disperse brute physical force and shockwaves across its entire frame.",
    "Ring of Dominion": "An ancient ring inscribed with runic binding glyphs. It enhances both muscle fiber recruitment and mental processing speed.",
    "Double-EXP Token (1Hr)": "A synthesized system chip encoded with double experience algorithms. Temporarily doubles all EXP earned from daily disciplines and workouts.",
    "Double-Gold Potion": "A sparkling golden tonic infused with fortune-channeling mana. Temporarily doubles all Gold currency rewards earned across missions.",
    "Title Scroll: The Awakened": "An ancient parchment carrying the soul seal of an Awakened Monarch. Grants the prestige title 'The Awakened'.",
    "Glowing Profile Border": "A luminous holographic ring forged from high-frequency energy particles. Displays a radiant border around the Ascendant's avatar.",
}

def get_rich_lore(name, item_type, rarity):
    if name in EXACT_ITEM_LORES:
        return EXACT_ITEM_LORES[name]
    
    r_lower = rarity.lower()
    
    if item_type == "WEAPON":
        return f"A {r_lower} {name.lower()} imbued with compressed system mana. Its refined blade channels the wielder's kinetic discipline into decisive strike power."
    elif item_type in ["HELMET", "ARMOR", "GLOVES", "BOOTS"]:
        return f"A {r_lower} piece of defensive gear reinforced with high-grade alloy fibers. Designed to absorb kinetic impact and insulate the Ascendant against high-tier boss strikes."
    elif item_type in ["RING", "NECKLACE"]:
        return f"A {r_lower} accessory enchanted with ancient runic conduits. Resonates with the wearer's neural core, amplifying stat scaling and focus."
    elif item_type == "CONSUMABLE":
        return f"A highly concentrated {r_lower} alchemical solution. Synthesized to restore physical stamina and optimize the body's internal energy flow."
    elif item_type in ["ARTIFACT", "RELIC"]:
        return f"An ancient {r_lower} relic discovered within deep Gate dungeons. Radiates high-density system mana that empowers the owner's combat trajectory."
    else:
        return f"A rare {r_lower} material synthesized from Gate rifts. Highly valued by blacksmiths and alchemists for gear enhancement."

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
        lore_desc = get_rich_lore(item_name, item_type, item_rarity)
        
        await db.itemdefinition.create(
            data={
                "name": item_name,
                "description": lore_desc,
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
