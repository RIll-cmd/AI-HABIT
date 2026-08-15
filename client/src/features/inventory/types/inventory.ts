export type ItemType =
  | "WEAPON"
  | "HELMET"
  | "ARMOR"
  | "GLOVES"
  | "BOOTS"
  | "RING"
  | "NECKLACE"
  | "ARTIFACT"
  | "RELIC"
  | "CONSUMABLE"
  | "MATERIAL"
  | "QUEST_ITEM";

export type ItemRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";

export interface ItemDefinition {
  id: string;
  name: string;
  description: string | null;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
  sellValue: number;
  attack: number;
  defense: number;
  strength: number;
  knowledge: number;
  discipline: number;
  focus: number;
  endurance: number;
  recovery: number;
  passive: string | null;
  lore?: string | null;
}

export interface PlayerItem {
  id: string;
  characterId: string;
  itemDefinitionId: string;
  quantity: number;
  isEquipped: boolean;
  isLocked: boolean;
  isFavorite: boolean;
  acquiredFrom: string | null;
  itemDefinition: ItemDefinition;
}
