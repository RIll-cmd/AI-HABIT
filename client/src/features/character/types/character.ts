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
  availableSP: number;
  createdAt: string | Date;
  stats?: CharacterStats | null;
  history?: ProgressHistory[];
}
