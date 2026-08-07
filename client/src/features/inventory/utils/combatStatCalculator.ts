import { PlayerItem } from "../types";
import { PlayerSkill } from "@/features/skills/types";

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
  equippedItems: PlayerItem[] = [],
  playerSkills: PlayerSkill[] = []
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
    if (!item || !item.isEquipped) continue;
    const def = item.itemDefinition;
    totalStats.strength += def.strength || 0;
    totalStats.knowledge += def.knowledge || 0;
    totalStats.recovery += def.recovery || 0;
    totalStats.focus += def.focus || 0;
    totalStats.discipline += def.discipline || 0;
    totalStats.endurance += def.endurance || 0;
    totalStats.attack += def.attack || 0;
    totalStats.defense += def.defense || 0;
  }

  // Apply Skill Multipliers
  let strengthMult = 1;
  let enduranceMult = 1;
  let focusMult = 1;
  let disciplineMult = 1;
  let recoveryMult = 1;
  let critDamageBonus = 0;
  let expBonus = 0;

  for (const pSkill of playerSkills) {
    if (pSkill.skillDefinitionId === 'asc_01') {
      strengthMult += 0.04;
      enduranceMult += 0.04;
    }
    if (pSkill.skillDefinitionId === 'asc_02') {
      focusMult += 0.05;
      disciplineMult += 0.05;
    }
    if (pSkill.skillDefinitionId === 'asc_03') {
      recoveryMult += 0.08;
    }
    if (pSkill.skillDefinitionId === 'asc_05') {
      expBonus += 0.10;
    }
  }

  totalStats.strength = Math.floor(totalStats.strength * strengthMult);
  totalStats.endurance = Math.floor(totalStats.endurance * enduranceMult);
  totalStats.focus = Math.floor(totalStats.focus * focusMult);
  totalStats.discipline = Math.floor(totalStats.discipline * disciplineMult);
  totalStats.recovery = Math.floor(totalStats.recovery * recoveryMult);

  if (playerSkills.some(ps => ps.skillDefinitionId === 'asc_04')) {
    critDamageBonus += Math.floor(totalStats.knowledge * 0.05);
  }

  totalStats.critDamage = (totalStats.critDamage || 150) + critDamageBonus;
  totalStats.expBonus = (totalStats.expBonus || 0) + expBonus;

  return totalStats;
}
