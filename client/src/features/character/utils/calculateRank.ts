/**
 * Calculates character rank string based on total power score.
 * Thresholds:
 * - F  : 0 - 499
 * - E  : 500 - 1499
 * - D  : 1500 - 2999
 * - C  : 3000 - 4999
 * - B  : 5000 - 7999
 * - A  : 8000 - 11999
 * - S  : 12000 - 17999
 * - SS : 18000 - 24999
 * - SSS: 25000+
 */
export function calculateRank(power: number): string {
  const safePower = Math.max(0, power);

  if (safePower >= 25000) return "SSS";
  if (safePower >= 18000) return "SS";
  if (safePower >= 12000) return "S";
  if (safePower >= 8000) return "A";
  if (safePower >= 5000) return "B";
  if (safePower >= 3000) return "C";
  if (safePower >= 1500) return "D";
  if (safePower >= 500) return "E";
  return "F";
}
