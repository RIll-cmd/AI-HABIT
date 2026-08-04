export type CurrencyType = 'GOLD' | 'EXP';

export type RewardType = 'GOLD' | 'EXP' | 'TITLE';

export type LogSource = 'MISSION' | 'ACHIEVEMENT' | 'SHOP' | 'TOWER' | 'ADMIN';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  rewardType: RewardType;
  rewardAmount: number;
  condition: string;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  characterAchievements?: CharacterAchievement[];
}

export interface CharacterAchievement {
  id: string;
  characterId: string;
  achievementId: string;
  unlockedAt: string | Date;
  achievement?: Achievement;
}

export interface EconomyLog {
  id: string;
  characterId: string;
  currency: CurrencyType;
  amount: number;
  reason: string;
  source: LogSource;
  createdAt: string | Date;
}
