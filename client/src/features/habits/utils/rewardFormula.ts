import { HabitDifficulty, CompletionType } from '../types';

export interface BaseReward {
  exp: number;
  gold: number;
  stat: number;
}

/**
 * Returns the base reward yields for a habit based on difficulty.
 * Easy:   15 EXP,  5 Gold,  2 Stat
 * Medium: 35 EXP, 12 Gold,  5 Stat
 * Hard:   75 EXP, 25 Gold, 10 Stat
 */
export function getBaseReward(difficulty: HabitDifficulty): BaseReward {
  switch (difficulty) {
    case 'Easy':
      return { exp: 15, gold: 5, stat: 2 };
    case 'Medium':
      return { exp: 35, gold: 12, stat: 5 };
    case 'Hard':
      return { exp: 75, gold: 25, stat: 10 };
    default:
      return { exp: 15, gold: 5, stat: 2 };
  }
}

/**
 * Calculates the final rewards by applying a completion multiplier:
 * MINI:   0.4 (40%)
 * NORMAL: 1.0 (100%)
 * ELITE:  1.7 (170%)
 * Rounds all resulting figures using Math.round().
 */
export function calculateFinalReward(
  baseReward: BaseReward,
  completionType: CompletionType
): BaseReward {
  let multiplier = 1.0;

  switch (completionType) {
    case 'MINI':
      multiplier = 0.4;
      break;
    case 'NORMAL':
      multiplier = 1.0;
      break;
    case 'ELITE':
      multiplier = 1.7;
      break;
    default:
      multiplier = 1.0;
      break;
  }

  return {
    exp: Math.round(baseReward.exp * multiplier),
    gold: Math.round(baseReward.gold * multiplier),
    stat: Math.round(baseReward.stat * multiplier),
  };
}
