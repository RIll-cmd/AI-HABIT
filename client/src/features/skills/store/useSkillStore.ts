import { create } from 'zustand';
import { SkillDefinition, PlayerSkill, SkillUnlockResponse } from '../types';
import { useCharacterStore } from '@/store/useCharacterStore';
import { toast } from 'sonner';
import { useInventoryStore } from '@/features/inventory/store/useInventoryStore';
import { calculateTotalCombatStats } from '@/features/inventory/utils/combatStatCalculator';
import { calculateDynamicPower } from '@/features/progression/utils';

interface SkillState {
  definitions: SkillDefinition[];
  playerSkills: PlayerSkill[];
  availableSP: number;
  loading: boolean;
  error: string | null;
  
  fetchSkills: (characterId: string) => Promise<void>;
  unlockSkill: (characterId: string, skillDefinitionId: string) => Promise<void>;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`;

export const useSkillStore = create<SkillState>((set, get) => ({
  definitions: [],
  playerSkills: [],
  availableSP: 0,
  loading: false,
  error: null,

  fetchSkills: async (characterId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/skills/${characterId}`);
      if (!response.ok) throw new Error('Failed to fetch skills');
      
      const data = await response.json();
      
      // Also get availableSP from the character store
      const charStore = useCharacterStore.getState();
      const availableSP = charStore.character?.availableSP || 0;

      set({ 
        definitions: data.definitions,
        playerSkills: data.playerSkills,
        availableSP: availableSP,
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  unlockSkill: async (characterId: string, skillDefinitionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/skills/${characterId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skillDefinitionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to unlock skill');
      }

      const data: SkillUnlockResponse = await response.json();
      
      set((state) => {
        const existingIndex = state.playerSkills.findIndex(ps => ps.skillDefinitionId === skillDefinitionId);
        let newPlayerSkills = [...state.playerSkills];
        
        if (existingIndex >= 0) {
          newPlayerSkills[existingIndex] = data.playerSkill;
        } else {
          newPlayerSkills.push(data.playerSkill);
        }

        return {
          playerSkills: newPlayerSkills,
          availableSP: data.availableSP
        };
      });
      
      // Update character store as well to keep in sync and recalculate power
      const charStore = useCharacterStore.getState();
      if (charStore.character) {
        let newPower = charStore.character.power;
        
        // Recalculate power dynamically
        try {
          const baseStats = charStore.character.stats || {};
          const items = useInventoryStore.getState().items;
          const equippedItems = items.filter((i: any) => i.isEquipped);
          
          const numBaseStats = Object.keys(baseStats).reduce((acc, key) => {
             const val = (baseStats as any)[key];
             if (typeof val === 'number') {
                 acc[key] = val;
             }
             return acc;
          }, {} as Record<string, number>);
  
          // Use the newly updated playerSkills array from the local state closure
          const finalStats = calculateTotalCombatStats(numBaseStats, equippedItems, useSkillStore.getState().playerSkills);
          newPower = calculateDynamicPower(charStore.character.level, finalStats);
          
          // Optionally patch identity on backend
          charStore.updateIdentity({ power: newPower, availableSP: data.availableSP });
        } catch (e) {
          console.error("Failed to recalculate power", e);
        }

        useCharacterStore.setState({
          character: {
            ...charStore.character,
            availableSP: data.availableSP,
            power: newPower
          }
        });
      }

      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  }
}));
