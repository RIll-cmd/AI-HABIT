"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { calculateLevelData } from "@/features/progression/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Shield,
  Dumbbell,
  BookOpen,
  Target,
  Heart,
  RefreshCw,
  Flame,
  History,
  Swords,
  TrendingUp,
  Award,
  Clock,
  ArrowUpRight,
  PieChart,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { RadarDataPoint } from "@/components/ui/StatRadarChart";
import { useCombatStats } from "@/features/inventory/hooks/useCombatStats";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useEffect } from "react";

const StatRadarChart = dynamic(
  () => import("@/components/ui/StatRadarChart").then((mod) => mod.StatRadarChart),
  { ssr: false }
);

export default function ProfilePage() {
  const { character, gainExp } = useCharacterStore();
  const { fetchInventory } = useInventoryStore();
  const finalStats = useCombatStats();

  useEffect(() => {
    fetchInventory("char-id-123");
  }, [fetchInventory]);

  const stats = character?.stats;
  const history = character?.history || [];
  const totalExp = character?.exp || 0;
  const levelData = calculateLevelData(totalExp);

  // 8 Core Stats mapping for the UI Grid
  const statList = [
    {
      key: "strength",
      label: "Strength",
      abbr: "STR",
      value: finalStats.strength,
      description: "Physical power & combat output",
      icon: Dumbbell,
      color: "text-red-400",
      bgColor: "bg-red-950/40",
      borderColor: "border-red-500/20",
    },
    {
      key: "knowledge",
      label: "Knowledge",
      abbr: "KNW",
      value: finalStats.knowledge,
      description: "Intellectual depth & tactical insight",
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-950/40",
      borderColor: "border-blue-500/20",
    },
    {
      key: "discipline",
      label: "Discipline",
      abbr: "DIS",
      value: finalStats.discipline,
      description: "Willpower & defense against friction",
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-950/40",
      borderColor: "border-amber-500/20",
    },
    {
      key: "focus",
      label: "Focus",
      abbr: "FCS",
      value: finalStats.focus,
      description: "Deep work capacity & accuracy",
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-950/40",
      borderColor: "border-purple-500/20",
    },
    {
      key: "endurance",
      label: "Endurance",
      abbr: "END",
      value: finalStats.endurance,
      description: "Stamina & maximum HP pool",
      icon: Heart,
      color: "text-emerald-400",
      bgColor: "bg-emerald-950/40",
      borderColor: "border-emerald-500/20",
    },
    {
      key: "recovery",
      label: "Recovery",
      abbr: "REC",
      value: finalStats.recovery,
      description: "Rest, energy regen & health sustain",
      icon: RefreshCw,
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/40",
      borderColor: "border-cyan-500/20",
    },
    {
      key: "consistency",
      label: "Consistency",
      abbr: "CON",
      value: finalStats.consistency,
      description: "Streak continuity & loot drop quality",
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-950/40",
      borderColor: "border-orange-500/20",
    },
    {
      key: "mastery",
      label: "Combat Mastery",
      abbr: "CMT",
      value: Math.floor(
        (finalStats.strength +
          finalStats.knowledge +
          finalStats.focus) /
          3
      ),
      description: "Synergistic combat efficiency",
      icon: Swords,
      color: "text-yellow-400",
      bgColor: "bg-yellow-950/40",
      borderColor: "border-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO & CORE IDENTITY SECTION */}
      <div className="relative rounded-[24px] bg-[#151C33] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Character Identity Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-[22px] border-2 border-blue-500/40 shadow-xl shadow-blue-500/20">
                <AvatarImage
                  src={character?.avatar || "/avatars/shadow-monarch.png"}
                  alt={character?.name || "Shadow Monarch"}
                />
                <AvatarFallback className="rounded-[22px] bg-gradient-to-br from-blue-600 to-indigo-900 text-white font-bold text-xl font-heading">
                  {character?.name
                    ? character.name.substring(0, 2).toUpperCase()
                    : "SM"}
                </AvatarFallback>
              </Avatar>

              {/* STAT POP ANIMATION: Level Badge */}
              <motion.div
                key={`lvl-${levelData.currentLevel}`}
                initial={{ scale: 1.35, color: "#60A5FA" }}
                animate={{ scale: 1, color: "#FFFFFF" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-[10px] bg-blue-600 text-white text-[10px] font-mono font-bold border border-blue-400 shadow-md"
              >
                LVL {levelData.currentLevel}
              </motion.div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
                  {character?.name || "Shadow Monarch"}
                </h1>

                {/* STAT POP ANIMATION: Glowing Rank Badge */}
                <motion.span
                  key={`rank-${character?.rank}`}
                  initial={{ scale: 1.25, borderColor: "#A855F7" }}
                  animate={{ scale: 1, borderColor: "rgba(168,85,247,0.6)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="px-3 py-1 rounded-[12px] bg-purple-950/80 border border-purple-500/60 text-purple-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)] flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  Rank {character?.rank || "F"}
                </motion.span>
              </div>

              <p className="text-xs text-blue-400 font-medium font-sans flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {character?.title || "Shadow Seeker"}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>
                  Gold:{" "}
                  <strong className="text-amber-400 font-bold">
                    {character?.gold ?? 0}g
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Total EXP:{" "}
                  <strong className="text-blue-300 font-bold">
                    {totalExp}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* STAT POP ANIMATION: Power Score Banner */}
          <div className="w-full md:w-auto p-4 md:px-6 rounded-[20px] bg-[#0B1020]/90 border border-blue-500/30 flex items-center justify-between md:justify-end gap-6 shadow-inner">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                Total Combat Power
              </span>
              <motion.div
                key={`power-${character?.power}`}
                initial={{ scale: 1.3, filter: "brightness(1.5)" }}
                animate={{ scale: 1, filter: "brightness(1)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
              >
                ⚡ {character?.power || 50}
              </motion.div>
            </div>
          </div>
        </div>

        {/* 2. EXP BAR & SIMULATION TEST TRIGGER SECTION */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                Level {levelData.currentLevel} Progression
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              <span className="text-blue-400 font-bold">
                {levelData.currentExpInLevel}
              </span>{" "}
              / <span>{levelData.expToNextLevel} EXP</span>{" "}
              <span className="text-slate-500">
                ({levelData.progressPercentage}%)
              </span>
            </div>
          </div>

          {/* FRAMER MOTION: Smooth Gliding Progress Bar */}
          <div className="w-full h-3 bg-[#0B1020] rounded-full border border-white/10 p-0.5 relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              initial={false}
              animate={{ width: `${levelData.progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
            />
          </div>

          {/* Test Trigger Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-sans">
              Test core RPG math engine calculations & level up trigger notifications.
            </p>
            <Button
              onClick={() => gainExp(150, "Completed Simulation Training")}
              variant="default"
              size="default"
              className="w-full sm:w-auto font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 mr-2 text-amber-300 fill-amber-300" />
              Simulate Training (+150 EXP)
            </Button>
          </div>
        </div>
      </div>

      {/* 3. STATS GRID & RADAR CHART SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold font-heading text-white tracking-tight">
              Character Attribute Matrix (8 Core Stats)
            </h2>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono text-slate-400"
          >
            RADAR MATRIX ACTIVE
          </Badge>
        </div>

        {/* RADAR GRAPH & CARDS GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Radar Chart Card */}
          <div className="lg:col-span-5 bg-[#151C33] border border-blue-500/30 rounded-[24px] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Attribute Radar Graph
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30">
                DYNAMIC
              </span>
            </div>

            <StatRadarChart
              data={statList.map((st) => ({
                subject: st.abbr,
                value: st.value,
              }))}
              primaryName="Stat Value"
              primaryColor="#3B82F6"
              secondaryColor="#8B5CF6"
              height={320}
            />

            <div className="text-[11px] text-slate-400 font-mono text-center pt-2 border-t border-white/10">
              Interactive 8-Axis Core Stat Polygon Matrix
            </div>
          </div>

          {/* 8 Core Stat Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {statList.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.key}
                className={`bg-[#151C33] border ${st.borderColor} hover:border-blue-500/40 transition-all duration-300 rounded-[18px] p-4 flex flex-col justify-between shadow-xl group relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-[14px] ${st.bgColor} border ${st.borderColor} flex items-center justify-center ${st.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-heading leading-tight">
                        {st.label}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {st.abbr}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xl font-extrabold font-mono ${st.color}`}
                  >
                    {st.value}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {st.description}
                </p>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* 4. PROGRESS HISTORY FEED SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold font-heading text-white tracking-tight">
              Progress & EXP Activity Feed
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {history.length} {history.length === 1 ? "entry" : "entries"} logged
          </span>
        </div>

        {history.length === 0 ? (
          <EmptyState
            icon={History}
            title="No Progress History Yet"
            description="Complete training simulations or daily missions to log your EXP gains, stat improvements, and level milestones."
            action={
              <Button
                onClick={() => gainExp(150, "Completed Simulation Training")}
                variant="outline"
                size="sm"
                className="text-xs border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Run First Simulation
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {/* FRAMER MOTION: Staggered Fade-in-up Feed */}
            <AnimatePresence initial={false}>
              {[...history].reverse().map((item, index) => {
                const isLevelUp = item.type === "LEVEL_UP";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.04, 0.2),
                    }}
                    className={`p-4 rounded-[18px] bg-[#151C33] border ${
                      isLevelUp
                        ? "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        : "border-white/10 hover:border-blue-500/30"
                    } transition-all flex items-center justify-between gap-4`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${
                          isLevelUp
                            ? "bg-amber-950/60 text-amber-400 border border-amber-500/40"
                            : "bg-blue-950/60 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {isLevelUp ? (
                          <Award className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white font-sans">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>
                            {new Date(item.createdAt).toLocaleString(
                              undefined,
                              {
                                dateStyle: "short",
                                timeStyle: "medium",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={isLevelUp ? "gold" : "default"}
                      className="font-mono text-xs shrink-0"
                    >
                      +{item.amount} EXP
                    </Badge>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
