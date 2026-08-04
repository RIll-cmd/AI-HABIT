import { API_BASE_URL } from "@/constants";
import { AIRAChatResponse, AIRADefeatResponse, AIRADailyReportResponse } from "../types";

/**
 * Sends a chat prompt to AIRA via POST /api/aira/chat
 */
export async function sendAiraChat(
  prompt: string,
  characterId: string = "char-id-123"
): Promise<AIRAChatResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/aira/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, characterId }),
    });

    if (!res.ok) {
      console.warn(`[aira.service] Failed to send chat: ${res.statusText}`);
      return null;
    }

    return (await res.json()) as AIRAChatResponse;
  } catch (error) {
    console.error("[aira.service] Error sending chat to AIRA:", error);
    return null;
  }
}

/**
 * Sends battle logs to AIRA for defeat diagnosis via POST /api/aira/diagnose-defeat
 */
export async function diagnoseTowerDefeat(
  battleLogs: string[],
  characterId: string = "char-id-123",
  floorNumber: number = 1
): Promise<AIRADefeatResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/aira/diagnose-defeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ battleLogs, characterId, floorNumber }),
    });

    if (!res.ok) {
      console.warn(`[aira.service] Failed to diagnose defeat: ${res.statusText}`);
      return null;
    }

    return (await res.json()) as AIRADefeatResponse;
  } catch (error) {
    console.error("[aira.service] Error diagnosing defeat:", error);
    return null;
  }
}

/**
 * Fetches AIRA's morning briefing report via GET /api/aira/daily-report/{character_id}
 */
export async function fetchDailyReport(
  characterId: string
): Promise<AIRADailyReportResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/aira/daily-report/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.warn(`[aira.service] Failed to fetch daily report: ${res.statusText}`);
      return null;
    }

    return (await res.json()) as AIRADailyReportResponse;
  } catch (error) {
    console.error("[aira.service] Error fetching daily report:", error);
    return null;
  }
}
