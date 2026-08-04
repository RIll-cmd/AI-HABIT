import { API_BASE_URL } from "@/constants";
import { Habit, Mission, HabitDifficulty, ScheduleType, CompletionType } from "../types";

export interface HabitCreatePayload {
  name: string;
  description?: string | null;
  category: string;
  difficulty: HabitDifficulty;
  primaryStat: string;
  scheduleType: ScheduleType;
  scheduleDays?: string | null;
  icon?: string | null;
  color?: string | null;
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
 * Fetches or generates today's missions for a character
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
