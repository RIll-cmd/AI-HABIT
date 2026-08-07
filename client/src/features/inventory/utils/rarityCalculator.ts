import { ItemRarity } from "../types";

export const RARITY_MULTIPLIERS: Record<ItemRarity, number> = {
  COMMON: 1.0,
  RARE: 1.5,
  EPIC: 2.2,
  LEGENDARY: 3.5,
  MYTHIC: 6.0,
};

/**
 * Performs a weighted random roll to determine item rarity, scaled by luckModifier.
 * Base chances: Common (50%), Uncommon (25%), Rare (15%), Epic (7%), Legendary (2.5%), Mythic (0.4%), Ancient (0.1%).
 */
export function rollRarity(luckModifier: number = 0): ItemRarity {
  const safeLuck = Math.max(0, luckModifier || 0);
  const luckShift = Math.min(150, Math.floor(safeLuck * 2.5));
  const rawRoll = Math.floor(Math.random() * 1000) + luckShift;

  if (rawRoll >= 995) return "MYTHIC";
  if (rawRoll >= 970) return "LEGENDARY";
  if (rawRoll >= 900) return "EPIC";
  if (rawRoll >= 750) return "RARE";
  return "COMMON";
}
