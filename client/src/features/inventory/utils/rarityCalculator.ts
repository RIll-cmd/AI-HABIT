import { ItemRarity } from "../types";

export const RARITY_MULTIPLIERS: Record<ItemRarity, number> = {
  Common: 1.0,
  Uncommon: 1.2,
  Rare: 1.5,
  Epic: 2.2,
  Legendary: 3.5,
  Mythic: 6.0,
  Ancient: 10.0,
};

/**
 * Performs a weighted random roll to determine item rarity, scaled by luckModifier.
 * Base chances: Common (50%), Uncommon (25%), Rare (15%), Epic (7%), Legendary (2.5%), Mythic (0.4%), Ancient (0.1%).
 */
export function rollRarity(luckModifier: number = 0): ItemRarity {
  const safeLuck = Math.max(0, luckModifier || 0);
  const luckShift = Math.min(150, Math.floor(safeLuck * 2.5));
  const rawRoll = Math.floor(Math.random() * 1000) + luckShift;

  if (rawRoll >= 999) return "Ancient";
  if (rawRoll >= 995) return "Mythic";
  if (rawRoll >= 970) return "Legendary";
  if (rawRoll >= 900) return "Epic";
  if (rawRoll >= 750) return "Rare";
  if (rawRoll >= 500) return "Uncommon";
  return "Common";
}
