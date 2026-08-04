import { describe, it, expect } from 'vitest';
import {
  calculateExpForLevel,
  calculateLevelData,
  calculateDynamicPower,
  determineRank,
} from './index';

describe('Progression Math Utilities', () => {
  describe('Level Formula (calculateExpForLevel & calculateLevelData)', () => {
    it('calculates expected EXP for levels 1 through 5', () => {
      expect(calculateExpForLevel(1)).toBe(100);
      expect(calculateExpForLevel(2)).toBe(282);
      expect(calculateExpForLevel(3)).toBe(519);
      expect(calculateExpForLevel(4)).toBe(800);
      expect(calculateExpForLevel(5)).toBe(1118);
    });

    it('handles 0 total EXP cleanly without breaking', () => {
      const data = calculateLevelData(0);
      expect(data).toEqual({
        currentLevel: 1,
        currentExpInLevel: 0,
        expToNextLevel: 100,
        progressPercentage: 0,
      });
    });

    it('handles partial level progress correctly', () => {
      const data = calculateLevelData(50);
      expect(data).toEqual({
        currentLevel: 1,
        currentExpInLevel: 50,
        expToNextLevel: 100,
        progressPercentage: 50,
      });
    });

    it('calculates level rollover correctly at exact thresholds', () => {
      const dataLevel2 = calculateLevelData(100);
      expect(dataLevel2).toEqual({
        currentLevel: 2,
        currentExpInLevel: 0,
        expToNextLevel: 282,
        progressPercentage: 0,
      });

      const dataLevel3 = calculateLevelData(382); // 100 + 282
      expect(dataLevel3).toEqual({
        currentLevel: 3,
        currentExpInLevel: 0,
        expToNextLevel: 519,
        progressPercentage: 0,
      });
    });
  });

  describe('Power Formula (calculateDynamicPower)', () => {
    it('defaults missing stats to 1', () => {
      // Level 1, empty stats object
      // (1 * 50) + (1 * 8) + (1 * 8) + (1 * 6) + (1 * 7) + (1 * 7) + (1 * 6) + (1 * 5) = 50 + 47 = 97
      expect(calculateDynamicPower(1, {})).toBe(97);
    });

    it('correctly weighs partial stats defaulting missing ones to 1', () => {
      // Level 2, strength 10, other 6 stats default to 1
      // (2 * 50) + (10 * 8) + (1 * 8) + (1 * 6) + (1 * 7) + (1 * 7) + (1 * 6) + (1 * 5) = 100 + 80 + 39 = 219
      expect(calculateDynamicPower(2, { strength: 10 })).toBe(219);
    });

    it('calculates weighted power accurately for full stat sets', () => {
      const stats = {
        strength: 10,
        knowledge: 5,
        recovery: 3,
        focus: 4,
        endurance: 2,
        discipline: 6,
        consistency: 8,
      };
      // (5 * 50) + (10*8) + (5*8) + (3*6) + (4*7) + (2*7) + (6*6) + (8*5)
      // 250 + 80 + 40 + 18 + 28 + 14 + 36 + 40 = 506
      expect(calculateDynamicPower(5, stats)).toBe(506);
    });
  });

  describe('Rank Formula (determineRank)', () => {
    it('correctly maps boundary values for all rank tiers', () => {
      expect(determineRank(0)).toBe('F');
      expect(determineRank(499)).toBe('F');
      expect(determineRank(500)).toBe('E');
      expect(determineRank(1499)).toBe('E');
      expect(determineRank(1500)).toBe('D');
      expect(determineRank(2999)).toBe('D');
      expect(determineRank(3000)).toBe('C');
      expect(determineRank(5999)).toBe('C');
      expect(determineRank(6000)).toBe('B');
      expect(determineRank(9999)).toBe('B');
      expect(determineRank(10000)).toBe('A');
      expect(determineRank(24999)).toBe('A');
      expect(determineRank(25000)).toBe('S');
      expect(determineRank(49999)).toBe('S');
      expect(determineRank(50000)).toBe('SS');
      expect(determineRank(99999)).toBe('SS');
      expect(determineRank(100000)).toBe('SSS');
      expect(determineRank(250000)).toBe('SSS');
    });
  });
});
