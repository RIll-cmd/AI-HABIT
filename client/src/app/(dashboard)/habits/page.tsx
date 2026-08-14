"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useHabitStore } from "@/features/habits/store/useHabitStore";
import { HabitCard } from "@/features/habits/components";
import { HabitHeatmap } from "@/features/habits/components/HabitHeatmap";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import {
  Flame,
  Plus,
  Target,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Compass,
  TrendingUp,
} from "lucide-react";
import { playUIMenuSFX } from "@/utils/audio";

export default function HabitsDashboardPage() {
  const { habits, isLoading, loadHabits } = useHabitStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const activeHabits = useMemo(
    () => habits.filter((h) => h.status === "ACTIVE"),
    [habits]
  );

  const averageStrength = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    const sum = activeHabits.reduce(
      (acc, h) => acc + (h.metrics?.habitStrength || 0),
      0
    );
    return Math.round(sum / activeHabits.length);
  }, [activeHabits]);

  const totalStreaks = useMemo(() => {
    return activeHabits.reduce(
      (acc, h) => acc + (h.metrics?.currentStreak || 0),
      0
    );
  }, [activeHabits]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    habits.forEach((h) => {
      if (h.category) cats.add(h.category);
    });
    return ["ALL", ...Array.from(cats)];
  }, [habits]);

  const filteredHabits = useMemo(() => {
    return activeHabits.filter((h) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.description &&
          h.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.category &&
          h.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "ALL" ||
        (h.category &&
          h.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [activeHabits, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 pb-12 text-slate-100 font-sans animate-in fade-in duration-300 relative">
      {/* Background Floating Runes & Particle Field */}
      <FloatingRuneField density="low" className="opacity-60" />

      {/* ========================================================= */}
      {/* HERO & PROTOCOL MATRIX HEADER */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1126]/95 via-[#070D1E]/95 to-[#040814]/98 border border-cyan-500/20 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes & Ambient Particles */}
        <FloatingRuneField density="high" />

        {/* Animated Cyber Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Holographic Habit Matrix Icon Pedestal */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#0f1a3d] to-[#070c20] border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
              <Zap className="w-8 h-8 drop-shadow-[0_0_12px_rgba(6,182,212,0.7)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  KINETIC PROTOCOL MATRIX
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DISCIPLINE ENGINE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Habits & Ascension Protocols
              </h1>
              <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                Forge unbreakable daily routines, elevate discipline multipliers, and transform neural repetitions into sovereign character stats.
              </p>
            </div>
          </div>

          <Link
            href="/habits/create"
            onClick={() => playUIMenuSFX()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase font-mono shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Construct Protocol</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TELEMETRY METRICS DECK */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Protocols Card */}
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              Active Protocols
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-mono">{activeHabits.length}</span>
            <span className="text-[11px] text-slate-400 block font-sans mt-0.5">Active daily routines</span>
          </div>
        </div>

        {/* Protocol Strength Card */}
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              Avg Habit Strength
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-cyan-400 font-mono">{averageStrength}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-1.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)] rounded-full transition-all duration-1000"
                style={{ width: `${averageStrength}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Streak Count Card */}
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-amber-500/20 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              Discipline Streaks
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Flame className="w-4 h-4 fill-amber-400/20" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-400 font-mono">{totalStreaks}d</span>
            <span className="text-[11px] text-slate-400 block font-sans mt-0.5">Combined streak volume</span>
          </div>
        </div>

        {/* Completion Consistency Card */}
        <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-emerald-500/20 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 tracking-wider">
              Consistency Index
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400 font-mono">87%</span>
            <span className="text-[11px] text-slate-400 block font-sans mt-0.5">Execution rating</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTER & SEARCH TOOLBAR */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 rounded-[22px] p-3.5 sm:p-4 shadow-lg backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search protocol by name, stat, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060B18] border border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUIMenuSFX();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold uppercase transition-all shrink-0 cursor-pointer border ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-black"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVE HABITS GRID */}
      {/* ========================================================= */}
      {isLoading ? (
        <div className="text-center py-20 bg-gradient-to-br from-[#0C1226]/80 via-[#080E20]/80 to-[#050914]/90 border border-cyan-500/20 rounded-[26px] p-8 backdrop-blur-xl">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
          <p className="text-slate-400 mt-4 text-xs font-mono">Syncing neural habit telemetry...</p>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="bg-gradient-to-br from-[#0C1226]/90 via-[#080E20]/90 to-[#050914]/95 border-2 border-dashed border-cyan-500/30 rounded-[26px] p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold font-heading text-white tracking-tight">
            NO ACTIVE PROTOCOLS FOUND
          </h3>
          <p className="text-xs text-slate-400 max-w-md font-sans">
            {searchQuery
              ? "No habit protocols matched your search criteria. Try modifying your filter."
              : "Your habit protocol deck is empty. Initialize your first daily protocol to start building neural discipline."}
          </p>
          <Link
            href="/habits/create"
            onClick={() => playUIMenuSFX()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase font-mono shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 mt-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Construct First Protocol</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* ASCENSION CONSISTENCY HEATMAP */}
      {/* ========================================================= */}
      <div className="mt-8">
        <HabitHeatmap characterId="char-id-123" />
      </div>
    </div>
  );
}

