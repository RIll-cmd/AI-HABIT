import asyncio
import os
from dotenv import load_dotenv

# Load env variables from server/.env
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from prisma import Prisma

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
    
    r_lower = (rarity or "common").lower()
    t_upper = (item_type or "MATERIAL").upper()
    
    if t_upper == "WEAPON":
        return f"A {r_lower} {name.lower()} imbued with compressed system mana. Its refined blade channels the wielder's kinetic discipline into decisive strike power."
    elif t_upper in ["HELMET", "ARMOR", "GLOVES", "BOOTS"]:
        return f"A {r_lower} piece of defensive gear reinforced with high-grade alloy fibers. Designed to absorb kinetic impact and insulate the Ascendant against high-tier boss strikes."
    elif t_upper in ["RING", "NECKLACE"]:
        return f"A {r_lower} accessory enchanted with ancient runic conduits. Resonates with the wearer's neural core, amplifying stat scaling and focus."
    elif t_upper == "CONSUMABLE":
        return f"A highly concentrated {r_lower} alchemical solution. Synthesized to restore physical stamina and optimize the body's internal energy flow."
    elif t_upper in ["ARTIFACT", "RELIC"]:
        return f"An ancient {r_lower} relic discovered within deep Gate dungeons. Radiates high-density system mana that empowers the owner's combat trajectory."
    else:
        return f"A rare {r_lower} material synthesized from Gate rifts. Highly valued by blacksmiths and alchemists for gear enhancement."

async def main():
    db = Prisma()
    await db.connect()
    print("[Lore Migration] Connected to database.")

    all_items = await db.itemdefinition.find_many()
    print(f"[Lore Migration] Found {len(all_items)} ItemDefinitions in database.")

    updated_count = 0
    for item in all_items:
        new_lore = get_rich_lore(item.name, item.type, item.rarity)
        if item.description != new_lore:
            await db.itemdefinition.update(
                where={"id": item.id},
                data={"description": new_lore}
            )
            updated_count += 1

    print(f"[Lore Migration] Successfully updated {updated_count} ItemDefinition lore descriptions!")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
