export interface DamageResult {
  totalDamage: number;
  isCritical: boolean;
  armorPenetrated: boolean;
}

export interface CombatEntity {
  power?: number;
  attack?: number;
  baseAttack?: number;
  defense?: number;
  baseDefense?: number;
  forceCritical?: boolean;
  stats?: Record<string, number>;
  [key: string]: any; // fallback for loose stat properties (e.g. attacker.knowledge)
}

/**
 * Calculates turn-based combat damage between attacker and defender using Knowledge, Focus, and Discipline effects.
 */
export function calculateTurnDamage(
  attacker: CombatEntity,
  defender: CombatEntity
): DamageResult {
  const getStat = (obj: CombatEntity, key: string, fallback = 1): number => {
    if (!obj) return fallback;
    if (typeof obj[key] === "number" && !isNaN(obj[key])) return obj[key];
    const stats = obj.stats || {};
    const lowerKey = key.toLowerCase();
    for (const k of Object.keys(stats)) {
      if (k.toLowerCase() === lowerKey) {
        const val = stats[k];
        if (typeof val === "number" && !isNaN(val)) return val;
      }
    }
    return fallback;
  };

  const attackerAttack =
    attacker?.attack ??
    attacker?.baseAttack ??
    (attacker?.power ? Math.floor(attacker.power / 5) : 10);
  const defenderDefense = defender?.defense ?? defender?.baseDefense ?? 0;

  // 1. Knowledge Effect: Bypasses enemy defense percentage (Knowledge / 500)
  const attackerKnowledge = getStat(attacker, "knowledge", 1);
  const armorPenPercent = Math.min(1, Math.max(0, attackerKnowledge / 500));
  const effectiveDefense = Math.max(0, defenderDefense * (1 - armorPenPercent));
  const armorPenetrated = armorPenPercent > 0.05 && defenderDefense > 0;

  const rawDamage = Math.max(1, attackerAttack - effectiveDefense);

  // 2. Focus Effect: Critical hit probability (Focus / 200, max 75%)
  const attackerFocus = getStat(attacker, "focus", 1);
  const critChance = Math.min(0.75, Math.max(0, attackerFocus / 200));
  const isCritical =
    typeof attacker?.forceCritical === "boolean"
      ? attacker.forceCritical
      : Math.random() < critChance;

  const critMultiplier = isCritical ? 1.5 : 1.0;
  const damageAfterCrit = rawDamage * critMultiplier;

  // 3. Discipline Effect: Defender reduces incoming damage based on Discipline (Discipline / 600, max 75%)
  const defenderDiscipline = getStat(defender, "discipline", 0);
  const mitigationPercent = Math.min(0.75, Math.max(0, defenderDiscipline / 600));

  const totalDamage = Math.max(1, Math.floor(damageAfterCrit * (1 - mitigationPercent)));

  return {
    totalDamage,
    isCritical,
    armorPenetrated,
  };
}
