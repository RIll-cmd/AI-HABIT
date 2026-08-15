export type BeastRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "HOLOGRAPHIC";
export type BeastElement = "FIRE" | "FROST" | "VOID" | "CYBER" | "NATURE" | "HOLY" | "STORM";
export type EggStatus = "INCUBATING" | "READY_TO_HATCH" | "HATCHED";

export interface Egg {
  id: string;
  name: string;
  eggType?: string;
  sprite: string;
  rarity: BeastRarity;
  targetSteps: number;
  currentSteps: number;
  targetEnergy?: number;
  currentEnergy?: number;
  target_steps?: number;
  current_steps?: number;
  status: EggStatus;
  characterId: string;
  user_id?: string;
  hatchedBeastId?: string | null;
  hatchedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Beast {
  id: string;
  name: string;
  species: string;
  element: BeastElement;
  rarity: BeastRarity;
  spritePath: string;
  sprite_path?: string;
  passiveBuffType: string;
  passiveBuffValue: number;
  passive_buff_type?: string;
  passive_buff_value?: number;
  statBonusType?: string;
  statBonusValue?: number;
  description?: string | null;
  lore?: string | null;
  level?: number;
  accumulatedSteps?: number;
  stepUpgradeReq?: number;
  goldUpgradeReq?: number;
  isEquipped: boolean;
  is_equipped?: boolean;
  characterId: string;
  user_id?: string;
  unlockedAt: string;
}

export interface BestiarySpeciesSummary {
  speciesId: number;
  name: string;
  species: string;
  element: BeastElement;
  rarity: BeastRarity;
  spritePath: string;
  statBonusType: string;
  statBonusValue: number;
  description: string;
  lore: string;
  level?: number;
  accumulatedSteps?: number;
  stepUpgradeReq?: number;
  goldUpgradeReq?: number;
  isUnlocked: boolean;
  unlockedCount: number;
  beastInstanceId?: string | null;
  isEquipped: boolean;
}

export interface BeastCollectionData {
  characterId: string;
  user_id?: string;
  dailySteps?: number;
  dailyStepGoal?: number;
  activeEgg: Egg | null;
  ownedEggs: Egg[];
  unlockedBeasts: Beast[];
  equippedBeast: Beast | null;
  totalDiscovered: number;
  totalSpecies: number;
  bestiary: BestiarySpeciesSummary[];
  passiveBuffs: Record<string, number>;
}

export interface EggShopItem {
  id: string;
  name: string;
  eggType: string;
  sprite: string;
  rarity: BeastRarity;
  targetSteps: number;
  targetEnergy?: number;
  goldPrice: number;
  gemPrice: number;
  description: string;
}

export interface StepSyncResult {
  characterId: string;
  stepsAdded: number;
  currentSteps: number;
  targetSteps: number;
  dailySteps?: number;
  dailyStepGoal?: number;
  isReadyToHatch: boolean;
  status: string;
  progressPercent: number;
  egg?: Egg | null;
  message?: string;
}
