import { describe, it, expect } from "vitest";
import { CombatEngine } from "./CombatEngine";
import { Enemy } from "../types";

describe("CombatEngine Service", () => {
  const weakEnemy: Enemy = {
    id: "goblin-1",
    name: "Lesser Goblin",
    type: "Beast",
    rarity: "Common",
    baseHp: 50,
    baseAttack: 5,
    baseDefense: 2,
    baseSpeed: 5,
  };

  const bossEnemy: Enemy = {
    id: "boss-dragon",
    name: "Infernal Dragon",
    type: "Dragon",
    rarity: "Boss",
    baseHp: 5000,
    baseAttack: 300,
    baseDefense: 150,
    baseSpeed: 100,
  };

  it("results in victory for an overpowered character against weak enemy", () => {
    const opCharacter = {
      level: 20,
      power: 5000,
      stats: {
        strength: 50,
        knowledge: 50,
        discipline: 30,
        focus: 40,
        endurance: 40,
        recovery: 30,
        consistency: 20,
      },
    };

    const result = CombatEngine.simulateBattle(opCharacter, weakEnemy);

    expect(result.isVictory).toBe(true);
    expect(result.remainingHp).toBeGreaterThan(0);
    expect(result.logs.length).toBeGreaterThan(1);
    expect(result.logs[result.logs.length - 1]).toContain("Victory!");
  });

  it("results in defeat for a weak character against an elite boss enemy", () => {
    const weakCharacter = {
      level: 1,
      power: 50,
      stats: {
        strength: 1,
        knowledge: 1,
        discipline: 1,
        focus: 1,
        endurance: 1,
        recovery: 1,
        consistency: 1,
      },
    };

    const result = CombatEngine.simulateBattle(weakCharacter, bossEnemy);

    expect(result.isVictory).toBe(false);
    expect(result.remainingHp).toBe(0);
    expect(result.logs[result.logs.length - 1]).toContain("Defeat...");
  });

  it("populates turn-by-turn logs cleanly with damage and combat details", () => {
    const char = {
      level: 5,
      power: 500,
      stats: {
        strength: 10,
        knowledge: 10,
        discipline: 10,
        focus: 10,
        endurance: 10,
        recovery: 10,
        consistency: 10,
      },
    };

    const result = CombatEngine.simulateBattle(char, weakEnemy);

    expect(result.logs[0]).toContain("Battle Initiated!");
    expect(result.logs.some((log) => log.includes("You strike Lesser Goblin"))).toBe(true);
    expect(result.totalTurns).toBeGreaterThan(0);
  });
});
