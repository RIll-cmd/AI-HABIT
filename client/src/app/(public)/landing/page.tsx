"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Flame,
  Target,
  ChevronRight,
  Swords,
  Award,
  Crown,
  LogIn,
  UserPlus,
  Footprints,
  Moon,
  Timer,
  Activity,
  HeartPulse,
  BookOpen,
  Dumbbell,
  Shield,
  Layers,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";

export default function LandingPage() {
  // Deterministic particle grid positions to prevent hydration mismatch
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    left: (i * 43) % 100,
    top: (i * 29) % 100,
    delay: (i * 0.2) % 4,
    duration: 3 + (i % 3),
    size: 1 + (i % 3),
  }));

  return (
    <div
      suppressHydrationWarning
      className="landing-root flex-1 flex flex-col bg-[#050a18] text-slate-100 relative overflow-hidden selection:bg-cyan-500 selection:text-white"
    >
      {/* ANIMATED BACKGROUND PARTICLE FIELD */}
      <div
        suppressHydrationWarning
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/30 blur-[1px] animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* FLOATING RUNES & ARCANUM GLYPHS */}
      <FloatingRuneField density="high" className="opacity-45" />

      {/* AMBIENT GLOW NEBULA ORBS */}
      <div
        suppressHydrationWarning
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/12 rounded-full blur-[160px] pointer-events-none"
      />
      <div
        suppressHydrationWarning
        className="absolute top-[30%] left-[10%] w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"
      />
      <div
        suppressHydrationWarning
        className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/12 rounded-full blur-[140px] pointer-events-none"
      />

      {/* CYBERNETIC GRID OVERLAY */}
      <div
        suppressHydrationWarning
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section
        suppressHydrationWarning
        className="relative px-6 py-12 md:py-24 max-w-6xl mx-auto flex flex-col items-center text-center z-10"
      >
        {/* AIRA SYSTEM ANNOUNCEMENT BADGE */}
        <div
          suppressHydrationWarning
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-[#0a1428]/80 to-indigo-950/60 backdrop-blur-xl mb-6 shadow-xl shadow-cyan-950/60 hover:border-cyan-400 transition-all duration-300 group cursor-pointer"
          onClick={() => playBuffSFX("levelup")}
        >
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            <Image
              src="/AIRA ICON/fairy-gif.gif"
              alt="AIRA AI"
              width={32}
              height={32}
              className="object-cover scale-125"
              unoptimized
            />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block uppercase">
              AIRA AI SYSTEM ONLINE // v2.0
            </span>
            <span className="text-xs font-sans text-slate-200 font-semibold">
              Neural Habit & RPG Progression Engine Active
            </span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0 ml-1" />
        </div>

        {/* HERO TITLE */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-heading tracking-tight max-w-5xl leading-[1.04] drop-shadow-2xl">
          Transform Your Real Life <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-400 drop-shadow-md">
            Into An Epic RPG
          </span>
        </h1>

        {/* HERO DESCRIPTION */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl font-sans leading-relaxed">
          Level up your physical biology, conquer workout boss gates, hatch mythic dragon companions with real steps, and let AI Administrator{" "}
          <span className="text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-500/50">
            AIRA
          </span>{" "}
          guide your real-world ascension.
        </p>

        {/* HERO CTAS */}
        <div
          suppressHydrationWarning
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            asChild
            onClick={() => playBuffSFX("levelup")}
            className="w-full sm:w-auto px-8 h-13 text-xs sm:text-sm font-black font-mono uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Link href="/register" className="flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>INITIALIZE ASCENSION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            onClick={() => playUIMenuSFX("confirm")}
            className="w-full sm:w-auto px-8 h-13 text-xs sm:text-sm font-bold font-mono uppercase tracking-wider border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-200 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer"
          >
            <Link href="/login" className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>HUNTER SIGN IN</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            asChild
            onClick={() => playBuffSFX("levelup")}
            className="w-full sm:w-auto px-6 h-13 text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/30 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <Link href="/guest" className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>GUEST SANDBOX</span>
            </Link>
          </Button>
        </div>

        {/* HERO STAT HIGHLIGHT CARDS */}
        <div
          suppressHydrationWarning
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          <div className="p-5 rounded-[22px] bg-[#0a1024]/80 border border-cyan-500/20 backdrop-blur-xl text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group">
            <div className="text-2xl md:text-3xl font-bold font-mono text-cyan-400 group-hover:scale-105 transition-transform">
              7 Core
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Attributes Tracked
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-[#0a1024]/80 border border-emerald-500/20 backdrop-blur-xl text-center hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
            <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400 group-hover:scale-105 transition-transform">
              Real-Time
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              XP & Habit Loops
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-[#0a1024]/80 border border-purple-500/20 backdrop-blur-xl text-center hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="text-2xl md:text-3xl font-bold font-mono text-purple-400 group-hover:scale-105 transition-transform">
              AIRA AI
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Neural Administrator
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-[#0a1024]/80 border border-amber-500/20 backdrop-blur-xl text-center hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group">
            <div className="text-2xl md:text-3xl font-bold font-mono text-amber-400 group-hover:scale-105 transition-transform">
              Ascension
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Tower & Boss Raids
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CORE MODULES & RPG ECOSYSTEM MATRIX */}
      {/* ========================================================= */}
      <section
        suppressHydrationWarning
        className="px-6 py-20 bg-[#050a18]/90 border-t border-cyan-500/10 relative z-10"
      >
        <div suppressHydrationWarning className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-3 text-[11px] border-cyan-500/30 bg-cyan-950/30 text-cyan-400 font-mono tracking-widest uppercase"
            >
              COMPLETE LIFE RPG ARSENAL
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight">
              Engineered For Supreme Mastery
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2 font-sans max-w-xl mx-auto leading-relaxed">
              Ascend OS merges real-life training, cognitive study, and circadian recovery into an interconnected cyberpunk gaming engine.
            </p>
          </div>

          <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: AIRA AI */}
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-cyan-500/20 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/40">
              <div className="w-12 h-12 rounded-[16px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                AIRA Neural Administrator
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Autonomous voice & contextual AI coaching. Monitors habit decay, advises on workout volume, and synchronizes your daily quests.
              </p>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                <span>Timely 60s System Alerts</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Somatic 7-Stat Matrix */}
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-emerald-500/20 hover:border-emerald-400/50 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/40">
              <div className="w-12 h-12 rounded-[16px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                Somatic 7-Stat Matrix
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Strength, Discipline, Focus, Knowledge, Recovery, Endurance & Consistency scale strictly from real-world execution.
              </p>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <span>Percentage Multipliers</span>
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Dragon Bestiary */}
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-purple-500/20 hover:border-purple-400/50 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/40">
              <div className="w-12 h-12 rounded-[16px] bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Footprints className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                Dragon Step Incubation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Accumulate physical daily walking steps to crack mystery eggs and awaken 20 mythical dragons with percentage stat buffs.
              </p>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span>20 Dragon Species</span>
                <Crown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Tower of Ascension */}
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-red-500/20 hover:border-red-400/50 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/40">
              <div className="w-12 h-12 rounded-[16px] bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                Tower Spire & Boss PRs
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Hoist heavy iron in the gym to land crushing critical damage on dungeon floor bosses and unlock rare armor blueprints.
              </p>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-red-300">
                <span>Real Lift PR Multiplier</span>
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Sleep Sanctuary */}
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-indigo-500/20 hover:border-indigo-400/50 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/40">
              <div className="w-12 h-12 rounded-[16px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Moon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                Sleep Sanctuary Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Log circadian sleep hours. Proximity to the 8.0-hour golden recovery threshold grants direct Recovery (REC) stat growth.
              </p>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-indigo-300">
                <span>Circadian Score Engine</span>
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 6: Pomodoro Focus Engine */}
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-amber-500/20 hover:border-amber-400/50 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1 shadow-xl shadow-black/40">
              <div className="w-12 h-12 rounded-[16px] bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">
                Learning & Pomodoro
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Link 25m focus blocks directly to daily study habits with ambient soundscapes and earn Knowledge (KNO) and Focus (FOC) stats.
              </p>
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] font-mono text-amber-300">
                <span>Habit-Linked Focus</span>
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CALL TO ACTION BOTTOM STARGATE */}
      {/* ========================================================= */}
      <section
        suppressHydrationWarning
        className="px-6 py-20 relative z-10 border-t border-cyan-500/20 bg-gradient-to-b from-[#050a18] via-[#081228] to-[#040814]"
      >
        <div
          suppressHydrationWarning
          className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-cyan-950/40 via-[#0a1024] to-indigo-950/40 border-2 border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading mb-3 tracking-tight">
            Ready to Awaken Your Ascendant Potential?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Create your account or launch the instant sandbox to begin leveling up your real-world attributes today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              onClick={() => playBuffSFX("levelup")}
              className="w-full sm:w-auto px-8 h-13 font-mono font-black text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <Link href="/register" className="flex items-center justify-center gap-2">
                <span>CREATE HUNTER ACCOUNT</span>
                <UserPlus className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              onClick={() => playUIMenuSFX("confirm")}
              className="w-full sm:w-auto px-8 h-13 font-mono font-bold text-xs uppercase tracking-wider border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15 rounded-2xl cursor-pointer"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <span>HUNTER SIGN IN</span>
                <LogIn className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        suppressHydrationWarning
        className="w-full px-6 py-8 border-t border-cyan-500/10 text-center text-xs text-slate-500 font-mono bg-black/60"
      >
        ASCEND OS &copy; 2026 — AI-POWERED LIFE RPG PLATFORM · NEURAL PROTOCOL v2.0
      </footer>
    </div>
  );
}
