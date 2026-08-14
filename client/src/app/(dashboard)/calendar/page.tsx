"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useKanbanMissionStore } from "@/features/habits/store/useKanbanMissionStore";
import { CreateQuestModal } from "@/features/habits/components/CreateQuestModal";
import { KanbanQuest } from "@/features/habits/types/kanban";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Flame,
  Shield,
  Zap,
  Award,
  Sparkles,
  Loader2,
  Plus,
  RefreshCw,
  Compass,
  CheckCircle2,
  Activity,
  Layers,
  Clock,
  ChevronRight,
  AlertCircle,
  Tag,
  Check,
} from "lucide-react";

import { API_BASE_URL } from "@/constants";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { CURRENCY_LORE } from "@/features/lore/loreData";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { CurrencyIcon } from "@/components/CurrencyDisplay";

interface Snapshot {
  id: string;
  date: string;
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

interface HoveredTooltipData {
  dateStr: string;
  dateObj: Date;
  snapshot?: Snapshot;
  missions: KanbanQuest[];
  x: number;
  y: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { character, refetch } = useCharacterStore();
  const { quests, updateQuestStatus } = useKanbanMissionStore();

  const [snapshots, setSnapshots] = useState<Record<string, Snapshot>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isBuyingShield, setIsBuyingShield] = useState(false);

  // Unclipped fixed tooltip state
  const [hoveredData, setHoveredData] = useState<HoveredTooltipData | null>(null);

