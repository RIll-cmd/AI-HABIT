import { MissionStatus, CompletionType } from '../types';

/**
 * Calculates consistency score as a percentage (0 to 100).
 * Protects against division by zero.
 */
export function calculateConsistency(
  completedSessions: number,
  expectedSessions: number
): number {
  if (expectedSessions <= 0) {
    return 0;
  }
  const ratio = (completedSessions / expectedSessions) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio * 100) / 100));
}

/**
 * Calculates updated habit strength score (0.0 to 100.0).
 * Rules:
 * Maximum is 100.0, Minimum is 0.0.
 * If MISSED: deduct 5.0.
 * If COMPLETED:
 *   - MINI: add 0.5
 *   - NORMAL: add 1.0
 *   - ELITE: add 2.0
 */
export function calculateNewHabitStrength(
  currentStrength: number,
  status: MissionStatus,
  completionType?: CompletionType | null
): number {
  let newStrength = currentStrength;

  if (status === 'MISSED') {
    newStrength -= 5.0;
  } else if (status === 'COMPLETED') {
    switch (completionType) {
      case 'MINI':
        newStrength += 0.5;
        break;
      case 'ELITE':
        newStrength += 2.0;
        break;
      case 'NORMAL':
      default:
        newStrength += 1.0;
        break;
    }
  }

  // Clamp strength between 0.0 and 100.0
  const clamped = Math.min(100.0, Math.max(0.0, newStrength));
  // Round to 2 decimal places to avoid floating point precision artifacts (e.g. 99.50000000000001)
  return Math.round(clamped * 100) / 100;
}
