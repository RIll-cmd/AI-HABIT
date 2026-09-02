import { useSettingsStore } from "@/store/useSettingsStore";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getEffectiveVolume(baseVolume: number = 0.5): number {
  const settings = useSettingsStore.getState();
  if (!settings.soundEnabled) return 0;
  return Math.max(0, Math.min(1, baseVolume * (settings.sfxVolume / 100)));
}

/**
 * Procedural Steampunk Escapement Clockwork Tick
 */
export function playClockworkTick(volume: number = 0.3) {
  const vol = getEffectiveVolume(volume);
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, ctx.currentTime);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    gain.gain.setValueAtTime(vol * 0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (err) {
    console.debug("[SteampunkAudio] Tick audio error:", err);
  }
}

/**
 * Procedural Steampunk Ratchet Winding Gear SFX
 */
export function playClockworkRatchet(clicks: number = 4, volume: number = 0.35) {
  const vol = getEffectiveVolume(volume);
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    for (let i = 0; i < clicks; i++) {
      const clickTime = ctx.currentTime + i * 0.035;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800 + i * 120, clickTime);
      osc.frequency.exponentialRampToValueAtTime(280, clickTime + 0.025);

      gain.gain.setValueAtTime(vol * 0.4, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(clickTime);
      osc.stop(clickTime + 0.03);
    }
  } catch (err) {
    console.debug("[SteampunkAudio] Ratchet audio error:", err);
  }
}

/**
 * Procedural Steampunk High-Pressure Steam Vent Hiss
 */
export function playSteamRelease(volume: number = 0.45) {
  const vol = getEffectiveVolume(volume);
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Generate white noise buffer
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.25);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.debug("[SteampunkAudio] Steam hiss audio error:", err);
  }
}

/**
 * Procedural Steampunk Knife-Switch Throw SFX
 */
export function playKnifeSwitchSFX(volume: number = 0.4) {
  const vol = getEffectiveVolume(volume);
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.065);
  } catch (err) {
    console.debug("[SteampunkAudio] Knife switch audio error:", err);
  }
}

/**
 * Procedural Steampunk Brass Astrolabe Bell Chime
 */
export function playChronoChime(freq: number = 587.33, volume: number = 0.35) {
  const vol = getEffectiveVolume(volume);
  if (vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.debug("[SteampunkAudio] Chrono chime audio error:", err);
  }
}
