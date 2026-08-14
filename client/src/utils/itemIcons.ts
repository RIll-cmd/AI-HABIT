import itemNames from "../../public/icons/item-names.json";

// The imported JSON has {"Icon1.png": "Iron Shortsword", ...}
// We want to map "Iron Shortsword" -> "/icons/Icon1.png"

const itemNameMap: Record<string, string> = {};

Object.entries(itemNames).forEach(([iconFile, itemName]) => {
  if (typeof itemName === "string") {
    itemNameMap[itemName] = `/icons/${iconFile}`;
  }
});

const DEFAULT_ITEM_MAPPINGS: Record<string, string> = {
  "Shadow Blade": "/icons/Icon20.png",
  "Dragon Slayer": "/icons/Icon5.png",
  "Health Potion": "/icons/Icon304.png",
  "EXP Elixir": "/icons/Icon309.png",
  "Guardian Cuirass": "/icons/Icon185.png",
  "Ring of Dominion": "/icons/Icon244.png",

  // Crafted Weapons & Gear
  "Shadow Monarch's Dagger": "/icons/Icon7.png",
  "Dragon-Bone Greatsword": "/icons/Icon19.png",
  "Tempest Phantom Bow": "/icons/Icon110.png",
  "Void Singularity Staff": "/icons/Icon80.png",
  "Titan Alloy Cuirass": "/icons/Icon185.png",
  "Abyssal Guardian Crown": "/icons/Icon171.png",
  "Shadowstrider Greaves": "/icons/Icon230.png",
  "Ring of Absolute Dominion": "/icons/Icon249.png",
  "Amulet of Eternal Vitality": "/icons/Icon257.png",
  "Grand Elixir of Ascension": "/icons/Icon309.png",
  "Divine Full Recovery Potion": "/icons/Icon304.png",
  "Double-EXP Hyper Matrix Token": "/icons/Icon267.png",

  // Crafting Materials
  "Large Silver Gem": "/icons/Icon341.png",
  "Shadow Steel Ingot": "/icons/Icon390.png",
  "Obsidian Core Crystal": "/icons/Icon392.png",
  "Dragon Drake Scale": "/icons/Icon380.png",
  "Ocean Sapphire Shard": "/icons/Icon338.png",
  "Mana Root Essence": "/icons/Icon276.png",
  "Crimson Life Herb": "/icons/Icon279.png",
  "Solar Titan Quartz": "/icons/Icon331.png",
  "Monarch Soul Fragment": "/icons/Icon268.png",
  "System Processor Chip": "/icons/Icon261.png",
};

/**
 * Returns the correct icon path for a given item name or item type.
 * @param name The name of the item (e.g., "Health Potion")
 * @param type Optional item category/type (e.g., "CONSUMABLE", "ARMOR")
 * @returns The path to the PNG icon asset.
 */
export function getItemIconPath(name: string, type?: string): string {
  if (!name) return "/icons/Icon1.png";
  
  if (DEFAULT_ITEM_MAPPINGS[name]) {
    return DEFAULT_ITEM_MAPPINGS[name];
  }

  const exactPath = itemNameMap[name];
  if (exactPath) {
    return exactPath;
  }

  const nameLower = name.toLowerCase();
  const typeUpper = (type || "").toUpperCase();

  // Category & Keyword Rules
  if (nameLower.includes("potion") || nameLower.includes("elixir") || nameLower.includes("flask") || nameLower.includes("vial") || typeUpper === "CONSUMABLE") {
    if (nameLower.includes("exp") || nameLower.includes("mana") || nameLower.includes("blue")) {
      return "/icons/Icon309.png"; // Large Blue Potion
    }
    if (nameLower.includes("orange") || nameLower.includes("energy") || nameLower.includes("stamina")) {
      return "/icons/Icon314.png"; // Large Orange Potion
    }
    return "/icons/Icon304.png"; // Large Red Potion
  }

  if (nameLower.includes("cuirass") || nameLower.includes("armor") || nameLower.includes("plate") || nameLower.includes("tunic") || nameLower.includes("vest") || typeUpper === "ARMOR") {
    return "/icons/Icon185.png"; // Iron Breastplate
  }

  if (nameLower.includes("ring") || nameLower.includes("band") || nameLower.includes("pendant") || nameLower.includes("amulet") || nameLower.includes("necklace") || typeUpper === "RING" || typeUpper === "ACCESSORY") {
    return "/icons/Icon244.png"; // Golden Ring
  }

  if (nameLower.includes("shield") || nameLower.includes("buckler")) {
    return "/icons/Icon144.png"; // Iron Kite Shield
  }

  if (nameLower.includes("helmet") || nameLower.includes("cap") || nameLower.includes("helm")) {
    return "/icons/Icon165.png"; // Iron Cap
  }

  if (nameLower.includes("boots") || nameLower.includes("shoes")) {
    return "/icons/Icon225.png"; // Iron Boots
  }

  if (nameLower.includes("gloves") || nameLower.includes("gauntlets")) {
    return "/icons/Icon205.png"; // Iron Gauntlets
  }

  // Fallback weapon
  return "/icons/Icon1.png";
}
