export interface FloorRewards {
  goldEarned: number;
  expEarned: number;
  items: any[];
}

/**
 * Calculates gold and EXP rewards earned upon clearing a Tower floor.
 */
export function calculateFloorRewards(
  floorNumber: number,
  consistency: number = 1
): FloorRewards {
  const safeFloor = Math.max(1, floorNumber || 1);
  const safeConsistency = Math.max(0, consistency || 1);

  const goldEarned = Math.floor(safeFloor * 50 + safeConsistency * 2);
  const expEarned = Math.floor(safeFloor * 100 + safeFloor * 1.5);

  return {
    goldEarned,
    expEarned,
    items: [],
  };
}
