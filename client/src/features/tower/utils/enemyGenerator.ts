import { Enemy } from "../types";

/**
 * Scales an enemy's base stats procedurally based on floor number height.
 * Floor 1 returns unmodified base stats. Higher floors scale exponentially.
 */
export function scaleEnemyForFloor(
  baseEnemy: Enemy,
  floorNumber: number
): Enemy {
  const safeFloor = Math.max(1, floorNumber || 1);
  const floorMultiplier = safeFloor - 1;

  const baseHp = baseEnemy.baseHp || 100;
  const baseAttack = baseEnemy.baseAttack || 10;
  const baseDefense = baseEnemy.baseDefense || 5;
  const baseSpeed = baseEnemy.baseSpeed || 10;

  const scaledHp = Math.floor(baseHp * (1 + floorMultiplier * 0.25));
  const scaledAttack = Math.floor(baseAttack * (1 + floorMultiplier * 0.15));
  const scaledDefense = Math.floor(baseDefense * (1 + floorMultiplier * 0.10));
  const scaledSpeed = Math.floor(baseSpeed * (1 + floorMultiplier * 0.05));

  return {
    ...baseEnemy,
    baseHp: scaledHp,
    baseAttack: scaledAttack,
    baseDefense: scaledDefense,
    baseSpeed: scaledSpeed,
  };
}
