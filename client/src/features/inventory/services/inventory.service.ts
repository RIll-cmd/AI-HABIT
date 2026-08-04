import { API_BASE_URL } from "@/constants";
import { InventoryRecord } from "../types";

/**
 * Fetches all Inventory records for a character from GET /api/inventory/{characterId}
 */
export async function fetchInventory(
  characterId: string
): Promise<InventoryRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/inventory/${characterId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.warn(`[inventory.service] Failed to fetch inventory: ${res.statusText}`);
      return [];
    }

    return (await res.json()) as InventoryRecord[];
  } catch (error) {
    console.error("[inventory.service] Error fetching inventory:", error);
    return [];
  }
}

/**
 * Equips an item for a character via POST /api/inventory/{characterId}/equip/{inventoryId}
 */
export async function equipItem(
  characterId: string,
  inventoryId: string
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/inventory/${characterId}/equip/${inventoryId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.warn(`[inventory.service] Failed to equip item: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[inventory.service] Error equipping item:", error);
    return null;
  }
}

/**
 * Unequips an item for a character via POST /api/inventory/{characterId}/unequip/{inventoryId}
 */
export async function unequipItem(
  characterId: string,
  inventoryId: string
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/inventory/${characterId}/unequip/${inventoryId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      console.warn(`[inventory.service] Failed to unequip item: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("[inventory.service] Error unequipping item:", error);
    return null;
  }
}

/**
 * Grants an item template and inventory record to a character via POST /api/inventory/{characterId}/grant
 */
export async function grantItem(
  characterId: string,
  payload: any
): Promise<InventoryRecord | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/inventory/${characterId}/grant`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.warn(`[inventory.service] Failed to grant item: ${res.statusText}`);
      return null;
    }

    return (await res.json()) as InventoryRecord;
  } catch (error) {
    console.error("[inventory.service] Error granting item:", error);
    return null;
  }
}

