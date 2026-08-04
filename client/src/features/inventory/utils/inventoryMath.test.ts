import { describe, it, expect } from "vitest";
import {
  rollRarity,
  generateEquipmentStats,
  calculateTotalCombatStats,
} from "./index";
import { ItemRarity, Equipment } from "../types";

describe("Inventory Engine Utilities", () => {
  const validRarities: ItemRarity[] = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
    "Ancient",
  ];

  describe("Rarity Calculator (rollRarity)", () => {
    it("returns valid rarity strings from the ItemRarity type", () => {
      for (let i = 0; i < 50; i++) {
        const rarity = rollRarity(i * 2);
        expect(validRarities).toContain(rarity);
      }
    });

    it("increases chance of rolling higher rarities with higher luckModifier", () => {
      let highLuckMythicsOrAncients = 0;
      for (let i = 0; i < 100; i++) {
        const rarity = rollRarity(100); // Max luck shift
        if (["Legendary", "Mythic", "Ancient", "Epic"].includes(rarity)) {
          highLuckMythicsOrAncients++;
        }
      }
      expect(highLuckMythicsOrAncients).toBeGreaterThan(0);
    });
  });

  describe("Equipment Generator (generateEquipmentStats)", () => {
    it("scales Legendary Weapon to have significantly higher attack than Common Weapon on same floor", () => {
      const commonWeapon = generateEquipmentStats("Weapon", "Common", 10);
      const legendaryWeapon = generateEquipmentStats("Weapon", "Legendary", 10);

      expect(legendaryWeapon.attack).toBeGreaterThan((commonWeapon.attack || 0) * 3);
      expect(legendaryWeapon.strength).toBeGreaterThan((commonWeapon.strength || 0) * 3);
    });

    it("generates slot-appropriate attributes for Armor vs Weapon", () => {
      const armor = generateEquipmentStats("Armor", "Rare", 5);
      const weapon = generateEquipmentStats("Weapon", "Rare", 5);

      expect(armor.defense).toBeGreaterThan(0);
      expect(armor.hp).toBeGreaterThan(0);
      expect(weapon.attack).toBeGreaterThan(0);
    });
  });

  describe("Combat Stat Calculator (calculateTotalCombatStats)", () => {
    it("accurately sums base stats and equipped item bonuses without mutating original baseStats", () => {
      const baseStats = {
        strength: 10,
        knowledge: 15,
        recovery: 5,
        focus: 8,
        discipline: 12,
        endurance: 20,
      };

      const equipped: Partial<Equipment>[] = [
        { strength: 5, attack: 50 }, // Weapon
        { defense: 30, endurance: 10 }, // Armor
      ];

      const baseStatsCopy = { ...baseStats };

      const total = calculateTotalCombatStats(baseStats, equipped);

      // Check non-mutation of baseStats
      expect(baseStats).toEqual(baseStatsCopy);

      // Check accuracy of calculations
      expect(total.strength).toBe(15); // 10 + 5
      expect(total.endurance).toBe(30); // 20 + 10
      expect(total.attack).toBe(50); // 0 + 50
      expect(total.defense).toBe(30); // 0 + 30
      expect(total.knowledge).toBe(15); // 15 + 0
    });
  });
});
