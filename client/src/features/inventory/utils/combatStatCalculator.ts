import { PlayerItem } from "../types";
import { PlayerSkill } from "@/features/skills/types";

export interface ItemMultipliers {
  strengthPct: number;
  knowledgePct: number;
  recoveryPct: number;
  focusPct: number;
  disciplinePct: number;
  endurancePct: number;
  consistencyPct: number;
}

export interface CombatStats {
  strength: number;
  knowledge: number;
  recovery: number;
  focus: number;
  discipline: number;
  endurance: number;
  consistency?: number;
  attack: number;
  defense: number;
  hp: number;
  critDamage?: number;
  expBonus?: number;
  itemMultipliers?: ItemMultipliers;
  [key: string]: any;
}

/**
 * Calculates Total Combat Stats by applying percentage multipliers from equipped gear
 * to real-world character base stats.
 * Gear acts as an amplifier: players MUST develop real-world stats to gain high power.
 */
export function calculateTotalCombatStats(
  baseStats: Record<string, number>,
  equippedItems: PlayerItem[] = [],
  playerSkills: PlayerSkill[] = []
): CombatStats {
  const safeBaseStats = baseStats || {};

  const baseStr = safeBaseStats.strength || 1;
  const baseKnw = safeBaseStats.knowledge || 1;
  const baseRec = safeBaseStats.recovery || 1;
  const baseFoc = safeBaseStats.focus || 1;
  const baseDis = safeBaseStats.discipline || 1;
  const baseEnd = safeBaseStats.endurance || 1;
  const baseCns = safeBaseStats.consistency || 1;

  // Equipment percentage multipliers & flat combat values
  let itemStrPct = 0;
  let itemKnwPct = 0;
  let itemRecPct = 0;
  let itemFocPct = 0;
  let itemDisPct = 0;
  let itemEndPct = 0;
  let itemCnsPct = 0;
  let itemAttack = 0;
  let itemDefense = 0;

  for (const item of equippedItems) {
    if (!item || !item.isEquipped) continue;
    const def = item.itemDefinition;
    if (!def) continue;

    itemAttack += def.attack || 0;
    itemDefense += def.defense || 0;
    itemStrPct += def.strength || 0;
    itemKnwPct += def.knowledge || 0;
    itemRecPct += def.recovery || 0;
    itemFocPct += def.focus || 0;
    itemDisPct += def.discipline || 0;
    itemEndPct += def.endurance || 0;
    itemCnsPct += (def as any).consistency || 0;
  }

  // Percentage bonuses scale directly with the user's real-life base stats:
  const bonusStr = Math.floor(baseStr * (itemStrPct / 100));
  const bonusKnw = Math.floor(baseKnw * (itemKnwPct / 100));
  const bonusRec = Math.floor(baseRec * (itemRecPct / 100));
  const bonusFoc = Math.floor(baseFoc * (itemFocPct / 100));
  const bonusDis = Math.floor(baseDis * (itemDisPct / 100));
  const bonusEnd = Math.floor(baseEnd * (itemEndPct / 100));
  const bonusCns = Math.floor(baseCns * (itemCnsPct / 100));

  let finalStr = baseStr + bonusStr;
  let finalKnw = baseKnw + bonusKnw;
  let finalRec = baseRec + bonusRec;
  let finalFoc = baseFoc + bonusFoc;
  let finalDis = baseDis + bonusDis;
  let finalEnd = baseEnd + bonusEnd;
  let finalCns = baseCns + bonusCns;

  // Apply Skill Multipliers
  let strengthSkillMult = 1;
  let enduranceSkillMult = 1;
  let focusSkillMult = 1;
  let disciplineSkillMult = 1;
  let recoverySkillMult = 1;
  let critDamageBonus = 0;
  let expBonus = 0;

  for (const pSkill of playerSkills || []) {
    if (pSkill.skillDefinitionId === "asc_01") {
      strengthSkillMult += 0.04;
      enduranceSkillMult += 0.04;
    }
    if (pSkill.skillDefinitionId === "asc_02") {
      focusSkillMult += 0.05;
      disciplineSkillMult += 0.05;
    }
    if (pSkill.skillDefinitionId === "asc_03") {
      recoverySkillMult += 0.08;
    }
    if (pSkill.skillDefinitionId === "asc_05") {
      expBonus += 0.10;
    }
  }

  finalStr = Math.floor(finalStr * strengthSkillMult);
  finalEnd = Math.floor(finalEnd * enduranceSkillMult);
  finalFoc = Math.floor(finalFoc * focusSkillMult);
  finalDis = Math.floor(finalDis * disciplineSkillMult);
  finalRec = Math.floor(finalRec * recoverySkillMult);

  if ((playerSkills || []).some((ps) => ps.skillDefinitionId === "asc_04")) {
    critDamageBonus += Math.floor(finalKnw * 0.05);
  }

  return {
    strength: finalStr,
    knowledge: finalKnw,
    recovery: finalRec,
    focus: finalFoc,
    discipline: finalDis,
    endurance: finalEnd,
    consistency: finalCns,
    attack: finalStr * 2 + itemAttack,
    defense: finalEnd * 1 + itemDefense,
    hp: finalEnd * 20,
    critDamage: 150 + critDamageBonus,
    expBonus: expBonus,
    itemMultipliers: {
      strengthPct: itemStrPct,
      knowledgePct: itemKnwPct,
      recoveryPct: itemRecPct,
      focusPct: itemFocPct,
      disciplinePct: itemDisPct,
      endurancePct: itemEndPct,
      consistencyPct: itemCnsPct,
    },
  };
}
