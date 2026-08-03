export interface LevelData {
  currentLevel: number;
  currentExpInLevel: number;
  expToNextLevel: number;
  progressPercentage: number;
}

/**
 * Calculates character level and EXP progression using a clean mathematical scaling curve.
 * Level 1 requires 100 EXP to complete, Level 2 requires 150 EXP (cumulative 250),
 * Level 3 requires 200 EXP (cumulative 450), etc.
 */
export function calculateLevelData(totalExp: number): LevelData {
  let level = 1;
  let remainingExp = Math.max(0, totalExp);
  let expRequiredForNext = 100;

  while (remainingExp >= expRequiredForNext) {
    remainingExp -= expRequiredForNext;
    level += 1;
    expRequiredForNext = 50 * (level + 1);
  }

  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.floor((remainingExp / expRequiredForNext) * 100))
  );

  return {
    currentLevel: level,
    currentExpInLevel: remainingExp,
    expToNextLevel: expRequiredForNext,
    progressPercentage,
  };
}
