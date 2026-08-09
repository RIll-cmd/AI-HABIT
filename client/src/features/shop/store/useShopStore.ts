import { create } from "zustand";
import { ShopItem } from "../types/shop";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { toast } from "sonner";

interface ShopStore {
  items: ShopItem[];
  isLoading: boolean;
  error: string | null;
  fetchShopItems: (characterId: string) => Promise<void>;
  buyItem: (characterId: string, shopItemId: string) => Promise<boolean>;
}

export const useShopStore = create<ShopStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchShopItems: async (characterId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`http://localhost:8000/api/shop/${characterId}`);
      if (!res.ok) throw new Error("Failed to fetch shop items");
      const data = await res.json();
      set({ items: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
  
  buyItem: async (characterId, shopItemId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/shop/${characterId}/buy`, {
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
