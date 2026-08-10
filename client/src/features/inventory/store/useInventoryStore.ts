import { create } from "zustand";
import { PlayerItem } from "../types/inventory";
import { useCharacterStore } from "@/store/useCharacterStore";
import { calculateTotalCombatStats } from "@/features/inventory/utils/combatStatCalculator";
import { calculateDynamicPower } from "@/features/progression/utils";

interface InventoryState {
  items: PlayerItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchInventory: (characterId: string) => Promise<void>;
  equipItem: (playerItemId: string) => Promise<void>;
  toggleLock: (playerItemId: string) => Promise<void>;
  toggleFavorite: (playerItemId: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchInventory: async (characterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/inventory/${characterId}`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data: PlayerItem[] = await res.json();
      set({ items: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  equipItem: async (playerItemId: string) => {
    // Optimistic Update (we can apply it after the response to ensure proper auto-unequip)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/inventory/${playerItemId}/equip`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to equip item");
      const data = await res.json();
      
      const updatedItem: PlayerItem = data.playerItem;
      const { items } = get();
      
      // We need to unequip any existing item in the same slot
      const updatedItems = items.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        // Auto-unequip logic client-side mirror
        if (
          updatedItem.isEquipped &&
          item.isEquipped &&
          item.itemDefinition.type === updatedItem.itemDefinition.type
        ) {
          return { ...item, isEquipped: false };
        }
        return item;
      });
      
      set({ items: updatedItems });

      // Power recalculation and backend sync
      const character = useCharacterStore.getState().character;
      if (character) {
        const baseStats = character.stats || {};
        const equippedItems = updatedItems.filter(i => i.isEquipped);
        
        const numBaseStats = Object.keys(baseStats).reduce((acc, key) => {
           const val = (baseStats as any)[key];
           if (typeof val === 'number') {
               acc[key] = val;
           }
           return acc;
        }, {} as Record<string, number>);

        const finalStats = calculateTotalCombatStats(numBaseStats, equippedItems);
        const newPower = calculateDynamicPower(character.level, finalStats);
        
        // This triggers a PATCH to /api/character/{id} in the background
        useCharacterStore.getState().updateIdentity({ power: newPower });
      }

    } catch (err: any) {
      console.error(err);
    }
  },

  toggleLock: async (playerItemId: string) => {
    // Optimistic
    const { items } = get();
    set({
      items: items.map((item) =>
        item.id === playerItemId ? { ...item, isLocked: !item.isLocked } : item
      ),
    });
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/inventory/${playerItemId}/toggle-lock`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to toggle lock");
    } catch (err) {
      // Revert on error
      set({ items });
      console.error(err);
    }
  },

  toggleFavorite: async (playerItemId: string) => {
    // Optimistic
    const { items } = get();
    set({
      items: items.map((item) =>
        item.id === playerItemId ? { ...item, isFavorite: !item.isFavorite } : item
      ),
    });
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/inventory/${playerItemId}/toggle-favorite`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to toggle favorite");
    } catch (err) {
      // Revert on error
      set({ items });
      console.error(err);
    }
  },
}));
