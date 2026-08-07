import { API_BASE_URL } from "@/constants";
import { Habit, Mission, HabitDifficulty, ScheduleType, CompletionType, HabitStatus } from "../types";

export interface HabitScheduleCreatePayload {
  daysOfWeek?: string | null;
  timesPerWeek?: number | null;
  timesPerMonth?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  timezone?: string | null;
}

export interface HabitTierCreatePayload {
  tier: CompletionType;
  targetType?: string | null;
  targetValue?: number | null;
  targetUnit?: string | null;
  baseExp: number;
  baseGold: number;
  statReward: number;
}

export interface HabitCreatePayload {
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  category: string;
  difficulty: HabitDifficulty;
  primaryStat: string;
  scheduleType: ScheduleType;
  preferredTime?: string | null;
  schedule?: HabitScheduleCreatePayload | null;
  tiers: HabitTierCreatePayload[];
}

export interface MissionCompletePayload {
  completionType: CompletionType;
  expEarned?: number;
  statsEarned?: number;
}

/**
 * Creates a new Habit template for a character
 */
export async function createHabit(
  characterId: string,
  payload: HabitCreatePayload
): Promise<Habit | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/habits/${characterId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[habit.service] Failed to create habit (HTTP ${res.status} ${res.statusText}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as Habit;
  } catch (error) {
    console.error("[habit.service] Error creating habit:", error);
    return null;
  }
}

/**
 * Fetches all habit templates for a character
 */
export async function fetchHabits(characterId: string): Promise<Habit[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/habits/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[habit.service] Failed to fetch habits (HTTP ${res.status} ${res.statusText}):`,
        errorText
      );
      return [];
    }

    const data = await res.json();
    return data as Habit[];
  } catch (error) {
    console.error("[habit.service] Error fetching habits:", error);
    return [];
  }
}

/**
 * Triggers the backend mission generator for the given character.
 */
export async function generateTodayMissions(characterId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/habits/${characterId}/generate-missions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error(`[habit.service] Failed to generate missions (HTTP ${res.status} ${res.statusText})`);
    }
  } catch (error) {
    console.error("[habit.service] Error generating today's missions:", error);
  }
}

/**
 * Fetches today's missions for a character
 */
export async function fetchTodayMissions(characterId: string): Promise<Mission[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/missions/today/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[habit.service] Failed to fetch today's missions (HTTP ${res.status} ${res.statusText}):`,
        errorText
      );
      return [];
    }

    const data = await res.json();
    return data as Mission[];
  } catch (error) {
    console.error("[habit.service] Error fetching today's missions:", error);
    return [];
  }
}

/**
 * Completes a mission instance with completion tier and rewards
 */
export async function completeMission(
  missionId: string,
  payload: MissionCompletePayload
): Promise<Mission | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/missions/${missionId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[habit.service] Failed to complete mission (HTTP ${res.status} ${res.statusText}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as Mission;
  } catch (error) {
    console.error("[habit.service] Error completing mission:", error);
    return null;
  }
}

/**
 * Updates the status of a habit (Pause, Archive, Delete, Active)
 */
export async function updateHabitStatus(
  habitId: string,
  status: HabitStatus
): Promise<Habit | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/habits/${habitId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[habit.service] Failed to update habit status (HTTP ${res.status} ${res.statusText}):`,
        errorText
      );
      return null;
    }

    const data = await res.json();
    return data as Habit;
  } catch (error) {
    console.error("[habit.service] Error updating habit status:", error);
    return null;
  }
}
