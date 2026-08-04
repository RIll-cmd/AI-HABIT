import { Floor } from "../types";

export interface FloorAccessResult {
  canEnter: boolean;
  missingRequirements: string[];
}

/**
 * Validates whether a character meets the recommended power score and 6 stat requirements to enter a floor.
 */
export function validateFloorAccess(
  character: any,
  floor: Floor
): FloorAccessResult {
  const missingRequirements: string[] = [];

  const charPower = typeof character?.power === "number" ? character.power : 0;
  if (charPower < floor.recommendedPower) {
    missingRequirements.push(
      `Power score of ${floor.recommendedPower} required (Current: ${charPower})`
    );
  }

  const getStat = (key: string): number => {
    const stats = character?.stats || {};
    const lowerKey = key.toLowerCase();
    for (const k of Object.keys(stats)) {
      if (k.toLowerCase() === lowerKey) {
        const val = stats[k];
        if (typeof val === "number" && !isNaN(val)) return val;
      }
    }
    return 1;
  };

  const statChecks: Array<{ name: string; key: string; required: number }> = [
    { name: "Strength", key: "strength", required: floor.minStrength },
    { name: "Knowledge", key: "knowledge", required: floor.minKnowledge },
    { name: "Recovery", key: "recovery", required: floor.minRecovery },
    { name: "Discipline", key: "discipline", required: floor.minDiscipline },
    { name: "Focus", key: "focus", required: floor.minFocus },
    { name: "Endurance", key: "endurance", required: floor.minEndurance },
  ];

  for (const check of statChecks) {
    const currentVal = getStat(check.key);
    if (currentVal < check.required) {
      missingRequirements.push(
        `${check.name} ${check.required} required (Current: ${currentVal})`
      );
    }
  }

  return {
    canEnter: missingRequirements.length === 0,
    missingRequirements,
  };
}
