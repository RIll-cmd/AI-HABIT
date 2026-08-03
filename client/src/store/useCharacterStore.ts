import { create } from "zustand";

export interface CharacterState {
  id: string;
  name: string;
  avatar: string;
  theme: string;
  title: string;
}

interface CharacterStore {
  character: CharacterState | null;
  setCharacter: (character: CharacterState) => void;
  updateCharacterName: (name: string) => void;
  updateCharacterTitle: (title: string) => void;
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: {
    id: "char-1",
    name: "Shadow Monarch",
    avatar: "/avatars/shadow-monarch.png",
    theme: "dark-rpg",
    title: "Shadow Seeker",
  },
  setCharacter: (character) => set({ character }),
  updateCharacterName: (name) =>
    set((state) => ({
      character: state.character ? { ...state.character, name } : null,
    })),
  updateCharacterTitle: (title) =>
    set((state) => ({
      character: state.character ? { ...state.character, title } : null,
    })),
}));
