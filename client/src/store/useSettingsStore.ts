import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsState {
  // Audio Preferences
  soundEnabled: boolean;
  sfxVolume: number; // 0 to 100
  voiceVolume: number; // 0 to 100
  
  // AIRA & Notification Preferences
  airaPeriodicEnabled: boolean;
  airaIntervalSeconds: number; // 30, 60, 120, 300, 600
  notificationSound: boolean;

  // Gameplay & Visuals
  combatAnimations: boolean;
  glowIntensity: "low" | "medium" | "high";
  compactMode: boolean;
  autoClaimAchievements: boolean;

  // Actions
  setSoundEnabled: (enabled: boolean) => void;
  setSfxVolume: (volume: number) => void;
  setVoiceVolume: (volume: number) => void;
  setAiraPeriodicEnabled: (enabled: boolean) => void;
  setAiraIntervalSeconds: (seconds: number) => void;
  setNotificationSound: (enabled: boolean) => void;
  setCombatAnimations: (enabled: boolean) => void;
  setGlowIntensity: (intensity: "low" | "medium" | "high") => void;
  setCompactMode: (enabled: boolean) => void;
  setAutoClaimAchievements: (enabled: boolean) => void;
  resetAllSettings: () => void;
}

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  sfxVolume: 70,
  voiceVolume: 80,
  airaPeriodicEnabled: true,
  airaIntervalSeconds: 60,
  notificationSound: true,
  combatAnimations: true,
  glowIntensity: "medium" as const,
  compactMode: false,
  autoClaimAchievements: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setSfxVolume: (sfxVolume) => set({ sfxVolume: Math.max(0, Math.min(100, sfxVolume)) }),
      setVoiceVolume: (voiceVolume) => set({ voiceVolume: Math.max(0, Math.min(100, voiceVolume)) }),
      
      setAiraPeriodicEnabled: (airaPeriodicEnabled) => set({ airaPeriodicEnabled }),
      setAiraIntervalSeconds: (airaIntervalSeconds) => set({ airaIntervalSeconds }),
      setNotificationSound: (notificationSound) => set({ notificationSound }),

      setCombatAnimations: (combatAnimations) => set({ combatAnimations }),
      setGlowIntensity: (glowIntensity) => set({ glowIntensity }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setAutoClaimAchievements: (autoClaimAchievements) => set({ autoClaimAchievements }),

      resetAllSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: "ascend_settings_preferences",
    }
  )
);
