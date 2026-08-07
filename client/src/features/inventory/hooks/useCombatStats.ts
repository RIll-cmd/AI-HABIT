import { useMemo } from 'react';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useInventoryStore } from '@/features/inventory/store/useInventoryStore';
import { calculateTotalCombatStats } from '@/features/inventory/utils/combatStatCalculator';
import { useSkillStore } from '@/features/skills/store/useSkillStore';

export function useCombatStats() {
  const character = useCharacterStore((state) => state.character);
  const items = useInventoryStore((state) => state.items);
  const playerSkills = useSkillStore((state) => state.playerSkills);

  const finalStats = useMemo(() => {
    const baseStats = character?.stats || {};
    const equippedItems = items.filter((i) => i.isEquipped);
    
    // Explicitly cast to Record<string, number> since the stats object includes id and characterId strings
    const numBaseStats = Object.keys(baseStats).reduce((acc, key) => {
       const val = (baseStats as any)[key];
       if (typeof val === 'number') {
           acc[key] = val;
       }
       return acc;
    }, {} as Record<string, number>);

    return calculateTotalCombatStats(numBaseStats, equippedItems, playerSkills);
  }, [character?.stats, items, playerSkills]);

  return finalStats;
}
