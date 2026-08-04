export type ItemCategory = "Equipment" | "Consumable" | "Material" | "Relic";

export type ItemRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Mythic"
  | "Ancient";

export type EquipmentSlot =
  | "Weapon"
  | "Helmet"
  | "Armor"
  | "Gloves"
  | "Boots"
  | "Ring"
  | "Necklace"
  | "Artifact"
  | "Relic";

export interface Equipment {
  id: string;
  itemId: string;
  slot: EquipmentSlot;
  strength: number;
  knowledge: number;
  recovery: number;
  focus: number;
  discipline: number;
  endurance: number;
  attack: number;
  defense: number;
  hp: number;
  setName?: string | null;
}

export interface Consumable {
  id: string;
  itemId: string;
  effect: string;
  duration?: number | null;
  cooldown?: number | null;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  lore?: string | null;
  category: ItemCategory;
  rarity: ItemRarity;
  icon?: string | null;
  sellPrice: number;
  buyPrice: number;
  maxStack: number;
  levelRequirement: number;
  createdAt?: string | Date;
  equipment?: Equipment | null;
  consumable?: Consumable | null;
}

export interface InventoryRecord {
  id: string;
  characterId: string;
  itemId: string;
  item: Item;
  quantity: number;
  isEquipped: boolean;
  obtainedAt?: string | Date;
}
