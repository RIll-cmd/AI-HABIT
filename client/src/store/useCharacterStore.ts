import { create } from "zustand";
import { toast } from "sonner";
import {
  Character,
  CharacterStats,
  ProgressHistory,
} from "@/features/character/types/character";
import {
  calculateLevelData,
  calculateDynamicPower,
  determineRank,
} from "@/features/progression/utils";
import { eventBus } from "@/features/progression/services/EventBus";
import {
  fetchCharacterProfile,
  patchCharacterIdentity,
  syncCharacterProgression,
} from "@/features/character/services/character.service";

export interface CharacterStore {
  character: Character | null;
  setCharacter: (character: Character | null) => void;
  loadCharacter: (characterId?: string) => Promise<void>;
  fetchCharacter: (characterId?: string) => Promise<void>;
  refetch: () => Promise<void>;
  updateCharacter: (data: Partial<Character>) => void;
  updateCharacterName: (name: string) => void;
  updateCharacterTitle: (title: string) => void;
  updateIdentity: (data: Partial<Character>) => void;
  gainExp: (amount: number, reason: string) => void;
  gainGold: (amount: number, reason: string) => void;
  addStat: (statName: string, amount: number) => void;
}

// We no longer use a mock character ID. It's retrieved from localStorage.
const getStoredCharacterId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ascend_character_id") || "char-id-123";
  }
  return "char-id-123";
};

const defaultStats: CharacterStats = {
  id: "stats-1",
  characterId: "char-1",
  strength: 1,
  knowledge: 1,
  discipline: 1,
  focus: 1,
  endurance: 1,
  recovery: 1,
  consistency: 1,
};

