export type QuestRank = 'F' | 'D' | 'C' | 'B' | 'A' | 'S';

export type QuestStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface QuestSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface QuestActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface KanbanQuest {
  id: string;
  characterId: string;
  title: string;
  description?: string;
  status: QuestStatus;
  rank: QuestRank;
  category: string;
  tags: string[];
  subtasks: QuestSubtask[];
  progressOverride?: number; // 0 - 100
  dueDate?: string;
  startDate?: string;
  scheduledDate?: string;
  completedDate?: string;
  expReward: number;
  goldReward: number;
  statReward: {
    stat: string;
    amount: number;
  };
  activityLogs: QuestActivityLog[];
  createdAt: string;
}
