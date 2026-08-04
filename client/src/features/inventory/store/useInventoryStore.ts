import { create } from "zustand";
import { InventoryRecord } from "../types";
import { fetchInventory, equipItem, unequipItem } from "../services";

export interface InventoryStore {
  inventory: InventoryRecord[];
  isLoading: boolean;
  loadInventory: (characterId?: string) => Promise<void>;
  equip: (characterId: string, inventoryId: string) => Promise<void>;
  unequip: (characterId: string, inventoryId: string) => Promise<void>;
}

const MOCK_CHARACTER_ID = "char-id-123";

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  isLoading: false,

  loadInventory: async (characterId?: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const records = await fetchInventory(targetId);
      set({ inventory: records, isLoading: false });
    } catch (error) {
      console.error("[useInventoryStore] Error loading inventory:", error);
      set({ isLoading: false });
    }
  },

  equip: async (characterId: string, inventoryId: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    try {
      await equipItem(targetId, inventoryId);
      await get().loadInventory(targetId);
    } catch (error) {
      console.error("[useInventoryStore] Error equipping item:", error);
    }
  },

  unequip: async (characterId: string, inventoryId: string) => {
    const targetId = characterId || MOCK_CHARACTER_ID;
    try {
      await unequipItem(targetId, inventoryId);
      await get().loadInventory(targetId);
    } catch (error) {
      console.error("[useInventoryStore] Error unequipping item:", error);
    }
  },
}));
