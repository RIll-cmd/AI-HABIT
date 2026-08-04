import { create } from "zustand";
import { AIRAMessage } from "../types";
import { sendAiraChat, diagnoseTowerDefeat, fetchDailyReport } from "../services";
import { playNoticeSound, playUnderstoodSound } from "@/features/audio/useSystemAudio";

export interface AiraStore {
  messages: AIRAMessage[];
  dailyReport: string | null;
  isLoading: boolean;
  activeInsight: string | null;
  loadDailyReport: (characterId?: string) => Promise<void>;
  sendPrompt: (prompt: string, characterId?: string) => Promise<void>;
  diagnoseDefeat: (
    battleLogs: string[],
    characterId?: string,
    floorNumber?: number
  ) => Promise<string | null>;
  clearMessages: () => void;
}

const DEFAULT_CHARACTER_ID = "char-id-123";

const INITIAL_WELCOME_MESSAGE: AIRAMessage = {
  id: "msg-welcome-0",
  sender: "aira",
  text: "<< Notice. >> AIRA system online. Resonance calculation at 100% accuracy. State your query or request Master, I am prepared to calculate your optimal Attribute Enhancement trajectory.",
  timestamp: new Date(),
  type: "notice",
};

export const useAiraStore = create<AiraStore>((set, get) => ({
  messages: [INITIAL_WELCOME_MESSAGE],
  dailyReport: null,
  isLoading: false,
  activeInsight: null,

  loadDailyReport: async (characterId?: string) => {
    const targetId = characterId || DEFAULT_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const res = await fetchDailyReport(targetId);
      if (res && res.report) {
        set({
          dailyReport: res.report,
          activeInsight: res.report,
          isLoading: false,
        });
        playNoticeSound();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("[useAiraStore] Error loading daily report:", error);
      set({ isLoading: false });
    }
  },

  sendPrompt: async (prompt: string, characterId?: string) => {
    if (!prompt.trim()) return;
    playUnderstoodSound();
    const targetId = characterId || DEFAULT_CHARACTER_ID;

    const userMsg: AIRAMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
    }));

    try {
      const res = await sendAiraChat(prompt, targetId);
      const airaText =
        res?.response ||
        "<< Answer. >> Analysis complete with 100% calculation accuracy. Master's query has been registered for Skill Acquisition optimization.";

      const airaMsg: AIRAMessage = {
        id: `msg-aira-${Date.now()}`,
        sender: "aira",
        text: airaText,
        timestamp: new Date(),
        type: airaText.includes("<< Report. >>")
          ? "report"
          : airaText.includes("<< Notice. >>")
          ? "notice"
          : "answer",
      };

      set((state) => ({
        messages: [...state.messages, airaMsg],
        activeInsight: airaText,
        isLoading: false,
      }));

      // Play AIRA voice audio cue
      playNoticeSound();
    } catch (error) {
      console.error("[useAiraStore] Error sending prompt:", error);
      set({ isLoading: false });
    }
  },

  diagnoseDefeat: async (
    battleLogs: string[],
    characterId?: string,
    floorNumber: number = 1
  ) => {
    const targetId = characterId || DEFAULT_CHARACTER_ID;
    set({ isLoading: true });
    try {
      const res = await diagnoseTowerDefeat(battleLogs, targetId, floorNumber);
      const diagnosisText =
        res?.diagnosis ||
        `<< Report. >> Defeat on Floor ${floorNumber} analyzed. Calculation indicates a deficit in Recovery attributes. Recommend 3 days of Sleep & Restoration routines.`;

      const airaMsg: AIRAMessage = {
        id: `msg-defeat-${Date.now()}`,
        sender: "aira",
        text: diagnosisText,
        timestamp: new Date(),
        type: "report",
      };

      set((state) => ({
        messages: [...state.messages, airaMsg],
        activeInsight: diagnosisText,
        isLoading: false,
      }));

      playNoticeSound();
      return diagnosisText;
    } catch (error) {
      console.error("[useAiraStore] Error diagnosing defeat:", error);
      set({ isLoading: false });
      return null;
    }
  },

  clearMessages: () => {
    set({ messages: [INITIAL_WELCOME_MESSAGE] });
  },
}));
