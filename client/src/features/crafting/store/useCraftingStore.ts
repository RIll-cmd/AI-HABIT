import { create } from "zustand";
import { CraftingRecipe, CraftResponse } from "../types/crafting";
import { API_BASE_URL } from "@/constants";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";

interface CraftingState {
  recipes: CraftingRecipe[];
  isLoading: boolean;
  isCrafting: boolean;
  error: string | null;
  lastCraftedResult: CraftResponse | null;

  fetchRecipes: (characterId: string) => Promise<void>;
  craftRecipe: (characterId: string, recipeId: string) => Promise<boolean>;
  clearLastCrafted: () => void;
}

export const useCraftingStore = create<CraftingState>((set, get) => ({
  recipes: [],
  isLoading: false,
  isCrafting: false,
  error: null,
  lastCraftedResult: null,

  fetchRecipes: async (characterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/crafting/recipes/${characterId}`);
      if (!res.ok) throw new Error("Failed to load crafting recipes");
      const data: CraftingRecipe[] = await res.json();
      set({ recipes: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  craftRecipe: async (characterId: string, recipeId: string) => {
    set({ isCrafting: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/crafting/craft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_id: characterId, recipe_id: recipeId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Crafting failed.");
      }

      const data: CraftResponse = await res.json();
      set({ lastCraftedResult: data, isCrafting: false });

      // Refresh inventory, recipes, and character stats immediately
      await Promise.all([
        get().fetchRecipes(characterId),
        useInventoryStore.getState().fetchInventory(characterId),
        useCharacterStore.getState().loadCharacter(characterId),
      ]);

      return true;
    } catch (err: any) {
      set({ error: err.message, isCrafting: false });
      return false;
    }
  },

  clearLastCrafted: () => {
    set({ lastCraftedResult: null });
  },
}));
