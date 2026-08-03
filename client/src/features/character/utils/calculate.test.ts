import { describe, it, expect } from "vitest";
import {
  calculateLevelData,
  calculatePower,
  calculateRank,
} from "./index";
import { CharacterStats } from "../types/character";

describe("RPG Game Engine Math Utilities", () => {
  describe("calculateLevelData", () => {
    it("should return Level 1 with 0 EXP for 0 total EXP", () => {
      const result = calculateLevelData(0);
      expect(result).toEqual({
        currentLevel: 1,
        currentExpInLevel: 0,
        expToNextLevel: 100,
        progressPercentage: 0,
      });
    });

    it("should calculate exact threshold rollovers correctly", () => {
      // 99 EXP -> Level 1 (99 / 100 = 99%)
      const level1Border = calculateLevelData(99);
      expect(level1Border.currentLevel).toBe(1);
      expect(level1Border.currentExpInLevel).toBe(99);
      expect(level1Border.progressPercentage).toBe(99);

      // 100 EXP -> Rollover to Level 2 (0 / 150 = 0%)
      const level2Start = calculateLevelData(100);
      expect(level2Start.currentLevel).toBe(2);
      expect(level2Start.currentExpInLevel).toBe(0);
      expect(level2Start.expToNextLevel).toBe(150);
      expect(level2Start.progressPercentage).toBe(0);

      // 249 EXP -> Level 2 (149 / 150 = 99%)
      const level2Border = calculateLevelData(249);
      expect(level2Border.currentLevel).toBe(2);
      expect(level2Border.currentExpInLevel).toBe(149);
      expect(level2Border.progressPercentage).toBe(99);

      // 250 EXP -> Rollover to Level 3 (0 / 200 = 0%)
      const level3Start = calculateLevelData(250);
      expect(level3Start.currentLevel).toBe(3);
      expect(level3Start.currentExpInLevel).toBe(0);
      expect(level3Start.expToNextLevel).toBe(200);

      // 450 EXP -> Rollover to Level 4 (0 / 250 = 0%)
      const level4Start = calculateLevelData(450);
      expect(level4Start.currentLevel).toBe(4);
      expect(level4Start.currentExpInLevel).toBe(0);
      expect(level4Start.expToNextLevel).toBe(250);
    });

    it("should calculate progressPercentage accurately", () => {
      // 50 EXP out of 100 = 50%
      const halfLevel1 = calculateLevelData(50);
      expect(halfLevel1.progressPercentage).toBe(50);

      // 100 (Level 2) + 75 EXP out of 150 = 50%
      const halfLevel2 = calculateLevelData(175);
      expect(halfLevel2.currentLevel).toBe(2);
      expect(halfLevel2.currentExpInLevel).toBe(75);
      expect(halfLevel2.progressPercentage).toBe(50);
    });

    it("should handle negative EXP safely", () => {
      const result = calculateLevelData(-50);
      expect(result.currentLevel).toBe(1);
      expect(result.currentExpInLevel).toBe(0);
      expect(result.progressPercentage).toBe(0);
    });
  });

  describe("calculatePower", () => {
    const baseStats: CharacterStats = {
      id: "stats-1",
      characterId: "char-1",
      strength: 1,
      knowledge: 1,
      discipline: 1,
      focus: 1,
      endurance: 1,
      recovery: 1,
      consistency: 1,
    };

    it("should calculate baseline power for Level 1 character with base stats (all 1s)", () => {
      // (1 * 50) + (7 stats * 1 * 10) = 50 + 70 = 120
      const power = calculatePower(1, baseStats);
      expect(power).toBe(120);
    });

    it("should handle null or undefined stats safely", () => {
      const powerNull = calculatePower(1, null);
      expect(powerNull).toBe(50);

      const powerUndefined = calculatePower(1, undefined);
      expect(powerUndefined).toBe(50);
    });

    it("should scale power accurately for higher level and stat distributions", () => {
      const highStats: CharacterStats = {
        id: "stats-2",
        characterId: "char-2",
        strength: 20,
        knowledge: 20,
        discipline: 20,
        focus: 20,
        endurance: 20,
        recovery: 20,
        consistency: 20,
      };

      // Formula: (50 * 50) + (140 sum of stats * 10) = 2500 + 1400 = 3900
      const power = calculatePower(50, highStats);
      expect(power).toBe(3900);
    });
  });

  describe("calculateRank", () => {
    it("should return correct rank for exact boundary edges", () => {
      expect(calculateRank(0)).toBe("F");
      expect(calculateRank(499)).toBe("F");

      expect(calculateRank(500)).toBe("E");
      expect(calculateRank(1499)).toBe("E");

      expect(calculateRank(1500)).toBe("D");
      expect(calculateRank(2999)).toBe("D");

      expect(calculateRank(3000)).toBe("C");
      expect(calculateRank(4999)).toBe("C");

      expect(calculateRank(5000)).toBe("B");
      expect(calculateRank(7999)).toBe("B");

      expect(calculateRank(8000)).toBe("A");
      expect(calculateRank(11999)).toBe("A");

      expect(calculateRank(12000)).toBe("S");
      expect(calculateRank(17999)).toBe("S");

      expect(calculateRank(18000)).toBe("SS");
      expect(calculateRank(24999)).toBe("SS");

      expect(calculateRank(25000)).toBe("SSS");
      expect(calculateRank(100000)).toBe("SSS");
    });

    it("should handle negative power values safely by defaulting to Rank F", () => {
      expect(calculateRank(-100)).toBe("F");
    });
  });
});
