import { create } from "zustand";
import { ShopItem } from "../types/shop";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useDailyBonusStore } from "@/store/useDailyBonusStore";
import { playUISound } from "@/utils/audio";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";

interface ShopStore {
  items: ShopItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  fetchShopItems: (characterId: string) => Promise<void>;
  refreshShopItems: (characterId: string, isFree?: boolean, goldCost?: number) => Promise<boolean>;
  buyItem: (characterId: string, shopItemId: string) => Promise<boolean>;
}

export const useShopStore = create<ShopStore>((set, get) => ({
  items: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  
  fetchShopItems: async (characterId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/api/shop/${characterId}`);
      if (!res.ok) throw new Error("Failed to fetch shop items");
      const data = await res.json();
      set({ items: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  refreshShopItems: async (characterId, isFree = true, goldCost = 100) => {
    set({ isRefreshing: true, error: null });
    playUISound("/sounds/General/10_UI_Menu_SFX/079_Buy_sell_01.wav");

    const effectiveCost = isFree ? 0 : goldCost;
    const charStore = useCharacterStore.getState();
    const curGold = charStore.character?.gold || 0;

    if (!isFree && curGold < effectiveCost) {
      toast.error(`Insufficient Gold! Requires ${effectiveCost} Gold to rotate shop inventory.`);
      set({ isRefreshing: false });
      return false;
    }

    if (isFree) {
      useDailyBonusStore.getState().consumeShopRefresh();
    } else {
      charStore.updateIdentity({ gold: Math.max(0, curGold - effectiveCost) });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/shop/${characterId}/refresh?cost=${effectiveCost}`, {
        method: "POST"
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to rotate shop stock" }));
        throw new Error(err.detail || "Failed to rotate shop stock");
      }
      const data = await res.json();
      set({ items: data, isRefreshing: false });
      if (isFree) {
        toast.success("Shop stock rotated with new items (Free Reroll Used)!");
      } else {
        toast.success(`Shop stock rotated (-${effectiveCost} Gold)!`);
      }
      return true;
    } catch (e: any) {
      toast.error(e.message || "Failed to rotate shop stock.");
      set({ error: e.message, isRefreshing: false });
      return false;
    }
  },
  
  buyItem: async (characterId, shopItemId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/shop/${characterId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_item_id: shopItemId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to purchase item");
      }
      
      const data = await res.json();
      
      // Update local state (optimistic/post-fetch)
      const item = get().items.find(i => i.id === shopItemId);
      if (item) {
        const charStore = useCharacterStore.getState();
        const char = charStore.character;
        if (item.currencyType === "GOLD") {
            charStore.updateIdentity({ gold: Math.max(0, (char?.gold || 0) - item.price) });
        } else if (item.currencyType === "GEMS") {
            charStore.updateIdentity({ gems: Math.max(0, (char?.gems || 0) - item.price) });
        } else if (item.currencyType === "TOWER_TOKENS") {
            charStore.updateIdentity({ towerTokens: Math.max(0, (char?.towerTokens || 0) - item.price) });
        }
        
        // Update stock locally
        if (item.stock !== null) {
            set(state => ({
                items: state.items.map(i => i.id === shopItemId ? { ...i, stock: i.stock! - 1, inStock: i.stock! - 1 > 0 } : i)
            }));
        }
      }
      
      toast.success(data.message || "Purchase successful!");
      
      // Re-fetch to guarantee correct state including new requirements mapping
      get().fetchShopItems(characterId);
      
      // We should also trigger an inventory refresh
      useInventoryStore.getState().fetchInventory(characterId);
      
      return true;
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to purchase item.");
      return false;
    }
  }
}));
