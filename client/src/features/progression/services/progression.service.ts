import { API_BASE_URL } from "@/constants";
import { Achievement, EconomyLog } from "../types";

export interface LogGoldPayload {
  amount: number;
  reason: string;
  source: string;
}

/**
 * Logs a gold transaction to POST /api/progression/{characterId}/gold
 */
export async function logGoldTransaction(
  characterId: string,
  payload: LogGoldPayload
): Promise<EconomyLog | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/progression/${characterId}/gold`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.warn(`[progression.service] Gold transaction failed: ${res.statusText}`);
      return null;
    }

    return (await res.json()) as EconomyLog;
  } catch (error) {
    console.error("[progression.service] Error logging gold transaction:", error);
    return null;
  }
}

/**
 * Fetches economy history log from GET /api/progression/{characterId}/history
 */
export async function fetchEconomyHistory(
  characterId: string
): Promise<EconomyLog[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/progression/${characterId}/history`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.warn(`[progression.service] Failed to fetch economy history: ${res.statusText}`);
      return [];
    }

    return (await res.json()) as EconomyLog[];
  } catch (error) {
    console.error("[progression.service] Error fetching economy history:", error);
    return [];
  }
}

/**
 * Fetches all achievement templates from GET /api/achievements
 */
export async function fetchAllAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/achievements`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.warn(`[progression.service] Failed to fetch achievements: ${res.statusText}`);
      return [];
    }

    return (await res.json()) as Achievement[];
  } catch (error) {
    console.error("[progression.service] Error fetching achievements:", error);
    return [];
  }
}

/**
 * Unlocks an achievement for character via POST /api/achievements/{characterId}/{achievementId}
 */
export async function unlockAchievement(
  characterId: string,
  achievementId: string
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/achievements/${characterId}/${achievementId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.warn(`[progression.service] Failed to unlock achievement: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[progression.service] Error unlocking achievement:", error);
    return null;
  }
}
