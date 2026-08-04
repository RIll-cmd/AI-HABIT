/**
 * Determines character Rank based on Power thresholds.
 * Thresholds:
 * - F: 0 - 499
 * - E: 500 - 1499
 * - D: 1500 - 2999
 * - C: 3000 - 5999
 * - B: 6000 - 9999
 * - A: 10000 - 24999
 * - S: 25000 - 49999
 * - SS: 50000 - 99999
 * - SSS: 100000+
 */
export function determineRank(power: number): string {
  const safePower = Math.max(0, power || 0);

  if (safePower >= 100000) return 'SSS';
  if (safePower >= 50000) return 'SS';
  if (safePower >= 25000) return 'S';
  if (safePower >= 10000) return 'A';
  if (safePower >= 6000) return 'B';
  if (safePower >= 3000) return 'C';
  if (safePower >= 1500) return 'D';
  if (safePower >= 500) return 'E';
  return 'F';
}
