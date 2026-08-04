import { describe, it, expect } from "vitest";
import {
  validateFloorAccess,
  scaleEnemyForFloor,
  calculateTurnDamage,
} from "./index";
import { Enemy, Floor } from "../types";

describe("Tower Engine Utilities", () => {
  const mockFloor: Floor = {
    id: "floor-10",
    towerId: "tower-1",
    floorNumber: 10,
    recommendedPower: 1500,
    minStrength: 120,
    minKnowledge: 85,
    minRecovery: 60,
    minDiscipline: 50,
    minFocus: 40,
    minEndurance: 50,
    rewardPool: "{}",
  };

  describe("Floor Validator (validateFloorAccess)", () => {
    it("denies access to underpowered character and lists exact requirement", () => {
      const char = {
        power: 1000,
        stats: {
          strength: 120,
          knowledge: 85,
          recovery: 60,
          discipline: 50,
          focus: 40,
          endurance: 50,
        },
      };

      const result = validateFloorAccess(char, mockFloor);
      expect(result.canEnter).toBe(false);
      expect(result.missingRequirements).toContain(
        "Power score of 1500 required (Current: 1000)"
      );
    });

    it("denies access when stat requirements are not met with exact message format", () => {
      const char = {
        power: 2000,
        stats: {
          strength: 104,
          knowledge: 85,
          recovery: 60,
          discipline: 50,
          focus: 40,
          endurance: 50,
        },
      };

      const result = validateFloorAccess(char, mockFloor);
      expect(result.canEnter).toBe(false);
      expect(result.missingRequirements).toContain(
        "Strength 120 required (Current: 104)"
      );
    });

    it("allows entry when character meets all power and stat thresholds", () => {
      const char = {
        power: 2000,
        stats: {
          strength: 150,
          knowledge: 100,
          recovery: 70,
          discipline: 60,
          focus: 50,
          endurance: 60,
        },
      };

      const result = validateFloorAccess(char, mockFloor);
      expect(result.canEnter).toBe(true);
      expect(result.missingRequirements.length).toBe(0);
    });
  });

  describe("Enemy Scaler (scaleEnemyForFloor)", () => {
    const baseEnemy: Enemy = {
      id: "enemy-golem",
      name: "Stone Golem",
      type: "Titan",
      rarity: "Elite",
      baseHp: 100,
      baseAttack: 20,
      baseDefense: 10,
      baseSpeed: 10,
    };

    it("returns unmodified base stats for Floor 1", () => {
      const scaled = scaleEnemyForFloor(baseEnemy, 1);
      expect(scaled.baseHp).toBe(100);
      expect(scaled.baseAttack).toBe(20);
      expect(scaled.baseDefense).toBe(10);
      expect(scaled.baseSpeed).toBe(10);
    });

    it("accurately scales enemy stats for Floor 50", () => {
      const scaled = scaleEnemyForFloor(baseEnemy, 50);
      // HP: 100 * (1 + 49 * 0.25) = 1325
      expect(scaled.baseHp).toBe(1325);
      // Attack: 20 * (1 + 49 * 0.15) = 167
      expect(scaled.baseAttack).toBe(167);
      // Defense: 10 * (1 + 49 * 0.10) = 59
      expect(scaled.baseDefense).toBe(59);
      // Speed: 10 * (1 + 49 * 0.05) = 34
      expect(scaled.baseSpeed).toBe(34);
    });
  });

  describe("Damage Formula (calculateTurnDamage)", () => {
    it("bypasses defender armor based on attacker Knowledge", () => {
      const attacker = { attack: 100, knowledge: 250 }; // 50% armor pen
      const defender = { baseDefense: 100, discipline: 0 }; // 100 defense becomes 50

      const result = calculateTurnDamage(attacker, defender);
      expect(result.armorPenetrated).toBe(true);
      // 100 attack - 50 effective defense = 50 damage
      expect(result.totalDamage).toBe(50);
    });

    it("applies critical hit 1.5x multiplier when focus triggers crit", () => {
      const attacker = { attack: 100, knowledge: 500, focus: 200, forceCritical: true }; // 100% armor pen, forced crit
      const defender = { baseDefense: 50, discipline: 0 };

      const result = calculateTurnDamage(attacker, defender);
      expect(result.isCritical).toBe(true);
      // 100 attack - 0 defense = 100 raw * 1.5 crit = 150 damage
      expect(result.totalDamage).toBe(150);
    });

    it("mitigates incoming damage based on defender Discipline", () => {
      const attacker = { attack: 100, knowledge: 500, forceCritical: false }; // 100 raw damage
      const defender = { baseDefense: 0, discipline: 300 }; // 50% discipline mitigation

      const result = calculateTurnDamage(attacker, defender);
      // 100 raw damage * (1 - 300/600) = 50 damage
      expect(result.totalDamage).toBe(50);
    });
  });
});
