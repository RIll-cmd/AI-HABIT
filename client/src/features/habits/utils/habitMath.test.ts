import { describe, it, expect } from 'vitest';
import {
  getBaseReward,
  calculateFinalReward,
  calculateConsistency,
  calculateNewHabitStrength,
} from './index';

describe('Habit Engine Core Math Utilities', () => {
  describe('getBaseReward', () => {
    it('should return correct base rewards for Easy difficulty', () => {
      expect(getBaseReward('Easy')).toEqual({ exp: 15, gold: 5, stat: 2 });
    });

    it('should return correct base rewards for Medium difficulty', () => {
      expect(getBaseReward('Medium')).toEqual({ exp: 35, gold: 12, stat: 5 });
    });

    it('should return correct base rewards for Hard difficulty', () => {
      expect(getBaseReward('Hard')).toEqual({ exp: 75, gold: 25, stat: 10 });
    });
  });

  describe('calculateFinalReward', () => {
    it('should calculate NORMAL completion rewards (100% multiplier)', () => {
      const base = getBaseReward('Easy'); // 15 EXP, 5 Gold, 2 Stat
      const final = calculateFinalReward(base, 'NORMAL');
      expect(final).toEqual({ exp: 15, gold: 5, stat: 2 });
    });

    it('should calculate MINI completion rewards (40% multiplier rounded)', () => {
      const base = getBaseReward('Medium'); // 35 EXP, 12 Gold, 5 Stat
      // exp: 35 * 0.4 = 14
      // gold: 12 * 0.4 = 4.8 -> 5
      // stat: 5 * 0.4 = 2
      const final = calculateFinalReward(base, 'MINI');
      expect(final).toEqual({ exp: 14, gold: 5, stat: 2 });
    });

    it('should calculate ELITE completion rewards (170% multiplier rounded)', () => {
      const base = getBaseReward('Hard'); // 75 EXP, 25 Gold, 10 Stat
      // exp: 75 * 1.7 = 127.5 -> 128
      // gold: 25 * 1.7 = 42.5 -> 43
      // stat: 10 * 1.7 = 17 -> 17
      const final = calculateFinalReward(base, 'ELITE');
      expect(final).toEqual({ exp: 128, gold: 43, stat: 17 });
    });
  });

  describe('calculateConsistency', () => {
    it('should return 0 when expectedSessions is 0 or negative (protect division by zero)', () => {
      expect(calculateConsistency(5, 0)).toBe(0);
      expect(calculateConsistency(5, -2)).toBe(0);
    });

    it('should calculate exact consistency percentage', () => {
      expect(calculateConsistency(7, 10)).toBe(70);
      expect(calculateConsistency(3, 4)).toBe(75);
    });

    it('should clamp consistency percentage between 0 and 100', () => {
      expect(calculateConsistency(12, 10)).toBe(100);
      expect(calculateConsistency(-1, 10)).toBe(0);
    });
  });

  describe('calculateNewHabitStrength', () => {
    it('should deduct 5.0 on MISSED mission', () => {
      expect(calculateNewHabitStrength(80.0, 'MISSED')).toBe(75.0);
    });

    it('should clamp minimum strength to 0.0 on MISSED decay', () => {
      expect(calculateNewHabitStrength(3.0, 'MISSED')).toBe(0.0);
    });

    it('should add 0.5 on MINI completion', () => {
      expect(calculateNewHabitStrength(50.0, 'COMPLETED', 'MINI')).toBe(50.5);
    });

    it('should add 1.0 on NORMAL completion', () => {
      expect(calculateNewHabitStrength(50.0, 'COMPLETED', 'NORMAL')).toBe(51.0);
    });

    it('should add 2.0 on ELITE completion', () => {
      expect(calculateNewHabitStrength(50.0, 'COMPLETED', 'ELITE')).toBe(52.0);
    });

    it('should cap maximum habit strength at 100.0', () => {
      expect(calculateNewHabitStrength(99.5, 'COMPLETED', 'ELITE')).toBe(100.0);
      expect(calculateNewHabitStrength(100.0, 'COMPLETED', 'NORMAL')).toBe(100.0);
    });

    it('should return current strength unchanged for PENDING status', () => {
      expect(calculateNewHabitStrength(75.0, 'PENDING')).toBe(75.0);
    });
  });
});
