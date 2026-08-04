export type EnemyType =
  | 'Beast'
  | 'Undead'
  | 'Machine'
  | 'Spirit'
  | 'Dragon'
  | 'Titan'
  | 'Shadow'
  | 'Human';

export type EnemyRarity = 'Common' | 'Elite' | 'Boss' | 'Mythic';

export type FloorStatus = 'LOCKED' | 'UNLOCKED' | 'CLEARED' | 'PERFECT';

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  rarity: EnemyRarity;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  image?: string | null;
}

export interface Floor {
  id: string;
  towerId: string;
  floorNumber: number;
  recommendedPower: number;
  minStrength: number;
  minKnowledge: number;
  minRecovery: number;
  minDiscipline: number;
  minFocus: number;
  minEndurance: number;
  bossId?: string | null;
  boss?: Enemy | null;
  rewardPool: string;
  tower?: Tower;
  progress?: FloorProgress[];
}

export interface Tower {
  id: string;
  name: string;
  description: string;
  theme: string;
  maxFloor: number;
  createdAt: string | Date;
  floors?: Floor[];
}

export interface FloorProgress {
  id: string;
  characterId: string;
  floorId: string;
  status: FloorStatus;
  attempts: number;
  bestTime?: number | null;
  clearedAt?: string | Date | null;
  floor?: Floor;
}
