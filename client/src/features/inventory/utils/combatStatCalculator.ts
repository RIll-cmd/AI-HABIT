import { Equipment } from "../types";

export interface CombatStats {
  strength: number;
  knowledge: number;
  recovery: number;
  focus: number;
  discipline: number;
  endurance: number;
  attack: number;
  defense: number;
  hp: number;
  [key: string]: number;
}

/**
 * Merges character base stats with all bonuses from equipped items into a final CombatStats object.
 * Does NOT mutate the original baseStats object.
 */
export function calculateTotalCombatStats(
  baseStats: Record<string, number>,
  equippedItems: Partial<Equipment>[] = []
): CombatStats {
  const safeBaseStats = baseStats || {};

  const totalStats: CombatStats = {
    strength: safeBaseStats.strength || 1,
    knowledge: safeBaseStats.knowledge || 1,
    recovery: safeBaseStats.recovery || 1,
    focus: safeBaseStats.focus || 1,
    discipline: safeBaseStats.discipline || 1,
    endurance: safeBaseStats.endurance || 1,
    attack: safeBaseStats.attack || 0,
    defense: safeBaseStats.defense || 0,
    hp: safeBaseStats.hp || 100,
  };

  // Retain any extra keys present in baseStats without mutation
  for (const [key, val] of Object.entries(safeBaseStats)) {
    if (typeof val === "number" && !(key in totalStats)) {
      totalStats[key] = val;
    }
  }

  for (const item of equippedItems) {
    if (!item) continue;
    totalStats.strength += item.strength || 0;
    totalStats.knowledge += item.knowledge || 0;
    totalStats.recovery += item.recovery || 0;
    totalStats.focus += item.focus || 0;
    totalStats.discipline += item.discipline || 0;
    totalStats.endurance += item.endurance || 0;
    totalStats.attack += item.attack || 0;
    totalStats.defense += item.defense || 0;
    totalStats.hp += item.hp || 0;
  }

  return totalStats;
}
