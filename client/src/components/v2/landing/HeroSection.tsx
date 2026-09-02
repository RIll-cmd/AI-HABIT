"use client";

import React from "react";
import { ArrowRight, Sparkles, Shield, Flame, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onSelectTab?: (tab: "login" | "register" | "otp") => void;
}

export function HeroSection({ onSelectTab }: HeroSectionProps) {
  const scrollToAuth = (tab: "login" | "register" | "otp" = "register") => {
    if (onSelectTab) onSelectTab(tab);
    const el = document.getElementById("auth-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
      {/* Background Subtle Radial Accent */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-950/20 blur-[120px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 z-10">
        {/* System Protocol Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-zinc-200">SOLO LEVELING HABIT OPERATING SYSTEM</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">V2.4</span>
        </div>

        {/* Semantic H1 Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
          Level Up Your Real Life Into An Epic RPG.
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-normal">
          Transform daily habits, gym workouts, walking steps, and study sessions into tangible character attributes, raid boss exertion, and permanent progression.
        </p>

        {/* Action Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
          {/* Primary CTA */}
          <Button
            type="button"
            onClick={() => scrollToAuth("register")}
            className="w-full sm:w-auto min-h-[44px] px-7 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-sm transition-all shadow-lg shadow-cyan-950/40 cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <span>Begin Ascension</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Secondary CTA: Sandbox Guest */}
          <Button
            type="button"
            variant="outline"
            onClick={() => scrollToAuth("login")}
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-700/80 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Explore Guest Sandbox</span>
          </Button>
        </div>

        {/* Tertiary Sign In Prompt */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 pt-1">
          <span>Already commissioned an operative license?</span>
          <button
            type="button"
            onClick={() => scrollToAuth("login")}
            className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md outline-none px-1"
          >
            Sign In
          </button>
        </div>

        {/* Hero Telemetry Micro Matrix Preview */}
        <div className="w-full max-w-2xl mt-8 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-mono uppercase">Power Rating</span>
              <Zap className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-lg font-bold font-mono text-white">4,850 PWR</span>
            <span className="text-[10px] text-cyan-400/90 font-mono">Rank A Operative</span>
          </div>

          <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-mono uppercase">Habit Streak</span>
              <Flame className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-lg font-bold font-mono text-white">24 Days</span>
            <span className="text-[10px] text-amber-400/90 font-mono">Freeze Shield Active</span>
          </div>

          <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-mono uppercase">CNS Recovery</span>
              <Activity className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-lg font-bold font-mono text-white">92% Fresh</span>
            <span className="text-[10px] text-emerald-400/90 font-mono">14 Muscles Ready</span>
          </div>

          <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-850">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-mono uppercase">Gate Raid</span>
              <Shield className="w-3 h-3 text-rose-400" />
            </div>
            <span className="text-lg font-bold font-mono text-white">Ignis Drake</span>
            <span className="text-[10px] text-rose-400/90 font-mono">34% HP Remaining</span>
          </div>
        </div>
      </div>
    </section>
  );
}
