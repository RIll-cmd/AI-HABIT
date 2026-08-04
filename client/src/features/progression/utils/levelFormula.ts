export interface LevelData {
  currentLevel: number;
  currentExpInLevel: number;
  expToNextLevel: number;
  progressPercentage: number;
}

/**
 * Calculates the EXP required to complete the specified level.
 * Algorithmic curve: Math.floor(100 * level^1.5)
 * Level 1 requires 100 EXP, Level 2 requires 282 EXP, etc.
 */
export function calculateExpForLevel(level: number): number {
  if (level < 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Dynamically calculates level progression stats based on total lifetime EXP.
 */
export function calculateLevelData(totalExp: number): LevelData {
  let remainingExp = Math.max(0, totalExp);
  let currentLevel = 1;

  while (true) {
    const expNeeded = calculateExpForLevel(currentLevel);
    if (remainingExp < expNeeded) {
      const currentExpInLevel = remainingExp;
      const rawProgress = (currentExpInLevel / expNeeded) * 100;
      const progressPercentage = Math.min(100, Math.round(rawProgress * 100) / 100);

      return {
        currentLevel,
        currentExpInLevel,
        expToNextLevel: expNeeded,
        progressPercentage,
      };
    }

    remainingExp -= expNeeded;
    currentLevel++;
  }
}
