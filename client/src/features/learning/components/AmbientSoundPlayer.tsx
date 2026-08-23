"use client";

import React, { useEffect, useRef } from "react";
import { Volume2, VolumeX, Headphones, Music, Radio, Sparkles, Activity } from "lucide-react";
import { useLearningStore, AmbientSoundType } from "../store/useLearningStore";

const SOUND_OPTIONS: { id: AmbientSoundType; label: string; icon: string; desc: string }[] = [
  { id: "NONE", label: "Mute", icon: "🔇", desc: "Silent deep focus" },
  { id: "RAIN", label: "Cyber Rain", icon: "🌧️", desc: "Rainy Mood (Persona 5)" },
  { id: "SPACE_DRONE", label: "Space Drone", icon: "🌌", desc: "432Hz deep resonant frequency" },
  { id: "LOFI_NOISE", label: "Lo-Fi Noise", icon: "📻", desc: "Warm soothing pink noise" },
  { id: "BINARY_PULSE", label: "Binary Pulse", icon: "⚡", desc: "Binaural beta wave focus pulses" },
];

export const AmbientSoundPlayer: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { ambientSound, ambientVolume, setAmbientSound, setAmbientVolume } = useLearningStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  // Initialize Audio & Soundscapes
  useEffect(() => {
    // 1. Clean up any existing HTML Audio element (e.g. Cyber Rain track)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // 2. Clean up any existing Web Audio synth context
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    if (ambientSound === "NONE") {
      return;
    }

    // A) Cyber Rain: Play the Persona 5 Rainy Mood Soundtrack
    if (ambientSound === "RAIN") {
      try {
        const audio = new Audio("/music/cyber_rain.mp3");
        audio.loop = true;
        audio.volume = Math.min(1, Math.max(0, ambientVolume));
        audioRef.current = audio;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn("Autoplay blocked or waiting for user interaction:", e);
          });
        }
      } catch (err) {
        console.error("Failed to initialize Cyber Rain audio element", err);
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
      };
    }

    // B) Procedural Web Audio Synthesis for other soundscapes
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(ambientVolume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (ambientSound === "LOFI_NOISE") {
        // Pink / White Noise Generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(0);
        sourceNodeRef.current = whiteNoise;
      } else if (ambientSound === "SPACE_DRONE") {
        // Dual sine oscillators 108Hz + 112Hz creating 4Hz theta binaural beats
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(108, ctx.currentTime);
        osc2.frequency.setValueAtTime(112, ctx.currentTime);

        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc1.start(0);
        osc2.start(0);
        sourceNodeRef.current = osc1;
      } else if (ambientSound === "BINARY_PULSE") {
        // 14Hz beta wave focus pulse
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, ctx.currentTime);

        lfo.type = "sine";
        lfo.frequency.setValueAtTime(14, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

        lfo.connect(lfoGain.gain);
        osc.connect(masterGain);
        osc.start(0);
        lfo.start(0);
        sourceNodeRef.current = osc;
      }
    } catch (e) {
      console.error("Web audio ambient sound initialization failed", e);
    }

    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [ambientSound]);

  // Dynamically synchronize volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, ambientVolume));
    }
    if (gainNodeRef.current && audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      gainNodeRef.current.gain.setValueAtTime(
        ambientVolume * 0.15,
        audioCtxRef.current.currentTime
      );
    }
  }, [ambientVolume]);

  return (
    <div className={`p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          Neural Ambient Soundscapes
          {ambientSound !== "NONE" && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full ml-1 animate-pulse">
              <Activity className="w-2.5 h-2.5" />
              PLAYING
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {ambientVolume > 0 && ambientSound !== "NONE" ? (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
            className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] font-mono text-slate-400 min-w-[28px]">
            {Math.round(ambientVolume * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {SOUND_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setAmbientSound(opt.id)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              ambientSound === opt.id
                ? "bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50"
                : "bg-slate-950/50 hover:bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{opt.icon}</span>
                <span className="text-[11px] font-bold font-mono text-white truncate">{opt.label}</span>
              </div>
              {ambientSound === opt.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </div>
            <span className="text-[9px] text-slate-400 block truncate mt-0.5">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
