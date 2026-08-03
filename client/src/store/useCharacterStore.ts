import { create } from "zustand";
import { toast } from "sonner";
import {
  Character,
  CharacterStats,
  ProgressHistory,
} from "@/features/character/types/character";
import {
  calculateLevelData,
  calculatePower,
  calculateRank,
} from "@/features/character/utils";
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
  power: 50,
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
      set({ character: profile });
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

    // Optimistic UI state update
    set({ character: updatedCharacter });
    toast.success("Identity updated successfully.");

    // Asynchronous background persistence sync
    const targetId = character.id || MOCK_CHARACTER_ID;
    patchCharacterIdentity(targetId, data).catch((err) => {
      console.error(
        "[useCharacterStore] Background identity patch failed:",
        err
      );
    });
  },

  gainExp: (amount: number, reason: string) => {
    const { character } = get();
    if (!character) return;

    const previousLevel = character.level;
    const newTotalExp = character.exp + amount;
    const levelData = calculateLevelData(newTotalExp);
    const isLevelUp = levelData.currentLevel > previousLevel;

    if (isLevelUp) {
      toast.success(`LEVEL UP! You reached Level ${levelData.currentLevel}!`, {
        description: `Your power score and combat potential have increased!`,
      });
    } else {
      toast.info(`+${amount} EXP Gained`, {
        description: reason,
      });
    }

    const newPower = calculatePower(levelData.currentLevel, character.stats);
    const newRank = calculateRank(newPower);

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
