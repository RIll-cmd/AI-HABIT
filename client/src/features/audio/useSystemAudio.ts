"use client";

/**
 * System Audio Utility for Ascend OS & AIRA Voice Interface
 */

export const SOUND_PATHS = {
  NOTICE: "/sounds/AIRA Persona/AI-NOTICE.mp3",
  UNDERSTOOD: "/sounds/AIRA Persona/AI-UNDERSTOOD.mp3",
  CONFIRMED: "/sounds/AIRA Persona/AI-CONFRIMED.mp3",
  SUCCESSFUL: "/sounds/AIRA Persona/AI-SUCCESSFUL.mp3",
  FAILED: "/sounds/AIRA Persona/AI-FAILED.mp3",
  INTRINSIC_SKILL: "/sounds/AIRA Persona/AI-NEW intrinsic SKILL.mp3",
  EVOLUTION: "/sounds/AIRA Persona/AI-THIS COMPLETES THE EVOLUTION.mp3",
  SKILL_IMPROVED: "/sounds/AIRA Persona/AI-ALL PHYSICAL ABILITIES HAVE BEEN IMPROVED.mp3",
  SYSTEM_OPEN: "/sounds/System UI & Navigation/SYSTEM--OPEN.mp3",
  REWARD: "/sounds/System UI & Navigation/SYSTEM-CORRECT ANSWER REWARD.wav",
};

/**
 * Plays an audio sound safely, handling SSR checks and browser autoplay restrictions.
 */
export function playSystemSound(soundPath: string, volume: number = 0.6) {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio(encodeURI(soundPath));
    audio.volume = volume;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Quietly swallow browser autoplay policy restriction warnings
        console.debug("[SystemAudio] Autoplay prevented:", err);
      });
    }
  } catch (error) {
    console.debug("[SystemAudio] Sound playback error:", error);
  }
}

export function playNoticeSound() {
  playSystemSound(SOUND_PATHS.NOTICE, 0.7);
}

export function playGeneralNotification() {
  playNoticeSound();
}

export function playUnderstoodSound() {
  playSystemSound(SOUND_PATHS.UNDERSTOOD, 0.7);
}

export function playConfirmedSound() {
  playSystemSound(SOUND_PATHS.CONFIRMED, 0.7);
}

export function playSuccessfulSound() {
  playSystemSound(SOUND_PATHS.SUCCESSFUL, 0.7);
}

export function playFailedSound() {
  playSystemSound(SOUND_PATHS.FAILED, 0.7);
}

export function playSkillSound() {
  playSystemSound(SOUND_PATHS.INTRINSIC_SKILL, 0.7);
}

export function playEvolutionSound() {
  playSystemSound(SOUND_PATHS.SKILL_IMPROVED, 0.7);
}

export function playSystemOpen() {
  playSystemSound(SOUND_PATHS.SYSTEM_OPEN, 0.5);
}

export function useSystemAudio() {
  return {
    playSystemSound,
    playNoticeSound,
    playGeneralNotification,
    playUnderstoodSound,
    playConfirmedSound,
    playSuccessfulSound,
    playFailedSound,
    playSkillSound,
    playEvolutionSound,
    playSystemOpen,
  };
}
