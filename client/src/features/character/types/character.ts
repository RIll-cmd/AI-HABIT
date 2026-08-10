export interface CharacterStats {
  id: string;
  characterId: string;
  strength: number;
  knowledge: number;
  discipline: number;
  focus: number;
  endurance: number;
  recovery: number;
  consistency: number;
}

export interface ProgressHistory {
  id: string;
  characterId: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string | Date;
}

export interface ClassSpecialization {
  id: string;
  name: string;
  baseClass: string;
  tier: number;
  requiredLevel: number;
  description?: string | null;
  icon?: string | null;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  avatar?: string | null;
  theme?: string | null;
  title?: string | null;
  level: number;
  exp: number;
  power: number;
  rank: string;
  gold: number;
  gems?: number;
  towerTokens?: number;
  availableSP: number;
  streakFreezes?: number;
  activeTitleId?: string | null;
  specializationId?: string | null;
  specialization?: ClassSpecialization | null;
  createdAt: string | Date;
  stats?: CharacterStats | null;
  history?: ProgressHistory[];
  activeBuffs?: {
    id: string;
    buffType: string;
    multiplier: number;
    expiresAt: string;
    chargesRemaining?: number;
  }[];
}