const defaultCharacter: Character = {
  id: "char-1",
  userId: "user-1",
  name: "Shadow Monarch",
  avatar: "/Character_sprite_placeholder/walk_down.gif",
  theme: "dark-rpg",
  title: "Hydration Monarch",
  level: 1,
  exp: 0,
  power: 97,
  rank: "F",
  gold: 500,
  gems: 50,
  towerTokens: 0,
  availableSP: 5,
  createdAt: new Date().toISOString(),
  stats: defaultStats,
  history: [],
};

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  character: defaultCharacter,

  setCharacter: (character) => set({ character }),

  loadCharacter: async (characterId?: string) => {
    const targetId = characterId || getStoredCharacterId();

    const profile = await fetchCharacterProfile(targetId);
    if (profile) {
      const statsObj = (profile.stats || defaultStats) as unknown as Record<string, number>;
      const power = calculateDynamicPower(profile.level, statsObj);
      const rank = determineRank(power);
      set({
        character: {
          ...profile,
          power,
          rank,
        },
      });
    }
  },

  fetchCharacter: async (characterId?: string) => {
    return get().loadCharacter(characterId);
  },

  refetch: async () => {
    return get().loadCharacter();
  },

  updateCharacter: (data) => {
    const { character } = get();
    if (!character) return;
    set({
      character: {
        ...character,
        ...data,
      },
    });
  },

  updateCharacterName: (name) => {
    const { updateIdentity } = get();
    updateIdentity({ name });
  },

  updateCharacterTitle: (title) => {
    const { updateIdentity } = get();
    updateIdentity({ title });
  },

  updateIdentity: (data) => {
    const { character } = get();
    if (!character) return;

    const updatedCharacter = {
      ...character,
      ...data,
    };

    set({ character: updatedCharacter });
    toast.success("Identity updated successfully.");

    const targetId = character.id || getStoredCharacterId();
    if (!targetId) return;
    patchCharacterIdentity(targetId, data).catch((err) => {
      console.error(
        "[useCharacterStore] Background identity patch failed:",
        err
      );
    });
  },

  gainGold: (amount: number, reason: string) => {
    const { character } = get();
    if (!character) return;

    const newGold = Math.max(0, (character.gold || 0) + amount);

    if (amount > 0) {
      toast.success(`+${amount} Gold`, { description: reason });
    } else if (amount < 0) {
      toast.info(`${amount} Gold`, { description: reason });
    }

    const historyEntry: ProgressHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      characterId: character.id,
      type: "GOLD_GAIN",
      amount,
      description: `${amount > 0 ? "Gained" : "Spent"} ${Math.abs(amount)} Gold: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    set({
      character: {
        ...character,
        gold: newGold,
        history: [...(character.history || []), historyEntry],
      },
    });
  },

  addStat: (statName: string, amount: number) => {
    const { character } = get();
    if (!character) return;

    const lowerStat = statName.toLowerCase();
    const currentStats = (character.stats || defaultStats) as Record<string, any>;
    const currentVal = typeof currentStats[lowerStat] === "number" ? currentStats[lowerStat] : 1;
    const updatedVal = currentVal + amount;

    const updatedStats: CharacterStats = {
      ...currentStats,
      [lowerStat]: updatedVal,
    } as CharacterStats;

    const previousRank = character.rank;
    const newPower = calculateDynamicPower(character.level, updatedStats as unknown as Record<string, number>);
    const newRank = determineRank(newPower);

    toast.success(`+${amount} ${statName.toUpperCase()}`, {
      description: `Stat increased! New ${statName}: ${updatedVal}`,
    });

    if (newRank !== previousRank) {
      eventBus.publish("RANK_ASCENDED", { newRank });
    }

    set({
      character: {
        ...character,
        stats: updatedStats,
        power: newPower,
        rank: newRank,
      },
    });
  },

  gainExp: (amount: number, reason: string) => {
    const { character } = get();
    if (!character) return;

    let expMultiplier = 1;
    try {
      const { useSkillStore } = require('@/features/skills/store/useSkillStore');
      const playerSkills = useSkillStore.getState().playerSkills;
      if (playerSkills.some((ps: any) => ps.skillDefinitionId === 'asc_05')) {
        expMultiplier = 1.10;
      }
    } catch (e) {
      // Ignored
    }

    const finalAmount = Math.floor(amount * expMultiplier);

    const previousLevel = character.level;
    const previousRank = character.rank;
    const newTotalExp = character.exp + finalAmount;
    const levelData = calculateLevelData(newTotalExp);
    const isLevelUp = levelData.currentLevel > previousLevel;

    const statsObj = (character.stats || defaultStats) as unknown as Record<string, number>;
    const newPower = calculateDynamicPower(levelData.currentLevel, statsObj);
    const newRank = determineRank(newPower);
    const isRankUp = newRank !== previousRank;

    if (isLevelUp) {
      const spGained = (levelData.currentLevel - previousLevel) * 5;
      toast.success(`LEVEL UP! You reached Level ${levelData.currentLevel}! (+${spGained} Stat Points)`, {
        description: `Your power score and combat potential have increased!`,
      });
      eventBus.publish("LEVEL_UP", { newLevel: levelData.currentLevel });

      set({
        character: {
          ...character,
          level: levelData.currentLevel,
          exp: newTotalExp,
          availableSP: (character.availableSP || 0) + spGained,
          power: newPower,
          rank: newRank,
          history: [...(character.history || []), {
            id: `hist-${Date.now()}`,
            characterId: character.id,
            type: "LEVEL_UP",
            amount: finalAmount,
            description: `Leveled up to Level ${levelData.currentLevel}! (+${spGained} SP Gained)`,
            createdAt: new Date().toISOString(),
          }],
        },
      });
    } else {
      toast.info(`+${amount} EXP Gained`, {
        description: reason,
      });

      set({
        character: {
          ...character,
          exp: newTotalExp,
          power: newPower,
          rank: newRank,
          history: [...(character.history || []), {
            id: `hist-${Date.now()}`,
            characterId: character.id,
            type: "EXP_GAIN",
            amount: finalAmount,
            description: `Gained +${finalAmount} EXP: ${reason}`,
            createdAt: new Date().toISOString(),
          }],
        },
      });
    }

    if (isRankUp) {
      eventBus.publish("RANK_ASCENDED", { newRank });
    }

    const targetId = character?.id || getStoredCharacterId();
    if (!targetId) return;
    const syncPayload = {
      total_exp: newTotalExp,
      level: levelData.currentLevel,
      power: newPower,
      rank: newRank,
      history_entry: {
        amount: finalAmount,
        type: isLevelUp ? "LEVEL_UP" : "EXP_GAIN",
        description: isLevelUp ? `Leveled up to Level ${levelData.currentLevel}!` : `Gained +${finalAmount} EXP`,
      },
    };

    syncCharacterProgression(targetId, syncPayload).catch((err) => {
      console.error(
        "[useCharacterStore] Background progression sync failed:",
        err
      );
    });
  },
}));
