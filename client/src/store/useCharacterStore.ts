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
  setCharacter: (character: Character) => void;
  loadCharacter: (characterId?: string) => Promise<void>;
  updateCharacterName: (name: string) => void;
  updateCharacterTitle: (title: string) => void;
  updateIdentity: (data: Partial<Character>) => void;
  gainExp: (amount: number, reason: string) => void;
  gainGold: (amount: number, reason: string) => void;
  addStat: (statName: string, amount: number) => void;
}

const MOCK_CHARACTER_ID = "char-id-123";

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
  avatar: "/avatars/shadow-monarch.png",
  theme: "dark-rpg",
  title: "Shadow Seeker",
  level: 1,
  exp: 0,
  power: 97,
  rank: "F",
  gold: 0,
  createdAt: new Date().toISOString(),
  stats: defaultStats,
  history: [],
};

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  character: defaultCharacter,

  setCharacter: (character) => set({ character }),

  loadCharacter: async (characterId?: string) => {
    const targetId = characterId || get().character?.id || MOCK_CHARACTER_ID;
    const profile = await fetchCharacterProfile(targetId);
    if (profile) {
      // Recalculate power and rank dynamically using single source of truth
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

    const targetId = character.id || MOCK_CHARACTER_ID;
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

    const previousLevel = character.level;
    const previousRank = character.rank;
    const newTotalExp = character.exp + amount;
    const levelData = calculateLevelData(newTotalExp);
    const isLevelUp = levelData.currentLevel > previousLevel;

    const statsObj = (character.stats || defaultStats) as unknown as Record<string, number>;
    const newPower = calculateDynamicPower(levelData.currentLevel, statsObj);
    const newRank = determineRank(newPower);
    const isRankUp = newRank !== previousRank;

    if (isLevelUp) {
      toast.success(`LEVEL UP! You reached Level ${levelData.currentLevel}!`, {
        description: `Your power score and combat potential have increased!`,
      });
      eventBus.publish("LEVEL_UP", { newLevel: levelData.currentLevel });
    } else {
      toast.info(`+${amount} EXP Gained`, {
        description: reason,
      });
    }

    if (isRankUp) {
      eventBus.publish("RANK_ASCENDED", { newRank });
    }

    const historyEntry: ProgressHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      characterId: character.id,
      type: isLevelUp ? "LEVEL_UP" : "EXP_GAIN",
      amount,
      description: isLevelUp
        ? `Leveled up to Level ${levelData.currentLevel}! (${reason})`
        : `Gained +${amount} EXP: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [...(character.history || []), historyEntry];

    // Optimistic UI state update
    set({
      character: {
        ...character,
        level: levelData.currentLevel,
        exp: newTotalExp,
        power: newPower,
        rank: newRank,
        history: updatedHistory,
      },
    });

    // Asynchronous background progression sync
    const targetId = character.id || MOCK_CHARACTER_ID;
    const syncPayload = {
      total_exp: newTotalExp,
      level: levelData.currentLevel,
      power: newPower,
      rank: newRank,
      history_entry: {
        amount,
        type: historyEntry.type,
        description: historyEntry.description,
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
