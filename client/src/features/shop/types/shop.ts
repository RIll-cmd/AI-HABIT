export interface ShopItem {
  id: string;
  itemId: string;
  currencyType: "GOLD" | "GEMS" | "TOWER_TOKENS";
  price: number;
  stock: number | null;
  requiredLevel: number | null;
  requiredPower: number | null;
  
  // Joined fields
  name: string;
  description: string | null;
  type: string;
  rarity: string;
  icon: string;
  
  // Optional stat bonuses
  attack?: number;
  defense?: number;
  strength?: number;
  knowledge?: number;
  endurance?: number;
  recovery?: number;
  focus?: number;
  discipline?: number;
  consistency?: number;
  sellValue?: number;

  // Computed fields
  canAfford: boolean;
  meetsRequirements: boolean;
  inStock: boolean;
}
