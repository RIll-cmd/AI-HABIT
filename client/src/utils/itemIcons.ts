import itemNames from "../../public/icons/item-names.json";

// The imported JSON has {"Icon1.png": "Iron Shortsword", ...}
// We want to map "Iron Shortsword" -> "/icons/Icon1.png"

const itemNameMap: Record<string, string> = {};

Object.entries(itemNames).forEach(([iconFile, itemName]) => {
  if (typeof itemName === "string") {
    itemNameMap[itemName] = `/icons/${iconFile}`;
  }
});

/**
 * Returns the correct icon path for a given item name.
 * @param name The name of the item (e.g., "Iron Shortsword")
 * @returns The path to the PNG, or a fallback icon if not found.
 */
export function getItemIconPath(name: string): string {
  if (!name) return "/icons/Icon1.png";
  
  const path = itemNameMap[name];
  if (path) {
    return path;
  }

  // Fallback if missing
  return "/icons/Icon1.png";
}