  // Selected date for Chrono Intel & deadline creation
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isCreateDeadlineOpen, setIsCreateDeadlineOpen] = useState(false);
  const [deadlineFilter, setDeadlineFilter] = useState<"ALL" | "UPCOMING" | "TODAY" | "COMPLETED">("ALL");

  const fetchSnapshots = async () => {
    if (!character?.id) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/habits/${character.id}/calendar-snapshots`
      );
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, Snapshot> = {};
        (data.snapshots || []).forEach((sn: any) => {
          const dateKey = new Date(sn.date).toISOString().split("T")[0];
          map[dateKey] = sn;
        });
        setSnapshots(map);
      }
    } catch (e) {
      console.error("Failed to fetch calendar snapshots", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, [character?.id]);

  const handleSimulateDecay = async () => {
    if (!character?.id) return;
    setIsSimulating(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/habits/${character.id}/decay/simulate`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(
          data.shieldUsed
            ? "Midnight Decay: Streak Freeze Shield auto-activated! Streak preserved."
            : "Midnight Decay Simulation executed! Habit decay evaluated."
        );
        await refetch();
        await fetchSnapshots();
      } else {
        toast.error("Decay simulation failed.");
      }
    } catch (e) {
      toast.error("Network error during decay simulation.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleBuyShield = async () => {
    if (!character?.id) return;
    if ((character?.gold || 0) < 300) {
      toast.error("Insufficient Gold. Streak Freeze Shield costs 300 Gold.");
      return;
    }

    setIsBuyingShield(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/habits/${character.id}/buy-streak-freeze`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(`Purchased 1 Streak Freeze Shield! (Total: ${data.streakFreezes})`);
        await refetch();
      } else {
        toast.error("Failed to purchase Streak Freeze Shield.");
      }
    } catch (e) {
      toast.error("Network error purchasing shield.");
    } finally {
      setIsBuyingShield(false);
    }
  };

  // Map quests to their due dates
  const questsByDueDate = useMemo(() => {
    const map: Record<string, KanbanQuest[]> = {};
    quests.forEach((q) => {
      if (q.dueDate) {
        const dateKey = q.dueDate.split("T")[0];
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(q);
      }
    });
    return map;
  }, [quests]);

  // Generate 52 weeks (364 days) grid centered on today (26 weeks past, today in middle, 25 weeks future)
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { daysGrid, monthHeaders } = useMemo(() => {
    const grid: {
      dateStr: string;
      dateObj: Date;
      snapshot?: Snapshot;
      missions: KanbanQuest[];
      weekIndex: number;
      dayOfWeek: number;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];
    const months: { label: string; weekIndex: number; isCurrentMonth: boolean }[] = [];
    let lastMonth = -1;

    // 26 weeks in past (-182 days) to 25 weeks in future (+181 days) = 364 days / 52 columns
    for (let i = -182; i <= 181; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const weekIndex = Math.floor((i + 182) / 7);
      const dayOfWeek = d.getDay();
      const isToday = dateStr === todayStr;
      const isFuture = dateStr > todayStr;

      const m = d.getMonth();
      if (m !== lastMonth && (dayOfWeek === 0 || i === -182)) {
        months.push({
          label: MONTH_NAMES[m],
          weekIndex,
          isCurrentMonth: m === today.getMonth(),
        });
        lastMonth = m;
      }

      grid.push({
        dateStr,
        dateObj: d,
        snapshot: snapshots[dateStr],
        missions: questsByDueDate[dateStr] || [],
        weekIndex,
        dayOfWeek,
        isToday,
        isFuture,
      });
    }

    return { daysGrid: grid, monthHeaders: months };
  }, [today, todayStr, snapshots, questsByDueDate]);

  // Calculate summary metrics strictly from actual snapshots
  const activeDaysCount = useMemo(
    () => Object.values(snapshots).filter((s) => (s.completedCount || 0) > 0).length,
    [snapshots]
  );
  const streakFreezes = character?.streakFreezes || 0;

  // Calculate current & best streak dynamically
  const { currentStreak, bestStreak } = useMemo(() => {
    let currS = 0;
    let bestS = 0;

    const completedDates = Object.keys(snapshots)
      .filter((d) => (snapshots[d]?.completedCount || 0) > 0)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (completedDates.length > 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const lastDate = completedDates[completedDates.length - 1];
      if (lastDate === todayStr || lastDate === yesterdayStr) {
        currS = 1;
        for (let i = completedDates.length - 1; i > 0; i--) {
          const curr = new Date(completedDates[i]);
          const prev = new Date(completedDates[i - 1]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            currS++;
          } else {
            break;
          }
        }
      }

      let tempStreak = 1;
      bestS = 1;
      for (let i = 1; i < completedDates.length; i++) {
        const prev = new Date(completedDates[i - 1]);
        const curr = new Date(completedDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        if (tempStreak > bestS) {
          bestS = tempStreak;
        }
      }
    }

    return { currentStreak: currS, bestStreak: bestS };
  }, [snapshots, todayStr]);

  // Selected date intel
  const selectedSnapshot = snapshots[selectedDate];
  const selectedMissions = questsByDueDate[selectedDate] || [];

  // Filtered Deadlines List
  const allDeadlinesWithQuests = useMemo(() => {
    return quests.filter((q) => !!q.dueDate).sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });
  }, [quests]);

  const filteredDeadlines = useMemo(() => {
    return allDeadlinesWithQuests.filter((q) => {
      const dateKey = q.dueDate!.split("T")[0];
      if (deadlineFilter === "TODAY") return dateKey === todayStr;
      if (deadlineFilter === "UPCOMING") return q.status !== "Completed" && dateKey >= todayStr;
      if (deadlineFilter === "COMPLETED") return q.status === "Completed";
      return true;
    });
  }, [allDeadlinesWithQuests, deadlineFilter, todayStr]);

  const getCellColor = (
    rate?: number,
    hasDeadlines?: boolean,
    isSelected?: boolean,
    isToday?: boolean,
    isFuture?: boolean
  ) => {
    if (isSelected) {
      return "border-cyan-300 ring-2 ring-cyan-400/80 scale-125 z-20 shadow-[0_0_15px_#06b6d4]";
    }
    if (isToday) {
      return "bg-cyan-950/90 border-cyan-300 ring-2 ring-cyan-400 shadow-[0_0_15px_#06b6d4] scale-110 z-10";
    }
    if (isFuture) {
      return hasDeadlines
        ? "bg-[#0d1430] border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        : "bg-[#050914] border-slate-800/60 hover:border-slate-600";
    }
    if (rate === undefined || rate === null || rate === 0) {
      return hasDeadlines
        ? "bg-[#0d1430] border-purple-500/70 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
        : "bg-[#0A1024] border-slate-800 hover:border-slate-600";
    }
    if (rate <= 33) return "bg-cyan-950/90 border-cyan-800/60 shadow-[0_0_6px_rgba(6,182,212,0.2)]";
    if (rate <= 66) return "bg-cyan-700/90 border-cyan-500/70 shadow-[0_0_8px_rgba(6,182,212,0.4)]";
    if (rate < 100) return "bg-cyan-500 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.7)]";
    return "bg-cyan-300 border-white shadow-[0_0_16px_#06b6d4]";
  };

  return (
    <div className="space-y-6 pb-16 font-sans animate-in fade-in duration-300 relative text-slate-100">
      {/* Background Floating Runes & Moving Particles */}
      <FloatingRuneField density="low" className="opacity-60" />

      {/* ========================================================= */}
      {/* HERO & CHRONO-TELEMETRY HEADER */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1126]/95 via-[#070D1E]/95 to-[#040814]/98 border border-cyan-500/20 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes & Moving Particles */}
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
            {/* Holographic Calendar Icon Pedestal */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#0f1a3d] to-[#070c20] border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
              <CalendarIcon className="w-8 h-8 drop-shadow-[0_0_12px_rgba(6,182,212,0.7)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  CHRONO-SPATIAL AUDIT
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center gap-1">
                  365-DAY HORIZON (CENTERED)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Temporal Chrono Matrix
              </h1>
              <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                Inspect 365-day habit execution density centered on today, inspect upcoming mission deadlines, schedule custom directives, and maintain active streak freeze shields.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto justify-end">
            <button
              onClick={() => {
                playUIMenuSFX();
                setSelectedDate(todayStr);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jump to Today (Center)</span>
            </button>

            <button
              onClick={() => {
                playUIMenuSFX();
                setIsCreateDeadlineOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl font-extrabold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Deadline</span>
            </button>

            <div className="bg-gradient-to-r from-purple-950/80 to-[#100b24] text-purple-300 border border-purple-500/50 font-mono text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
              <Shield className="w-4 h-4 text-purple-400 fill-purple-400/20" />
              <span>Shields: {streakFreezes} / 3</span>
            </div>

            <button
              onClick={() => {
                playUIMenuSFX();
                handleBuyShield();
              }}
              disabled={isBuyingShield || streakFreezes >= 3}
              className="px-3.5 py-2.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isBuyingShield ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>Buy Shield (300g)</span>
            </button>

            <button
              onClick={() => {
                playUIMenuSFX();
                handleSimulateDecay();
              }}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl font-extrabold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isSimulating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Simulate Midnight</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 TELEMETRY SUMMARY CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Logged Days */}
        <SystemTooltip
          title={CURRENCY_LORE.loggedDays.name}
          category={CURRENCY_LORE.loggedDays.category}
          rarity={CURRENCY_LORE.loggedDays.rarity}
          description={CURRENCY_LORE.loggedDays.description}
          lore={CURRENCY_LORE.loggedDays.lore}
          mechanics={CURRENCY_LORE.loggedDays.mechanics}
          tags={CURRENCY_LORE.loggedDays.tags}
          className="w-full"
        >
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 hover:border-cyan-400/50 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all cursor-help backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                Active Days
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-white font-mono">{activeDaysCount}</span>
              <span className="text-[11px] text-slate-400 block font-sans mt-0.5">365-day recorded sessions</span>
            </div>
          </div>
        </SystemTooltip>

        {/* Active Habit Streak */}
        <SystemTooltip
          title={CURRENCY_LORE.activeStreak.name}
          category={CURRENCY_LORE.activeStreak.category}
          rarity={CURRENCY_LORE.activeStreak.rarity}
          description={CURRENCY_LORE.activeStreak.description}
          lore={CURRENCY_LORE.activeStreak.lore}
          mechanics={CURRENCY_LORE.activeStreak.mechanics}
          tags={CURRENCY_LORE.activeStreak.tags}
          className="w-full"
        >
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-amber-500/20 hover:border-amber-400/50 shadow-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all cursor-help backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Current Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4 fill-amber-400/30 animate-pulse" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-amber-400 font-mono">{currentStreak}d</span>
              <span className="text-[11px] text-slate-400 block font-sans mt-0.5">Consecutive active execution</span>
            </div>
          </div>
        </SystemTooltip>

        {/* Best Streak Record */}
        <SystemTooltip
          title={CURRENCY_LORE.bestStreak.name}
          category={CURRENCY_LORE.bestStreak.category}
          rarity={CURRENCY_LORE.bestStreak.rarity}
          description={CURRENCY_LORE.bestStreak.description}
          lore={CURRENCY_LORE.bestStreak.lore}
          mechanics={CURRENCY_LORE.bestStreak.mechanics}
          tags={CURRENCY_LORE.bestStreak.tags}
          className="w-full"
        >
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-purple-500/20 hover:border-purple-400/50 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all cursor-help backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                Record Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 text-purple-300" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-purple-300 font-mono">{bestStreak}d</span>
              <span className="text-[11px] text-slate-400 block font-sans mt-0.5">All-time peak consistency</span>
            </div>
          </div>
        </SystemTooltip>

        {/* Protection Shields */}
        <SystemTooltip
          title={CURRENCY_LORE.protectionShields.name}
          category={CURRENCY_LORE.protectionShields.category}
          rarity={CURRENCY_LORE.protectionShields.rarity}
          description={CURRENCY_LORE.protectionShields.description}
          lore={CURRENCY_LORE.protectionShields.lore}
          mechanics={CURRENCY_LORE.protectionShields.mechanics}
          tags={CURRENCY_LORE.protectionShields.tags}
          className="w-full"
        >
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-emerald-500/20 hover:border-emerald-400/50 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all cursor-help backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Streak Shields
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 fill-emerald-400/20" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-emerald-400 font-mono">{streakFreezes} / 3</span>
              <span className="text-[11px] text-slate-400 block font-sans mt-0.5">Active decay buffers</span>
            </div>
          </div>
        </SystemTooltip>
      </div>

      {/* ========================================================= */}
      {/* 52-WEEK TEMPORAL CONTRIBUTION GRID (CENTERED ON TODAY) */}
      {/* ========================================================= */}
      <div className="p-6 md:p-7 rounded-[26px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/25 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes */}
        <FloatingRuneField density="low" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-cyan-500/15 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
                52-Week Chrono Matrix Horizon
              </h3>
              <p className="text-[10.5px] font-mono text-slate-400">
                Centered on Today • Past history on left, future deadline milestones on right
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Inactive</span>
            <div className="w-3.5 h-3.5 rounded-sm bg-[#060B18] border border-slate-800" />
            <div className="w-3.5 h-3.5 rounded-sm bg-cyan-950 border border-cyan-800" />
            <div className="w-3.5 h-3.5 rounded-sm bg-cyan-700 border border-cyan-600" />
            <div className="w-3.5 h-3.5 rounded-sm bg-cyan-500 border border-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-sm bg-cyan-300 border border-white shadow-[0_0_10px_#06b6d4]" />
            <span className="text-cyan-300 font-bold">100%</span>

            <span className="text-slate-600 mx-1">•</span>
            <div className="flex items-center gap-1 text-cyan-300 font-bold">
              <div className="w-3.5 h-3.5 rounded-sm bg-cyan-950 border border-cyan-300 ring-1 ring-cyan-400 shadow-[0_0_8px_#06b6d4] flex items-center justify-center text-[7px] text-cyan-300">
                ●
              </div>
              <span>Today</span>
            </div>

            <span className="text-slate-600 mx-1">•</span>
            <div className="flex items-center gap-1 text-purple-300 font-bold">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#0d1430] border border-purple-500/80 shadow-[0_0_6px_rgba(168,85,247,0.6)] flex items-center justify-center text-[7px] text-purple-300">
                ◆
              </div>
              <span>Deadline</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Component */}
        <div className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 font-mono text-xs gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Syncing Temporal Matrix Telemetry...</span>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[800px]">
                {/* Month Indicators Row: Spaced Across 52 Columns */}
                <div className="grid grid-cols-52 gap-1.5 mb-2.5 pl-8 pr-2 text-[10.5px] font-mono select-none">
                  {monthHeaders.map((mh, idx) => (
                    <div
                      key={idx}
                      style={{ gridColumnStart: mh.weekIndex + 1 }}
                      className={`font-bold truncate ${
                        mh.isCurrentMonth
                          ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] flex items-center gap-0.5"
                          : "text-slate-400"
                      }`}
                    >
                      {mh.isCurrentMonth && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                      )}
                      <span>{mh.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5 items-start">
                  {/* Weekday Labels (Mon, Wed, Fri) */}
                  <div className="grid grid-rows-7 gap-1.5 text-[9.5px] font-mono text-slate-500 pt-0.5 select-none w-7 text-right">
                    <span className="h-3.5 leading-none"></span>
                    <span className="h-3.5 leading-none">Mon</span>
                    <span className="h-3.5 leading-none"></span>
                    <span className="h-3.5 leading-none">Wed</span>
                    <span className="h-3.5 leading-none"></span>
                    <span className="h-3.5 leading-none">Fri</span>
                    <span className="h-3.5 leading-none"></span>
                  </div>

                  {/* 52 Columns x 7 Rows Grid (Centered on Today at Column 26) */}
                  <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
                    {daysGrid.map((day, idx) => {
                      const rate = day.snapshot?.completionRate;
                      const hasDeadlines = day.missions.length > 0;
                      const isSelected = selectedDate === day.dateStr;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            playUIMenuSFX();
                            setSelectedDate(day.dateStr);
                          }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredData({
                              dateStr: day.dateStr,
                              dateObj: day.dateObj,
                              snapshot: day.snapshot,
                              missions: day.missions,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }}
                          onMouseLeave={() => setHoveredData(null)}
                          className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-all duration-150 relative ${getCellColor(
                            rate,
                            hasDeadlines,
                            isSelected,
                            day.isToday,
                            day.isFuture
                          )} hover:scale-150 hover:z-30 hover:border-white hover:shadow-[0_0_15px_#06b6d4]`}
                        >
                          {/* Deadline Indicator Dot */}
                          {hasDeadlines && (
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,1)] animate-pulse pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* UNCLIPPED FIXED PORTAL HOVER TOOLTIP */}
      {/* ========================================================= */}
      {hoveredData && (
        <div
          style={{
            position: "fixed",
            left: `${hoveredData.x}px`,
            top:
              hoveredData.y < 200
                ? `${hoveredData.y + 24}px`
                : `${hoveredData.y - 12}px`,
            transform:
              hoveredData.y < 200
                ? "translate(-50%, 0)"
                : "translate(-50%, -100%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="w-72 p-3.5 rounded-2xl bg-gradient-to-br from-[#0C1226]/98 via-[#080E20]/98 to-[#050914]/98 border border-cyan-400 text-slate-100 text-xs font-mono shadow-[0_0_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Tooltip Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2.5">
            <span className="font-bold text-cyan-300">{hoveredData.dateStr}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {WEEKDAYS[hoveredData.dateObj.getDay()]}
            </span>
          </div>

          {/* Habit Snapshots */}
          <div className="space-y-1 mb-2.5 text-[11px]">
            {hoveredData.snapshot ? (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Habits Completed:</span>
                  <strong className="text-emerald-400">
                    {hoveredData.snapshot.completedCount} / {hoveredData.snapshot.totalCount}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Execution Quota:</span>
                  <strong className="text-cyan-300">
                    {hoveredData.snapshot.completionRate}%
                  </strong>
                </div>
              </>
            ) : (
              <div className="text-[10.5px] text-slate-500 italic">
                No habit activity recorded.
              </div>
            )}
          </div>

          {/* Missions / Deadlines Section */}
          {hoveredData.missions.length > 0 && (
            <div className="pt-2 border-t border-purple-500/30 space-y-1.5">
              <div className="text-[10px] font-bold uppercase text-purple-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Deadlines Due ({hoveredData.missions.length})</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-hidden">
                {hoveredData.missions.map((m) => (
                  <div
                    key={m.id}
                    className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-[10px]"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="px-1 py-0.2 rounded bg-purple-900 text-purple-300 font-extrabold text-[9px]">
                        {m.rank}
                      </span>
                      <span className="truncate text-slate-200">{m.title}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        m.status === "Completed"
                          ? "bg-emerald-950 text-emerald-400"
                          : "bg-amber-950 text-amber-300"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 pt-1.5 border-t border-slate-800 text-[9px] text-cyan-400/70 text-center">
            Click to inspect date & create deadline
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SELECTED DATE CHRONO INTEL & DEADLINES MANAGEMENT */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Column: Daily Intel for Selected Date */}
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/25 shadow-xl backdrop-blur-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-cyan-300">
                    Selected Cycle Intel
                  </h4>
                  <p className="text-sm font-extrabold font-heading text-white">
                    {selectedDate}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                {selectedDate === todayStr ? "TODAY" : "ARCHIVE"}
              </span>
            </div>

            {/* Daily Habit Stats */}
            <div className="space-y-2.5 font-mono text-xs mb-4">
              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Habits Completed:</span>
                <span className="text-white font-bold">
                  {selectedSnapshot ? `${selectedSnapshot.completedCount} / ${selectedSnapshot.totalCount}` : "0 / 0"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Completion Quota:</span>
                <span className="text-cyan-300 font-bold">
                  {selectedSnapshot ? `${selectedSnapshot.completionRate}%` : "0%"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Mission Deadlines:</span>
                <span className="text-purple-300 font-bold">
                  {selectedMissions.length} Scheduled
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playUIMenuSFX();
              setIsCreateDeadlineOpen(true);
            }}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Deadline For {selectedDate}</span>
          </button>
        </div>

        {/* Right 2 Columns: Mission Deadlines Matrix */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-purple-500/25 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-purple-300">
                  Mission Deadlines Directive Deck
                </h4>
                <p className="text-[11px] font-sans text-slate-400">
                  Target milestones with strict completion schedules
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060B18] border border-slate-800 text-[10px] font-mono font-bold">
              {(["ALL", "UPCOMING", "TODAY", "COMPLETED"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    playUIMenuSFX();
                    setDeadlineFilter(filter);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    deadlineFilter === filter
                      ? "bg-purple-900/80 text-purple-200 border border-purple-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Deadlines List */}
          {filteredDeadlines.length === 0 ? (
            <div className="py-12 text-center space-y-3 font-mono">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                No mission deadlines found for the <span className="text-purple-300">{deadlineFilter}</span> filter.
              </p>
              <button
                onClick={() => {
                  playUIMenuSFX();
                  setIsCreateDeadlineOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Directive Deadline</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {filteredDeadlines.map((q) => {
                const isCompleted = q.status === "Completed";
                const dateKey = q.dueDate!.split("T")[0];
                const isToday = dateKey === todayStr;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? "bg-[#060B18]/60 border-slate-800/80 opacity-70"
                        : isToday
                        ? "bg-gradient-to-r from-amber-950/30 via-[#0a1024] to-[#060b18] border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-[#060B18]/90 border-purple-500/20 hover:border-purple-500/40"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Checkbox toggle */}
                      <button
                        onClick={() => {
                          updateQuestStatus(
                            q.id,
                            isCompleted ? "To Do" : "Completed"
                          );
                        }}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : "border-slate-700 bg-slate-900 hover:border-purple-400"
                        }`}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-extrabold">
                            RANK {q.rank}
                          </span>
                          <span className="text-xs font-mono font-bold text-white truncate">
                            {q.title}
                          </span>
                        </div>

                        {q.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                            {q.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono text-xs">
                      {/* Due Date Badge */}
                      <div
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold border flex items-center gap-1.5 ${
                          isToday
                            ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                            : "bg-purple-950/60 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>Due: {dateKey}</span>
                      </div>

                      {/* Reward Chips */}
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                        <CurrencyIcon type="EXP" size="xs" />
                        <span className="text-[10.5px] text-cyan-300 font-bold">+{q.expReward}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Deadline Modal */}
      <CreateQuestModal
        isOpen={isCreateDeadlineOpen}
        onClose={() => setIsCreateDeadlineOpen(false)}
        initialDueDate={selectedDate}
      />
    </div>
  );
}


