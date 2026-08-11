"use client";

import React from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  // Deterministic particle grid positions to prevent hydration mismatch
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    left: (i * 47) % 100,
    top: (i * 31) % 100,
    delay: (i * 0.2) % 4,
    duration: 3 + (i % 3),
  }));

  return (
    <div suppressHydrationWarning className="landing-root flex-1 flex flex-col bg-[#050a18] text-slate-100 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* ANIMATED BACKGROUND PARTICLE FIELD */}
      <div suppressHydrationWarning className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-[1px] animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* AMBIENT GLOW ORBS */}
      <div suppressHydrationWarning className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div suppressHydrationWarning className="absolute top-[35%] left-[15%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div suppressHydrationWarning className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* CYBERNETIC GRID OVERLAY */}
      <div suppressHydrationWarning className="absolute inset-0 pointer-events-none z-0 opacity-40" style={{
        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
      }} />

      {/* HERO SECTION */}
      <section suppressHydrationWarning className="relative px-6 py-16 md:py-28 max-w-6xl mx-auto flex flex-col items-center text-center z-10">
        
        {/* AIRA SYSTEM ANNOUNCEMENT BADGE */}
        <div suppressHydrationWarning className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-xl mb-8 shadow-lg shadow-cyan-950/50 hover:border-cyan-400/60 transition-all duration-300 group">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/AIRA ICON/fairy-gif.gif"
              alt="AIRA AI"
              width={28}
              height={28}
              className="object-cover scale-125"
              unoptimized
            />
          </div>
          <span className="text-xs font-mono font-semibold text-cyan-300 tracking-wider">
            AIRA AI ADMINISTRATOR ONLINE
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
        </div>

        {/* HERO TITLE */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-heading tracking-tight max-w-4xl leading-[1.08] drop-shadow-lg">
          Turn Your Real Life into an <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-400 drop-shadow-sm">
            Epic RPG Quest
          </span>
        </h1>

        {/* HERO DESCRIPTION */}
        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
          Level up your physical attributes, master daily habits, conquer workout quests, and let AI Administrator{" "}
          <span className="text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-500/50">AIRA</span> guide your evolution.
        </p>

        {/* HERO CTA BUTTONS */}
        <div suppressHydrationWarning className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="default"
            size="lg"
            asChild
            className="w-full sm:w-auto px-8 h-13 text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-[16px] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Link href="/register" className="flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto px-8 h-13 text-sm font-bold border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-500/15 hover:border-cyan-400 text-cyan-200 rounded-[16px] backdrop-blur-md transition-all duration-300"
          >
            <Link href="/login" className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Sign In to Character</span>
            </Link>
          </Button>
        </div>

        {/* HERO STAT HIGHLIGHT CARDS */}
        <div suppressHydrationWarning className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
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
              System Guidance
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

      {/* FEATURE SHOWCASE SECTION */}
      <section suppressHydrationWarning className="px-6 py-20 bg-[#050a18]/90 border-t border-cyan-500/10 relative z-10">
        <div suppressHydrationWarning className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-3 text-[11px] border-cyan-500/30 bg-cyan-950/30 text-cyan-400 font-mono tracking-widest uppercase"
            >
              CORE MODULES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
              Engineered for Personal Mastery
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2 font-sans max-w-xl mx-auto">
              Transform your daily discipline with real RPG feedback metrics, equipment progression, and AI analysis.
            </p>
          </div>

          <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-cyan-500/15 hover:border-cyan-400/40 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-[16px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">AI System Guidance</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Autonomous feedback loops provided by system administrator AIRA.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-t border-white/5 pt-3">
                Monitors consistency decay, analyzes performance drops, and recalibrates attribute gains dynamically.
              </p>
            </div>

            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-emerald-500/15 hover:border-emerald-400/40 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-[16px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">Attribute Calibration</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Strength, Discipline, Focus, Knowledge, Recovery, Endurance & Consistency.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-t border-white/5 pt-3">
                Visualize your growth curve through dynamic radar charts and real-time XP accumulation metrics.
              </p>
            </div>

            <div className="p-6 rounded-[24px] bg-[#0a1024]/90 border border-purple-500/15 hover:border-purple-400/40 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-[16px] bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">Tower Ascension</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                Test your real-world progress against scaling boss battles.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans border-t border-white/5 pt-3">
                Climb floor levels by fulfilling quest chains and maintaining daily attribute streaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
      <section suppressHydrationWarning className="px-6 py-16 relative z-10 border-t border-cyan-500/10 bg-gradient-to-b from-[#050a18] to-[#080f26]">
        <div suppressHydrationWarning className="max-w-4xl mx-auto text-center p-10 rounded-[30px] bg-gradient-to-br from-cyan-950/30 via-[#0a1024] to-indigo-950/30 border border-cyan-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-bold text-white font-heading mb-3">
            Ready to Awaken Your Ascendant Potential?
          </h2>
          <p className="text-sm text-slate-300 mb-8 max-w-xl mx-auto">
            Create your account or log in to resume your character progression matrix.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="px-8 h-12 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/25"
            >
              <Link href="/register" className="flex items-center gap-2">
                <span>Create Account</span>
                <UserPlus className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="px-8 h-12 font-bold border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 rounded-xl"
            >
              <Link href="/login" className="flex items-center gap-2">
                <span>Log In Now</span>
                <LogIn className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer suppressHydrationWarning className="w-full px-6 py-8 border-t border-cyan-500/10 text-center text-xs text-slate-500 font-mono">
        ASCEND OS &copy; 2026 — AI-POWERED LIFE RPG PLATFORM
      </footer>
    </div>
  );
}
