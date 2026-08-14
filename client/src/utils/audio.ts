import { useSettingsStore } from "@/store/useSettingsStore";

/**
 * Instantiates an Audio object and plays a UI sound from the /sounds/ directory.
 * @param filename The path to the sound file relative to the public directory
 * @param volume The playback volume (0.0 to 1.0)
 */
export function playUISound(filename: string, volume: number = 0.5) {
  if (typeof window === "undefined") return;

  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  try {
    const audio = new Audio(encodeURI(filename));
    const effectiveVol = Math.max(0, Math.min(1, volume * (settings.sfxVolume / 100)));
    audio.volume = effectiveVol;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Quietly swallow browser autoplay policy restriction warnings
        console.debug("[AudioUtil] Autoplay prevented for UI sound:", err);
      });
    }
  } catch (error) {
    console.debug("[AudioUtil] UI sound playback error:", error);
  }
}

/**
 * Instantiates an Audio object and plays a voice line from the /sounds/ directory.
 * @param filename The path to the voice line file
 * @param volume The playback volume (0.0 to 1.0)
 */
export function playVoiceLine(filename: string, volume: number = 0.8) {
  if (typeof window === "undefined") return;

  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return;

  try {
    const audio = new Audio(encodeURI(filename));
    const effectiveVol = Math.max(0, Math.min(1, volume * (settings.voiceVolume / 100)));
    audio.volume = effectiveVol;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Quietly swallow browser autoplay policy restriction warnings
        console.debug("[AudioUtil] Autoplay prevented for voice line:", err);
      });
    }
  } catch (error) {
    console.debug("[AudioUtil] Voice line playback error:", error);
  }
}
/** Dedicated AIRA Persona Audio Mapping */
export const AIRA_AUDIO = {
  FAILED: "/sounds/AIRA Persona/AI-FAILED.mp3",
  SUCCESSFUL: "/sounds/AIRA Persona/AI-SUCCESSFUL.mp3",
  CONFIRMED: "/sounds/AIRA Persona/AI-CONFRIMED.mp3",
  UNDERSTOOD: "/sounds/AIRA Persona/AI-UNDERSTOOD.mp3",
  NOTICE: "/sounds/AIRA Persona/AI-NOTICE.mp3",
  ABILITIES_IMPROVED: "/sounds/AIRA Persona/AI-ALL PHYSICAL ABILITIES HAVE BEEN IMPROVED.mp3",
  NEW_SKILL: "/sounds/AIRA Persona/AI-NEW intrinsic SKILL.mp3",
  NEW_RESISTANCE: "/sounds/AIRA Persona/AI-NEW RESISTANCE.mp3",
  EVOLUTION: "/sounds/AIRA Persona/AI-THIS COMPLETES THE EVOLUTION.mp3",
  REPEATING: "/sounds/AIRA Persona/AI-REPEATING THE ATTEMPT.mp3",
} as const;

export function playAIRASound(
  key: keyof typeof AIRA_AUDIO,
  volume: number = 0.85
) {
  const path = AIRA_AUDIO[key];
  if (path) {
    playVoiceLine(path, volume);
  }
}
/** Dedicated trigger functions for General sound folders */

/**
 * Plays combat & attack SFX (10_Battle_SFX & 8_Atk_Magic_SFX)
 */
export function playBattleSFX(
  type: 'slash' | 'impact' | 'encounter' | 'magic' | 'crit' = 'slash',
  volume: number = 0.6
) {
  const map: Record<string, string> = {
    slash: "/sounds/General/10_Battle_SFX/22_Slash_04.wav",
    impact: "/sounds/General/10_Battle_SFX/15_Impact_flesh_02.wav",
    encounter: "/sounds/General/10_Battle_SFX/55_Encounter_02.wav",
    magic: "/sounds/General/8_Atk_Magic_SFX/04_Fire_explosion_04_medium.wav",
    crit: "/sounds/General/8_Atk_Magic_SFX/18_Thunder_02.wav",
  };
  playUISound(map[type] || map.slash, volume);
}

/**
 * Plays buff & healing SFX (8_Buffs_Heals_SFX)
 */
export function playBuffSFX(
  type: 'buff' | 'heal' | 'levelup' | 'speed' = 'buff',
  volume: number = 0.6
) {
  const map: Record<string, string> = {
    buff: "/sounds/General/8_Buffs_Heals_SFX/16_Atk_buff_04.wav",
    heal: "/sounds/General/8_Buffs_Heals_SFX/02_Heal_02.wav",
    levelup: "/sounds/General/8_Buffs_Heals_SFX/30_Revive_03.wav",
    speed: "/sounds/General/8_Buffs_Heals_SFX/48_Speed_up_02.wav",
  };
  playUISound(map[type] || map.buff, volume);
}

/**
 * Plays UI menu SFX (10_UI_Menu_SFX)
 */
export function playUIMenuSFX(
  type: 'hover' | 'confirm' | 'equip' | 'buy' | 'decline' = 'confirm',
  volume: number = 0.5
) {
  const map: Record<string, string> = {
    hover: "/sounds/General/10_UI_Menu_SFX/001_Hover_01.wav",
    confirm: "/sounds/General/10_UI_Menu_SFX/013_Confirm_03.wav",
    equip: "/sounds/General/10_UI_Menu_SFX/070_Equip_10.wav",
    buy: "/sounds/General/10_UI_Menu_SFX/079_Buy_sell_01.wav",
    decline: "/sounds/General/10_UI_Menu_SFX/029_Decline_09.wav",
  };
  playUISound(map[type] || map.confirm, volume);
}

/**
 * Plays movement & route transition SFX (12_Player_Movement_SFX)
 */
export function playMovementSFX(
  type: 'teleport' | 'step' | 'jump' = 'teleport',
  volume: number = 0.5
) {
  const map: Record<string, string> = {
    teleport: "/sounds/General/12_Player_Movement_SFX/88_Teleport_02.wav",
    step: "/sounds/General/12_Player_Movement_SFX/03_Step_grass_03.wav",
    jump: "/sounds/General/12_Player_Movement_SFX/30_Jump_03.wav",
  };
  playUISound(map[type] || map.teleport, volume);
}
