import { API_BASE_URL } from "@/constants";

export interface WeeklyExpDataPoint {
  day: string;
  exp: number;
}

/**
 * Fetches weekly EXP analytics from GET /api/analytics/{characterId}/weekly
 */
export async function fetchWeeklyAnalytics(
  characterId: string
): Promise<WeeklyExpDataPoint[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/analytics/${characterId}/weekly`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.warn(
        `[analytics.service] Failed to fetch weekly analytics: ${res.statusText}`
      );
      return [];
    }

    const data = await res.json();
    return data as WeeklyExpDataPoint[];
  } catch (error) {
    console.error("[analytics.service] Error fetching weekly analytics:", error);
    return [];
  }
}
