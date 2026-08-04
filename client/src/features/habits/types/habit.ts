export type HabitDifficulty = 'Easy' | 'Medium' | 'Hard';

export type PrimaryStat =
  | 'strength'
  | 'knowledge'
  | 'discipline'
  | 'focus'
  | 'endurance'
  | 'recovery'
  | 'consistency';

export type ScheduleType =
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Specific_Days'
  | 'Custom';

export type MissionStatus = 'PENDING' | 'COMPLETED' | 'MISSED';

export type CompletionType = 'MINI' | 'NORMAL' | 'ELITE';

export interface HabitSchedule {
  id: string;
  habitId: string;
  type: ScheduleType;
  days?: string | null;
  interval: number;
  startDate: string | Date;
  endDate?: string | Date | null;
}

export interface HabitMetrics {
  id: string;
  habitId: string;
  habitStrength: number;
  successRate: number;
  completionRate: number;
  currentConsistency: number;
}

export interface Habit {
  id: string;
  characterId: string;
  name: string;
  description?: string | null;
  category: string;
  difficulty: HabitDifficulty;
  primaryStat: PrimaryStat | string;
  isActive: boolean;
  icon?: string | null;
  color?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  schedule?: HabitSchedule | null;
  metrics?: HabitMetrics | null;
  missions?: Mission[];
}

export interface Mission {
  id: string;
  habitId?: string | null;
  characterId: string;
  date: string | Date;
  status: MissionStatus;
  completionType?: CompletionType | null;
  expEarned?: number | null;
  statsEarned?: number | null;
  completedAt?: string | Date | null;
  habit?: Habit | null;
}
