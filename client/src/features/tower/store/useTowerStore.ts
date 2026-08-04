import { create } from "zustand";
import { Enemy, Floor, FloorStatus, Tower } from "../types";
import { BattleResult } from "../types/combat";
import {
  fetchTowers,
  fetchTowerFloors,
  submitCombatResult,
  CombatEngine,
  calculateFloorRewards,
  FloorRewards,
} from "../services";
import { scaleEnemyForFloor } from "../utils";
import { rollRarity, generateEquipmentStats } from "@/features/inventory/utils";
import { EquipmentSlot } from "@/features/inventory/types";
import { grantItem } from "@/features/inventory/services";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playSuccessfulSound, playFailedSound } from "@/features/audio/useSystemAudio";

export interface ActiveCombatState {
  result: BattleResult;
  enemy: Enemy;
  floor: Floor;
  rewards?: FloorRewards;
  droppedItem?: any | null;
}

export interface TowerStore {
  activeTower: Tower | null;
  floors: Floor[];
  isLoading: boolean;
  activeCombat: ActiveCombatState | null;
  droppedItem: any | null;
  loadTowerData: (characterId?: string) => Promise<void>;
  startCombat: (character: any, floor: Floor) => Promise<void>;
  closeCombat: () => void;
}

const MOCK_CHARACTER_ID = "char-id-123";

export const useTowerStore = create<TowerStore>((set, get) => ({
  activeTower: null,
  floors: [],
  isLoading: false,
  activeCombat: null,
  droppedItem: null,

  loadTowerData: async (characterId?: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const towers = await fetchTowers();
      const activeTower = towers[0] || null;

      if (activeTower) {
        const floors = await fetchTowerFloors(activeTower.id, targetId);
        set({ activeTower, floors, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("[useTowerStore] Error loading tower data:", error);
      set({ isLoading: false });
    }
  },

  startCombat: async (character: any, floor: Floor) => {
    const characterId = character?.id || MOCK_CHARACTER_ID;

    // 1. Get or create base enemy for this floor
    const baseEnemy: Enemy = floor.boss || {
      id: `enemy-guardian-fl${floor.floorNumber}`,
      name: `Floor ${floor.floorNumber} Guardian`,
      type: "Beast",
      rarity: floor.floorNumber % 5 === 0 ? "Boss" : "Elite",
      baseHp: 80 + floor.floorNumber * 20,
      baseAttack: 15 + floor.floorNumber * 4,
      baseDefense: 5 + floor.floorNumber * 2,
      baseSpeed: 10 + floor.floorNumber,
    };

    // 2. Scale enemy stats procedurally for this floor
    const scaledEnemy = scaleEnemyForFloor(baseEnemy, floor.floorNumber);

    // 3. Simulate turn-based battle
    const result = CombatEngine.simulateBattle(character, scaledEnemy);

    let rewards: FloorRewards | undefined;
    let droppedItemRecord: any = null;

    if (result.isVictory) {
      playSuccessfulSound();
      // Calculate gold & EXP rewards
      const consistency = character?.stats?.consistency || 1;
      rewards = calculateFloorRewards(floor.floorNumber, consistency);

      // Determine Loot Drop: 100% on Boss floor, 25% on standard floors
      const isBossFloor =
        floor.floorNumber % 5 === 0 || !!floor.bossId || !!floor.boss;
      const isDrop = isBossFloor || Math.random() < 0.25;

      if (isDrop) {
        const slots: EquipmentSlot[] = [
          "Weapon",
          "Helmet",
          "Armor",
          "Gloves",
          "Boots",
          "Ring",
          "Necklace",
          "Artifact",
          "Relic",
        ];
        const randomSlot = slots[Math.floor(Math.random() * slots.length)];
        const rarity = rollRarity(consistency);
        const equipmentStats = generateEquipmentStats(
          randomSlot,
          rarity,
          floor.floorNumber
        );

        const payload = {
          name: `${rarity} ${randomSlot}`,
          description: `A powerful ${rarity.toLowerCase()} item acquired from Floor ${floor.floorNumber} in the Tower of Ascension.`,
          category: "Equipment",
          rarity: rarity,
          sellPrice: floor.floorNumber * 10,
          buyPrice: floor.floorNumber * 20,
          equipment: equipmentStats,
        };

        droppedItemRecord = await grantItem(characterId, payload);
      }

      // Submit victory to backend to persist CLEARED status and unlock next floor
      await submitCombatResult(floor.id, characterId, {
        isVictory: true,
        totalTurns: result.totalTurns,
      });

      // Grant rewards to Character Store
      useCharacterStore
        .getState()
        .gainExp(rewards.expEarned, `Tower Floor ${floor.floorNumber} Victory`);
      useCharacterStore
        .getState()
        .gainGold(rewards.goldEarned, `Tower Floor ${floor.floorNumber} Loot`);

      // Reload tower floor data to reflect unlocked next floor
      await get().loadTowerData(characterId);
    } else {
      playFailedSound();
      // Log failed attempt to backend
      await submitCombatResult(floor.id, characterId, {
        isVictory: false,
        totalTurns: result.totalTurns,
      });
    }

    set({
      droppedItem: droppedItemRecord,
      activeCombat: {
        result,
        enemy: scaledEnemy,
        floor,
        rewards,
        droppedItem: droppedItemRecord,
      },
    });
  },

  closeCombat: () => {
    set({ activeCombat: null, droppedItem: null });
  },
}));
