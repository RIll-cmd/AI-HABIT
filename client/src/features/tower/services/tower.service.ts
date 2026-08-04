import { API_BASE_URL } from "@/constants";
import { Floor, Tower } from "../types";

export interface CombatResultPayload {
  isVictory: boolean;
  totalTurns: number;
}

/**
 * Fetches all available towers from GET /api/tower
 */
export async function fetchTowers(): Promise<Tower[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tower`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.warn(`[tower.service] Failed to fetch towers: ${res.statusText}`);
      return [];
    }

    return (await res.json()) as Tower[];
  } catch (error) {
    console.error("[tower.service] Error fetching towers:", error);
    return [];
  }
}

/**
 * Fetches all floors for a tower merged with character FloorProgress from GET /api/tower/{towerId}/floors/{characterId}
 */
export async function fetchTowerFloors(
  towerId: string,
  characterId: string
): Promise<Floor[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/tower/${towerId}/floors/${characterId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.warn(`[tower.service] Failed to fetch tower floors: ${res.statusText}`);
      return [];
    }

    return (await res.json()) as Floor[];
  } catch (error) {
    console.error("[tower.service] Error fetching tower floors:", error);
    return [];
  }
}

/**
 * Submits combat outcome for a floor to POST /api/tower/floors/{floorId}/combat/{characterId}
 */
export async function submitCombatResult(
  floorId: string,
  characterId: string,
  payload: CombatResultPayload
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/tower/floors/${floorId}/combat/${characterId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.warn(`[tower.service] Failed to submit combat result: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[tower.service] Error submitting combat result:", error);
    return null;
  }
}
