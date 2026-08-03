import { CharacterStats } from "../types/character";

/**
 * Calculates total power score integer based on character level and stat attributes.
 * Formula: (level * 50) + (Total sum of all stats * 10).
 */
export function calculatePower(
  level: number,
  stats?: CharacterStats | null
): number {
  const safeLevel = Math.max(1, level);

  const totalStats = stats
    ? (stats.strength || 0) +
      (stats.knowledge || 0) +
      (stats.discipline || 0) +
      (stats.focus || 0) +
      (stats.endurance || 0) +
      (stats.recovery || 0) +
      (stats.consistency || 0)
    : 0;

  return Math.floor(safeLevel * 50 + totalStats * 10);
}
