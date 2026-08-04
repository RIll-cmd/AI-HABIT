import { EquipmentSlot, ItemRarity, Equipment } from "../types";
import { RARITY_MULTIPLIERS } from "./rarityCalculator";

/**
 * Generates procedurally scaled Equipment stats based on EquipmentSlot, ItemRarity, and floorLevel.
 */
export function generateEquipmentStats(
  slot: EquipmentSlot,
  rarity: ItemRarity,
  floorLevel: number = 1
): Partial<Equipment> {
  const mult = RARITY_MULTIPLIERS[rarity] || 1.0;
  const safeFloor = Math.max(1, floorLevel || 1);

  const baseScale = 5 + safeFloor * 3;

  const stats: Partial<Equipment> = {
    slot,
    strength: 0,
    knowledge: 0,
    recovery: 0,
    focus: 0,
    discipline: 0,
    endurance: 0,
    attack: 0,
    defense: 0,
    hp: 0,
  };

  switch (slot) {
    case "Weapon":
      stats.attack = Math.floor(baseScale * 2.5 * mult);
      stats.strength = Math.floor(baseScale * 0.8 * mult);
      break;
    case "Helmet":
      stats.defense = Math.floor(baseScale * 1.5 * mult);
      stats.knowledge = Math.floor(baseScale * 0.6 * mult);
      stats.focus = Math.floor(baseScale * 0.5 * mult);
      break;
    case "Armor":
      stats.defense = Math.floor(baseScale * 2.5 * mult);
      stats.endurance = Math.floor(baseScale * 0.8 * mult);
      stats.hp = Math.floor(baseScale * 10.0 * mult);
      break;
    case "Gloves":
      stats.attack = Math.floor(baseScale * 1.0 * mult);
      stats.discipline = Math.floor(baseScale * 0.6 * mult);
      stats.strength = Math.floor(baseScale * 0.5 * mult);
      break;
    case "Boots":
      stats.recovery = Math.floor(baseScale * 0.8 * mult);
      stats.discipline = Math.floor(baseScale * 0.6 * mult);
      stats.defense = Math.floor(baseScale * 0.8 * mult);
      break;
    case "Ring":
      stats.focus = Math.floor(baseScale * 0.8 * mult);
      stats.knowledge = Math.floor(baseScale * 0.7 * mult);
      break;
    case "Necklace":
      stats.recovery = Math.floor(baseScale * 0.8 * mult);
      stats.hp = Math.floor(baseScale * 8.0 * mult);
      break;
    case "Artifact":
      stats.knowledge = Math.floor(baseScale * 1.0 * mult);
      stats.focus = Math.floor(baseScale * 0.8 * mult);
      stats.attack = Math.floor(baseScale * 1.0 * mult);
      break;
    case "Relic":
      stats.strength = Math.floor(baseScale * 0.5 * mult);
      stats.knowledge = Math.floor(baseScale * 0.5 * mult);
      stats.recovery = Math.floor(baseScale * 0.5 * mult);
      stats.focus = Math.floor(baseScale * 0.5 * mult);
      stats.discipline = Math.floor(baseScale * 0.5 * mult);
      stats.endurance = Math.floor(baseScale * 0.5 * mult);
      break;
  }

  return stats;
}
