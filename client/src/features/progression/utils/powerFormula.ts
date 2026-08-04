/**
 * Calculates dynamic character power based on level and weighted character stats.
 * Stat Weights:
 * - Strength: 8
 * - Knowledge: 8
 * - Focus: 7
 * - Endurance: 7
 * - Recovery: 6
 * - Discipline: 6
 * - Consistency: 5
 * Missing stats default to 1.
 */
export function calculateDynamicPower(
  level: number,
  stats: Record<string, number> = {}
): number {
  const getStat = (key: string): number => {
    const lowerKey = key.toLowerCase();
    for (const k of Object.keys(stats || {})) {
      if (k.toLowerCase() === lowerKey) {
        const val = stats[k];
        return typeof val === 'number' && !isNaN(val) ? val : 1;
      }
    }
    return 1;
  };

  const safeLevel = Math.max(1, level || 1);
  const strength = getStat('strength');
  const knowledge = getStat('knowledge');
  const recovery = getStat('recovery');
  const focus = getStat('focus');
  const endurance = getStat('endurance');
  const discipline = getStat('discipline');
  const consistency = getStat('consistency');

  return (
    safeLevel * 50 +
    strength * 8 +
    knowledge * 8 +
    recovery * 6 +
    focus * 7 +
    endurance * 7 +
    discipline * 6 +
    consistency * 5
  );
}
