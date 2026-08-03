import { API_BASE_URL } from "@/constants";
import { Character } from "@/features/character/types/character";

export interface ProgressionSyncPayload {
  total_exp: number;
  level: number;
  power: number;
  rank: string;
  history_entry?: {
    amount: number;
    type: string;
    description: string;
  };
}

/**
 * Fetches character profile from FastAPI backend GET /api/character/{characterId}
 */
export async function fetchCharacterProfile(
  characterId: string
): Promise<Character | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/character/${characterId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn(
        `[character.service] Failed to fetch character profile: ${res.statusText}`
      );
      return null;
    }

    const data = await res.json();
    return data as Character;
  } catch (error) {
    console.error(
      "[character.service] Error fetching character profile:",
      error
    );
    return null;
  }
}

/**
 * Updates character identity fields via PATCH /api/character/{characterId}
 */
export async function patchCharacterIdentity(
  characterId: string,
  data: Partial<Character>
): Promise<Character | null> {
  try {
    const payload = {
      name: data.name,
      title: data.title,
      theme: data.theme,
      avatar: data.avatar,
    };

    const res = await fetch(`${API_BASE_URL}/api/character/${characterId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(
        `[character.service] Failed to patch identity: ${res.statusText}`
      );
      return null;
    }

    const updatedData = await res.json();
    return updatedData as Character;
  } catch (error) {
    console.error("[character.service] Error patching identity:", error);
    return null;
  }
}

/**
 * Syncs character progression stats via POST /api/character/{characterId}/sync-progression
 */
export async function syncCharacterProgression(
  characterId: string,
  syncData: ProgressionSyncPayload
): Promise<Character | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/character/${characterId}/sync-progression`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(syncData),
      }
    );

    if (!res.ok) {
      console.warn(
        `[character.service] Failed to sync progression: ${res.statusText}`
      );
      return null;
    }

    const updatedData = await res.json();
    return updatedData as Character;
  } catch (error) {
    console.error("[character.service] Error syncing progression:", error);
    return null;
  }
}
