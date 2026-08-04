import { Enemy } from "../types";
import { BattleResult } from "../types/combat";
import { calculateTurnDamage } from "../utils/damageFormula";

export class CombatEngine {
  /**
   * Simulates an automated turn-based battle between character and scaled enemy.
   * Returns a complete BattleResult containing victory state, logs, and HP details.
   */
  public static simulateBattle(character: any, enemy: Enemy): BattleResult {
    const getStat = (key: string): number => {
      const stats = character?.stats || {};
      const lowerKey = key.toLowerCase();
      if (typeof character?.[key] === "number" && !isNaN(character[key])) {
        return character[key];
      }
      for (const k of Object.keys(stats)) {
        if (k.toLowerCase() === lowerKey) {
          const val = stats[k];
          if (typeof val === "number" && !isNaN(val)) return val;
        }
      }
      return 1;
    };

    const endurance = getStat("endurance");
    const recovery = getStat("recovery");
    const charLevel = character?.level || 1;

    const maxCharacterHp = Math.max(100, endurance * 20 + charLevel * 10);
    const maxEnemyHp = Math.max(1, enemy.baseHp || 100);

    let characterHp = maxCharacterHp;
    let enemyHp = maxEnemyHp;
    let turnCount = 0;
    const logs: string[] = [];

    logs.push(
      `Battle Initiated! [Character HP: ${maxCharacterHp}] vs [${enemy.name} HP: ${maxEnemyHp}]`
    );

    while (characterHp > 0 && enemyHp > 0 && turnCount < 100) {
      turnCount++;

      // 1. Character Turn
      const charAttackPower =
        character?.attack ||
        (character?.power ? Math.max(15, Math.floor(character.power / 5)) : 20) +
          getStat("strength") * 2;

      const charAttacker = {
        attack: charAttackPower,
        knowledge: getStat("knowledge"),
        focus: getStat("focus"),
        forceCritical: character?.forceCritical,
      };

      const enemyDefender = {
        baseDefense: enemy.baseDefense,
        discipline: 0,
      };

      const charTurnResult = calculateTurnDamage(charAttacker, enemyDefender);
      enemyHp = Math.max(0, enemyHp - charTurnResult.totalDamage);

      let charLog = `Turn ${turnCount}: You strike ${enemy.name} for ${charTurnResult.totalDamage} damage!`;
      if (charTurnResult.isCritical) charLog += " (Critical Hit!)";
      if (charTurnResult.armorPenetrated) charLog += " (Armor Penetrated!)";

      // Recovery Heal Bonus
      const healAmount = Math.floor(recovery * 0.5);
      if (healAmount > 0 && characterHp < maxCharacterHp) {
        const actualHeal = Math.min(healAmount, maxCharacterHp - characterHp);
        characterHp += actualHeal;
        charLog += ` (Recovered +${actualHeal} HP)`;
      }

      logs.push(charLog);

      // Check if enemy defeated
      if (enemyHp <= 0) break;

      // 2. Enemy Turn
      const enemyAttacker = {
        baseAttack: enemy.baseAttack,
        knowledge: 1,
        focus: 1,
      };

      const charDefender = {
        baseDefense: Math.floor(endurance * 0.5),
        discipline: getStat("discipline"),
      };

      const enemyTurnResult = calculateTurnDamage(enemyAttacker, charDefender);
      characterHp = Math.max(0, characterHp - enemyTurnResult.totalDamage);

      let enemyLog = `${enemy.name} attacks you for ${enemyTurnResult.totalDamage} damage.`;
      if (enemyTurnResult.isCritical) enemyLog += " (Critical Hit!)";
      logs.push(enemyLog);
    }

    const isVictory = characterHp > 0 && enemyHp <= 0;

    if (isVictory) {
      logs.push(`Victory! You defeated ${enemy.name} in ${turnCount} turns.`);
    } else if (turnCount >= 100) {
      logs.push(`Battle Timed Out! You fled from ${enemy.name} after 100 turns.`);
    } else {
      logs.push(`Defeat... You were vanquished by ${enemy.name} on Turn ${turnCount}.`);
    }

    return {
      isVictory,
      logs,
      totalTurns: turnCount,
      remainingHp: Math.max(0, characterHp),
      maxCharacterHp,
      maxEnemyHp,
    };
  }
}

export const simulateBattle = CombatEngine.simulateBattle;
