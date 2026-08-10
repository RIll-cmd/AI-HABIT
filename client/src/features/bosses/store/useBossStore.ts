import { create } from "zustand";

export interface BossPhase {
  id: string;
  name: string;
  maxHp: number;
  orderIndex: number;
}

export interface BossActivity {
  id: string;
  activityType: string;
  referenceId: string | null;
  damageValue: number;
}

export interface BossDamageLog {
  id: string;
  damage: number;
  createdAt: string;
}

export interface Boss {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string;
  maxHp: number;
  currentHp: number;
  deadline: string | null;
  status: "ACTIVE" | "DEFEATED" | "FAILED" | "ARCHIVED";
  createdAt: string;
  phases: BossPhase[];
  activities: BossActivity[];
  damageLogs: BossDamageLog[];
}

export interface CreateBossPayload {
  name: string;
  description?: string;
  category: string;
  difficulty: string;
  deadline?: string;
  activities: { activityType: string; referenceId?: string; damageValue: number }[];
}

interface BossState {
  bosses: Boss[];
  isLoading: boolean;
  error: string | null;
  fetchBosses: (characterId: string) => Promise<void>;
  createBoss: (characterId: string, payload: CreateBossPayload) => Promise<void>;
  fetchBossTrajectory: (characterId: string, bossId: string) => Promise<string | null>;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`;

export const useBossStore = create<BossState>((set) => ({
  bosses: [],
  isLoading: false,
  error: null,

  fetchBosses: async (characterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/bosses/${characterId}`);
      if (!response.ok) throw new Error("Failed to fetch bosses");
      const data = await response.json();
      set({ bosses: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBoss: async (characterId: string, payload: CreateBossPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/bosses/${characterId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create boss");
      const newBoss = await response.json();
      
      set((state) => ({
        bosses: [newBoss, ...state.bosses],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchBossTrajectory: async (characterId: string, bossId: string) => {
    try {
      const response = await fetch(`${API_BASE}/aira/boss-trajectory/${characterId}/${bossId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error("Failed to fetch boss trajectory:", error);
      return null;
    }
  },
}));
