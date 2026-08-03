import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Dumbbell,
  Award,
  Flame,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#0B1020] text-slate-100 relative overflow-hidden">
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative px-6 py-20 md:py-32 max-w-6xl mx-auto flex flex-col items-center text-center z-10">
        <Badge
          variant="default"
          className="mb-6 px-3.5 py-1 text-xs border border-blue-500/30 bg-blue-950/50 backdrop-blur-sm text-blue-300"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-400 animate-pulse" />
          AI-POWERED LIFE RPG PLATFORM
        </Badge>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-heading tracking-tight max-w-4xl leading-[1.1]">
          Turn Your Real Life into an <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            Epic RPG Quest
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
          Level up your physical attributes, master habits, conquer daily
          quests, and let AI Administrator{" "}
          <span className="text-blue-400 font-semibold">Ciel</span> guide your
          evolution.
        </p>

        {/* HERO CALL TO ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="default"
            size="lg"
            asChild
            className="w-full sm:w-auto px-8 h-12 text-sm font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
          >
            <Link href="/register">
              <span>Start Journey</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto px-8 h-12 text-sm font-bold border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all"
          >
            <Link href="/login">Log In</Link>
          </Button>
        </div>

        {/* HERO BADGE / STAT HIGHLIGHTS */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="p-5 rounded-[20px] bg-[#151C33]/80 border border-white/10 backdrop-blur-sm text-center hover:border-blue-500/30 transition-all">
            <div className="text-2xl md:text-3xl font-bold font-mono text-blue-400">
              7 Core
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Attributes Tracked
            </div>
          </div>

          <div className="p-5 rounded-[20px] bg-[#151C33]/80 border border-white/10 backdrop-blur-sm text-center hover:border-emerald-500/30 transition-all">
            <div className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              Real-Time
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              XP & Habit Loops
            </div>
          </div>

          <div className="p-5 rounded-[20px] bg-[#151C33]/80 border border-white/10 backdrop-blur-sm text-center hover:border-purple-500/30 transition-all">
            <div className="text-2xl md:text-3xl font-bold font-mono text-purple-400">
              Ciel AI
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              System Guidance
            </div>
          </div>

          <div className="p-5 rounded-[20px] bg-[#151C33]/80 border border-white/10 backdrop-blur-sm text-center hover:border-amber-500/30 transition-all">
            <div className="text-2xl md:text-3xl font-bold font-mono text-[#F6C453]">
              Ascension
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Tower & Boss Raids
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE SECTION */}
      <section className="px-6 py-20 bg-[#0B1020]/90 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-3 text-[11px] border-white/10 text-slate-400"
            >
              CORE MODULES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading tracking-tight">
              Engineered for Personal Mastery
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-2 font-sans max-w-xl mx-auto">
              Transform your daily discipline with real RPG feedback metrics and
              AI analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#151C33]/90 border-white/10 hover:border-blue-500/40 transition-all duration-300 group">
              <CardHeader>
                <div className="w-11 h-11 rounded-[14px] bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">AI System Guidance</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Autonomous feedback loops provided by system administrator
                  Ciel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Monitors consistency decay, analyzes performance drops, and
                  recalibrates attribute gains dynamically.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#151C33]/90 border-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
              <CardHeader>
                <div className="w-11 h-11 rounded-[14px] bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Attribute Calibration</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Strength, Discipline, Focus, Knowledge, Recovery, Endurance &
                  Consistency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Visualize your growth curve through dynamic radar charts and
                  real-time XP accumulation metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#151C33]/90 border-white/10 hover:border-purple-500/40 transition-all duration-300 group">
              <CardHeader>
                <div className="w-11 h-11 rounded-[14px] bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Tower Ascension</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Test your real-world progress against scaling boss battles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Climb floor levels by fulfilling quest chains and maintaining
                  daily attribute streaks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-6 py-8 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
        ASCEND OS &copy; {new Date().getFullYear()} — AI-POWERED LIFE RPG
      </footer>
    </div>
  );
}
