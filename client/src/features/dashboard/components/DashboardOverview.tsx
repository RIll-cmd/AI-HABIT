"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Sword,
  Shield,
  Circle,
  Shirt,
  Footprints,
  Gem,
  CheckCircle2,
  Check,
  X,
  Plus,
  Play,
  Clock,
  Activity,
  Bot,
  Skull,
  Crosshair,
  Timer,
  Sparkles,
  Package
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useHabitStore } from "@/features/habits/store";
import { MissionCard } from "@/features/habits/components/MissionCard";
import { RadarChart } from "@/components/RadarChart";
import { playSystemOpen } from "@/features/audio/useSystemAudio";
import { PaperDoll } from "@/features/inventory/components";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useCombatStats } from "@/features/inventory/hooks/useCombatStats";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { useBossStore } from "@/features/bosses/store/useBossStore";
import { getEnemySpritePath } from "@/utils/sprites";

/* Rune glyphs for decorative accents */
const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"];

/* Framer Motion Variants */
const columnVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const cardInnerVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const missionStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const missionItem = {
  hidden: { opacity: 0, x: -15, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const floorStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const floorItem = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function DashboardOverview() {
  const router = useRouter();
  const { character, loadCharacter } = useCharacterStore();
  const { items, fetchInventory } = useInventoryStore();
  const finalStats = useCombatStats();
  
  const { todayMissions, loadTodayMissions, executeMissionCompletion, isLoading } =
    useHabitStore();

  const { floors, fetchFloors, selectFloor } = useTowerStore();
  const { bosses, fetchBosses, isLoading: isBossesLoading } = useBossStore();

  useEffect(() => {
    loadCharacter("char-id-123");
    loadTodayMissions("char-id-123");
    fetchInventory("char-id-123");
    fetchFloors("char-id-123");
    fetchBosses("char-id-123");
  }, [loadCharacter, loadTodayMissions, fetchInventory, fetchFloors, fetchBosses]);

  const totalMissionsCount = todayMissions.length;
  const completedMissionsCount = todayMissions.filter(
    (m) => m.status === "COMPLETED"
  ).length;

  const radarData = [
    { name: "Strength", value: Number(finalStats?.strength) || 1 },
    { name: "Endurance", value: Number(finalStats?.endurance) || 1 },
    { name: "Discipline", value: Number(finalStats?.discipline) || 1 },
    { name: "Knowledge", value: Number(finalStats?.knowledge) || 1 },
    { name: "Recovery", value: Number(finalStats?.recovery) || 1 },
    { name: "Focus", value: Number(finalStats?.focus) || 1 },
    { name: "Consistency", value: Number(finalStats?.consistency) || 1 },
  ];

  const statColors = [
    { bar: "bg-cyan-500", glow: "shadow-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-500" },
    { bar: "bg-blue-500", glow: "shadow-blue-500/30", text: "text-blue-400", dot: "bg-blue-500" },
    { bar: "bg-amber-500", glow: "shadow-amber-500/30", text: "text-amber-400", dot: "bg-amber-500" },
    { bar: "bg-indigo-400", glow: "shadow-indigo-400/30", text: "text-indigo-400", dot: "bg-indigo-400" },
    { bar: "bg-emerald-500", glow: "shadow-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-500" },
    { bar: "bg-purple-500", glow: "shadow-purple-500/30", text: "text-purple-400", dot: "bg-purple-500" },
    { bar: "bg-orange-400", glow: "shadow-orange-400/30", text: "text-orange-400", dot: "bg-orange-400" },
  ];

  return (
    <div suppressHydrationWarning className="space-y-6">
      {/* MAIN 3-COLUMN DASHBOARD GRID */}
      <div suppressHydrationWarning className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* ========================================================= */}
        {/* COLUMN 1: CHARACTER & ATTRIBUTES */}
        {/* ========================================================= */}
        <motion.div
          suppressHydrationWarning
          className="space-y-5"
          variants={columnVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div suppressHydrationWarning className="glass-card p-5 flex flex-col relative group">
            {/* Animated corner glow */}
            <div suppressHydrationWarning className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-500/8 to-transparent rounded-br-[60px] pointer-events-none animate-pulse-glow-intense" />
            
            {/* Floating runes in character card */}
            <span suppressHydrationWarning className="rune-static text-cyan-400/15" style={{ top: '5%', right: '8%', fontSize: '14px', animationDelay: '0s' }}>ᚠ</span>
            <span suppressHydrationWarning className="rune-drift text-purple-400/15" style={{ bottom: '30%', left: '5%', fontSize: '11px', animationDuration: '14s', animationDelay: '3s' }}>ᚦ</span>
            <span suppressHydrationWarning className="rune-static text-cyan-400/10" style={{ top: '50%', right: '3%', fontSize: '10px', animationDelay: '5s' }}>ᛗ</span>
            
            <div suppressHydrationWarning className="flex items-center gap-2 mb-4 relative z-10">
              <div suppressHydrationWarning className="w-1.5 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse" />
              <h2 className="text-sm font-bold text-cyan-200/80 font-heading tracking-[0.15em] uppercase">Character</h2>
            </div>
            
            {/* Portrait & Equip Slots Container */}
            <motion.div
              suppressHydrationWarning
              className="mb-4"
              variants={cardInnerVariants}
              initial="hidden"
              animate="visible"
            >
               <PaperDoll equippedItems={items.filter(i => i.isEquipped)} />
            </motion.div>

            {/* Power Score — with shimmer and glow */}
            <div suppressHydrationWarning className="flex flex-col mt-2">
               <div suppressHydrationWarning className="flex items-center gap-2 text-slate-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                 <Sword className="w-3.5 h-3.5 text-cyan-500/60 glow-cyan" />
                 <span>POWER</span>
               </div>
               <div suppressHydrationWarning className="text-4xl font-bold font-mono shimmer-text mt-1 animate-number-glow" style={{ color: '#67e8f9' }}>
                 {character?.power?.toLocaleString() || "5,870"}
               </div>
            </div>

            {/* Title and Guild */}
            <div suppressHydrationWarning className="flex items-end justify-between mt-4 pb-3 border-b border-cyan-500/[0.07]">
              <div suppressHydrationWarning>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">TITLE</p>
                <div suppressHydrationWarning className="flex items-center gap-1.5 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 glow-purple" />
                  <span className="text-purple-300 text-xs font-semibold">{character?.title || "Shadow Seeker"}</span>
                </div>
              </div>
              <div suppressHydrationWarning className="text-right">
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">GUILD</p>
                <div suppressHydrationWarning className="flex items-center justify-end gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300 text-xs font-semibold">Lone Ascendants</span>
                </div>
              </div>
            </div>

            {/* Attributes Matrix */}
            <div suppressHydrationWarning className="mt-4 pt-2">
              <h3 className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div suppressHydrationWarning className="w-1 h-3 rounded-full bg-indigo-500/60 shadow-[0_0_6px_rgba(99,102,241,0.4)]" />
                ATTRIBUTES
              </h3>
              <div suppressHydrationWarning className="grid grid-cols-2 gap-4">
                
                {/* Stats List — animated bars */}
                <div suppressHydrationWarning className="space-y-3">
                  {radarData.map((stat, i) => {
                     const color = statColors[i];
                     return (
                      <motion.div
                        key={stat.name}
                        suppressHydrationWarning
                        className="flex items-center gap-2 group/stat"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
                      >
                        <div suppressHydrationWarning className={`w-1.5 h-1.5 rounded-full ${color.dot} shadow-sm ${color.glow}`} />
                        <span className="text-[10px] text-slate-400 flex-1 group-hover/stat:text-slate-200 transition-colors">{stat.name}</span>
                        <div suppressHydrationWarning className="w-14 h-1.5 bg-slate-800/60 rounded-full overflow-hidden border border-white/[0.03] relative">
                          <motion.div
                            suppressHydrationWarning
                            className={`h-full ${color.bar} rounded-full shadow-sm bar-shimmer`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(stat.value, 100)}%` }}
                            transition={{ delay: 0.6 + i * 0.08, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                          />
                        </div>
                        <span className={`text-xs font-mono font-bold w-5 text-right ${color.text}`}>{stat.value}</span>
                      </motion.div>
                     );
                  })}
                </div>

                {/* Radar Chart */}
                <div suppressHydrationWarning className="flex items-center justify-center">
                  <RadarChart data={radarData} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* COLUMN 2: MISSIONS & BOSS */}
        {/* ========================================================= */}
        <motion.div
          suppressHydrationWarning
          className="space-y-5"
          variants={columnVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          
          {/* Today's Missions */}
          <div suppressHydrationWarning className="glass-card p-5 flex flex-col h-[400px] relative">
            {/* Corner accent */}
            <div suppressHydrationWarning className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/[0.06] to-transparent rounded-bl-[60px] pointer-events-none" />
            
            {/* Rune accent */}
            <span suppressHydrationWarning className="rune-static text-indigo-400/15" style={{ top: '8%', right: '5%', fontSize: '13px', animationDelay: '1s' }}>ᚱ</span>
            
            <div suppressHydrationWarning className="flex items-center justify-between mb-4 relative z-10">
              <div suppressHydrationWarning className="flex items-center gap-2">
                <div suppressHydrationWarning className="w-1.5 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] animate-pulse" />
                <h2 className="text-sm font-bold text-indigo-200/80 font-heading tracking-[0.15em] uppercase">Today&apos;s Missions</h2>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                {completedMissionsCount}/{totalMissionsCount}
              </div>
            </div>
             
             <motion.div
               suppressHydrationWarning
               className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
               variants={missionStagger}
               initial="hidden"
               animate="visible"
             >
               {isLoading ? (
                  <div suppressHydrationWarning className="py-6 text-center text-xs text-slate-500 font-mono animate-pulse">Loading missions...</div>
                ) : todayMissions.length > 0 ? (
                  todayMissions.map((mission) => (
                    <motion.div key={mission.id} variants={missionItem}>
                      <MissionCard
                        mission={mission}
                        onComplete={(id, habit, completionType) =>
                          executeMissionCompletion(id, habit, completionType)
                        }
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    suppressHydrationWarning
                    className="py-12 flex flex-col items-center justify-center text-center text-slate-500 space-y-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div suppressHydrationWarning className="w-12 h-12 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-center animate-beacon">
                      <Crosshair className="w-5 h-5 text-indigo-400/40" />
                    </div>
                    <p className="text-xs font-mono">No active missions for today.</p>
                    <Button variant="outline" size="sm" asChild className="text-xs border-indigo-500/20 hover:border-indigo-400/40 hover:bg-indigo-500/10 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                      <Link href="/missions/create"><Plus className="w-3.5 h-3.5 mr-1" /> Add Mission</Link>
                    </Button>
                  </motion.div>
                )}
             </motion.div>

             {/* Daily Completion Progress */}
             <div suppressHydrationWarning className="mt-4 pt-4 border-t border-cyan-500/[0.07]">
                <div suppressHydrationWarning className="flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">
                  <span>DAILY COMPLETION</span>
                  <div className="w-4 h-4 text-amber-500"><Package className="w-4 h-4"/></div>
                </div>
                <div suppressHydrationWarning className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden border border-white/[0.03] relative">
                  <motion.div 
                    suppressHydrationWarning
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)] bar-shimmer"
                    initial={{ width: 0 }}
                    animate={{ width: `${totalMissionsCount > 0 ? (completedMissionsCount / totalMissionsCount) * 100 : 0}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  />
                </div>
             </div>
          </div>

          {/* Current Boss */}
          <div suppressHydrationWarning className="glass-card-red p-5 relative">
            <div suppressHydrationWarning className="absolute inset-0 bg-gradient-to-br from-red-900/[0.05] to-transparent pointer-events-none rounded-[22px]" />
            
            {/* Danger runes */}
            <span suppressHydrationWarning className="rune-static text-red-400/15" style={{ top: '10%', right: '6%', fontSize: '13px', animationDelay: '0s' }}>ᚺ</span>
            <span suppressHydrationWarning className="rune-drift text-red-400/10" style={{ bottom: '15%', left: '3%', fontSize: '10px', animationDuration: '15s', animationDelay: '5s' }}>ᛉ</span>
            
            <div suppressHydrationWarning className="flex items-center gap-2 mb-4 relative z-10">
              <div suppressHydrationWarning className="w-1.5 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse" />
              <h2 className="text-sm font-bold text-red-200/80 font-heading tracking-[0.15em] uppercase">Current Boss</h2>
            </div>
            
            {(() => {
              const activeBoss = bosses.find((b) => b.status === "ACTIVE") || bosses[0];
              if (isBossesLoading && bosses.length === 0) {
                return (
                  <div suppressHydrationWarning className="py-8 text-center text-xs font-mono text-slate-500 animate-pulse">
                    Scanning active boss threats...
                  </div>
                );
              }

              if (!activeBoss) {
                return (
                  <motion.div
                    suppressHydrationWarning
                    className="flex flex-col items-center justify-center py-6 text-center space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div suppressHydrationWarning className="w-14 h-14 rounded-xl bg-red-950/30 border border-red-500/20 flex items-center justify-center animate-energy-pulse-red">
                      <Skull className="w-7 h-7 text-red-400/30" />
                    </div>
                    <p className="text-xs text-slate-500 font-mono">No active boss threat targeted.</p>
                    <Button
                      onClick={() => router.push("/bosses")}
                      className="bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-300 text-xs h-8 px-5 rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all active:scale-[0.98]"
                    >
                      <Skull className="w-3.5 h-3.5 mr-1.5" />
                      Summon Boss
                    </Button>
                  </motion.div>
                );
              }

              const hpPercent = Math.max(0, Math.min(100, (activeBoss.currentHp / activeBoss.maxHp) * 100));
              const damageDealt = activeBoss.maxHp - activeBoss.currentHp;
              const contributionPct = activeBoss.maxHp > 0 ? ((damageDealt / activeBoss.maxHp) * 100).toFixed(1) : "0.0";

              return (
                <motion.div
                  suppressHydrationWarning
                  className="flex gap-4 relative z-10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                   {/* Boss Image — breathing scale animation */}
                   <div suppressHydrationWarning className="w-28 h-28 rounded-xl bg-red-950/30 border border-red-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_25px_rgba(239,68,68,0.15)] relative overflow-hidden p-2 group/boss animate-border-glow-red">
                      <img
                        src={getEnemySpritePath(activeBoss.name, 1, true)}
                        alt={activeBoss.name}
                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] group-hover/boss:scale-110 transition-transform duration-500"
                      />
                      <div suppressHydrationWarning className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent pointer-events-none" />
                   </div>

                   {/* Boss Info */}
                   <div suppressHydrationWarning className="flex flex-col justify-center flex-1">
                     <h3 className="text-sm font-bold text-white font-heading">{activeBoss.name}</h3>
                     <p className="text-[10px] text-red-300/60 font-mono">
                       {activeBoss.difficulty} Boss • {activeBoss.category}
                     </p>
                     
                     <div suppressHydrationWarning className="mt-3">
                       <div suppressHydrationWarning className="flex justify-between text-[10px] font-mono text-red-300/80 mb-1">
                         <span>{activeBoss.currentHp.toLocaleString()} / {activeBoss.maxHp.toLocaleString()} HP</span>
                         <span className="text-red-400 font-bold">{hpPercent.toFixed(1)}%</span>
                       </div>
                       <div suppressHydrationWarning className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden mb-1 border border-white/[0.03] relative">
                         <motion.div
                           suppressHydrationWarning
                           className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.5)] bar-shimmer animate-hp-drain"
                           initial={{ width: "100%" }}
                           animate={{ width: `${hpPercent}%` }}
                           transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                         />
                       </div>
                       <div className="text-[9px] text-emerald-400/80 font-mono">YOUR CONTRIBUTION <span className="font-bold text-emerald-300">{contributionPct}%</span></div>
                     </div>

                     <Button
                       onClick={() => router.push("/bosses")}
                       className="mt-3 w-full bg-red-950/40 hover:bg-red-900/50 border border-red-500/25 text-red-200 text-xs h-8 rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all active:scale-[0.98]"
                     >
                       View Boss Details
                     </Button>
                   </div>
                </motion.div>
              );
            })()}
          </div>

          {/* Quick Actions */}
          <div suppressHydrationWarning className="glass-card p-4 relative">
             <h2 className="text-[10px] font-mono tracking-[0.2em] text-slate-600 uppercase mb-3 flex items-center gap-2 relative z-10">
               <div suppressHydrationWarning className="w-1 h-3 rounded-full bg-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.3)]" />
               QUICK ACTIONS
             </h2>
             <div suppressHydrationWarning className="grid grid-cols-6 gap-2 relative z-10">
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-cyan-500/[0.06] text-slate-500 hover:text-cyan-300 transition-all duration-300 group/qa">
                 <div className="w-8 h-8 rounded-lg bg-[#0d1430] border border-cyan-500/10 flex items-center justify-center group-hover/qa:border-cyan-500/30 group-hover/qa:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-300 animate-float-gentle" style={{ animationDelay: '0s' }}><Play className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Start<br/>Workout</span>
               </button>
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-cyan-500/[0.06] text-slate-500 hover:text-cyan-300 transition-all duration-300 group/qa">
                 <div className="w-8 h-8 rounded-lg bg-[#0d1430] border border-cyan-500/10 flex items-center justify-center group-hover/qa:border-cyan-500/30 group-hover/qa:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-300 animate-float-gentle" style={{ animationDelay: '-0.8s' }}><Timer className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Focus<br/>Timer</span>
               </button>
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-cyan-500/[0.06] text-slate-500 hover:text-cyan-300 transition-all duration-300 group/qa">
                 <div className="w-8 h-8 rounded-lg bg-[#0d1430] border border-cyan-500/10 flex items-center justify-center group-hover/qa:border-cyan-500/30 group-hover/qa:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-300 animate-float-gentle" style={{ animationDelay: '-1.6s' }}><Activity className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Log<br/>Activity</span>
               </button>
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-indigo-500/[0.06] text-slate-500 hover:text-indigo-300 transition-all duration-300 group/qa">
                 <div className="w-8 h-8 rounded-lg bg-[#0d1430] border border-indigo-500/10 flex items-center justify-center group-hover/qa:border-indigo-500/30 group-hover/qa:shadow-[0_0_12px_rgba(99,102,241,0.15)] transition-all duration-300 animate-float-gentle" style={{ animationDelay: '-2.4s' }}><Bot className="w-4 h-4 text-indigo-400/60" /></div>
                 <span className="text-[9px] text-center leading-tight">AI<br/>Advice</span>
               </button>
               <Link href="/missions/create" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-cyan-500/[0.06] text-slate-500 hover:text-cyan-300 transition-all duration-300 group/qa">
                 <div className="w-8 h-8 rounded-lg bg-[#0d1430] border border-cyan-500/10 flex items-center justify-center group-hover/qa:border-cyan-500/30 group-hover/qa:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-300 animate-float-gentle" style={{ animationDelay: '-3.2s' }}><Plus className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Add<br/>Mission</span>
               </Link>
               <Link href="/habits/create" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-emerald-500/[0.06] text-slate-500 hover:text-emerald-300 transition-all duration-300 group/qa">
                 <div className="w-8 h-8 rounded-lg bg-[#0d1430] border border-emerald-500/10 flex items-center justify-center group-hover/qa:border-emerald-500/30 group-hover/qa:shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-300 animate-float-gentle" style={{ animationDelay: '-4s' }}><Plus className="w-4 h-4 text-emerald-400/60" /></div>
                 <span className="text-[9px] text-center leading-tight">Create<br/>Habit</span>
               </Link>
             </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* COLUMN 3: TOWER OF ASCENSION */}
        {/* ========================================================= */}
        <motion.div
          suppressHydrationWarning
          className="space-y-4 flex flex-col h-full"
          variants={columnVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div suppressHydrationWarning className="glass-card-purple p-5 flex flex-col flex-1 relative">
            
            {/* Tower Background Gradient */}
            <div suppressHydrationWarning className="absolute inset-0 bg-gradient-to-b from-purple-900/[0.06] via-transparent to-transparent pointer-events-none rounded-[22px]" />
            
            {/* Tower runes */}
            <span suppressHydrationWarning className="rune-static text-purple-400/15" style={{ top: '4%', right: '6%', fontSize: '14px', animationDelay: '0s' }}>ᛞ</span>
            <span suppressHydrationWarning className="rune-drift text-purple-400/12" style={{ top: '40%', left: '4%', fontSize: '11px', animationDuration: '16s', animationDelay: '4s' }}>ᛟ</span>
            <span suppressHydrationWarning className="rune-static text-indigo-400/10" style={{ bottom: '15%', right: '4%', fontSize: '10px', animationDelay: '7s' }}>ᚲ</span>

            <div suppressHydrationWarning className="flex items-center justify-between mb-6 relative z-10">
              <div suppressHydrationWarning className="flex items-center gap-2">
                <div suppressHydrationWarning className="w-1.5 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-pulse" />
                <h2 className="text-sm font-bold text-purple-200/80 font-heading tracking-[0.15em] uppercase">Tower of Ascension</h2>
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-950/50 flex items-center justify-center border border-purple-500/20 text-purple-400/60 text-[10px] font-mono font-bold cursor-help hover:border-purple-400/40 transition-colors hover:shadow-[0_0_10px_rgba(168,85,247,0.15)]">i</div>
            </div>
            
            {/* Tower Floors */}
            <motion.div
              suppressHydrationWarning
              className="flex-1 flex flex-col gap-3 relative z-10"
              variants={floorStagger}
              initial="hidden"
              animate="visible"
            >
              {(() => {
                const sortedTowerFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);
                const activeFloor = sortedTowerFloors.find((f) => f.status === "AVAILABLE" || f.status === "ATTEMPTED") || sortedTowerFloors[0];
                const nextFloor = activeFloor ? sortedTowerFloors.find((f) => f.floorNumber === activeFloor.floorNumber + 1) : null;
                const previousFloors = activeFloor
                  ? sortedTowerFloors.filter((f) => f.floorNumber < activeFloor.floorNumber).slice(-3).reverse()
                  : [];

                if (!activeFloor) {
                  return (
                    <div suppressHydrationWarning className="text-center text-xs text-slate-600 py-6 font-mono animate-pulse">
                      Loading Tower Data...
                    </div>
                  );
                }

                return (
                  <>
                    {/* Next Floor (Locked) */}
                    {nextFloor && (
                      <motion.div variants={floorItem} suppressHydrationWarning className="p-3 rounded-2xl border border-white/[0.03] bg-[#0d1430]/40 text-center relative overflow-hidden opacity-40">
                        <div className="text-[11px] font-mono text-slate-500 font-bold">Floor {nextFloor.floorNumber}</div>
                        <div className="text-[9px] font-mono text-slate-600 uppercase mt-0.5 tracking-widest">🔒 LOCKED</div>
                      </motion.div>
                    )}

                    {/* Active Floor (Current Challengeable Floor) */}
                    <motion.div
                      variants={floorItem}
                      suppressHydrationWarning
                      className="p-4 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-indigo-900/15 shadow-[0_0_30px_rgba(168,85,247,0.12)] flex items-center gap-4 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-400 animate-border-glow-purple"
                    >
                      {/* Pulse accent line */}
                      <div suppressHydrationWarning className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                      
                      <div suppressHydrationWarning className="w-16 h-16 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center flex-shrink-0 p-1 group-hover:border-purple-400/40 transition-all duration-400 animate-energy-pulse-purple">
                        <img
                          src={getEnemySpritePath(activeFloor.enemy?.name || "", activeFloor.floorNumber, activeFloor.isBoss)}
                          alt={activeFloor.enemy?.name || "Enemy"}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                        />
                      </div>
                      <div suppressHydrationWarning className="flex-1">
                        <div className="text-sm font-bold text-white font-heading">{`Floor ${activeFloor.floorNumber}`}</div>
                        <div className="text-[10px] text-purple-300/70 font-mono mb-2">{activeFloor.enemy?.name || (activeFloor.isBoss ? "Tower Boss" : "Spiked Slime")}</div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          Req. Power <span className="text-amber-400 ml-1 font-bold shimmer-text-gold">{activeFloor.requiredPower.toLocaleString()}</span>
                        </div>
                      </div>
                      <div suppressHydrationWarning className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Button
                          size="sm"
                          onClick={() => {
                            selectFloor(activeFloor);
                            router.push("/tower");
                          }}
                          className="bg-purple-600/80 hover:bg-purple-500 text-white text-xs h-8 px-4 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all active:scale-[0.96]"
                        >
                          Enter Floor
                        </Button>
                      </div>
                    </motion.div>

                    {/* Previous Cleared/Attempted Floors */}
                    {previousFloors.length > 0 ? (
                      previousFloors.map((floor) => (
                        <motion.div key={floor.id} variants={floorItem} suppressHydrationWarning className="py-2.5 px-4 flex items-center justify-between border-b border-white/[0.03] last:border-0 hover:bg-emerald-500/[0.03] transition-colors rounded-lg sweep-light">
                          <div suppressHydrationWarning>
                            <div className="text-[11px] font-mono text-slate-400 font-bold">Floor {floor.floorNumber}</div>
                            <div className="text-[9px] font-mono text-emerald-500/80 uppercase mt-0.5 tracking-widest">
                              {floor.status === "CLEARED" ? "✓ CLEARED" : floor.status}
                            </div>
                          </div>
                          <div suppressHydrationWarning className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div variants={floorItem} suppressHydrationWarning className="py-3 text-center text-[10px] text-slate-600 font-mono">
                        Begin your ascent on Floor 1!
                      </motion.div>
                    )}

                    {/* Active Floor Rewards Footer */}
                    <div suppressHydrationWarning className="mt-6 pt-4 border-t border-purple-500/10 relative z-10">
                      <h3 className="text-[10px] text-slate-600 font-mono tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                        <div suppressHydrationWarning className="w-1 h-3 rounded-full bg-amber-500/60 shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                        FLOOR {activeFloor.floorNumber} REWARDS
                      </h3>
                      <div suppressHydrationWarning className="flex items-center justify-around gap-2">
                        <div suppressHydrationWarning className="flex flex-col items-center gap-1.5">
                          <div suppressHydrationWarning className="w-10 h-10 rounded-xl bg-amber-950/20 border border-amber-500/15 flex items-center justify-center hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all animate-float-gentle" style={{ animationDelay: '0s' }}>
                            <Circle className="w-4 h-4 text-amber-400 fill-amber-400"/>
                          </div>
                          <span className="text-[9px] font-mono text-amber-300/60">{activeFloor.goldReward} Gold</span>
                        </div>
                        <div suppressHydrationWarning className="flex flex-col items-center gap-1.5">
                          <div suppressHydrationWarning className="w-10 h-10 rounded-xl bg-purple-950/20 border border-purple-500/15 flex items-center justify-center transform rotate-45 hover:border-purple-400/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all animate-float-gentle" style={{ animationDelay: '-1.5s' }}>
                            <Gem className="w-4 h-4 text-purple-400 -rotate-45"/>
                          </div>
                          <span className="text-[9px] font-mono text-purple-300/60">{activeFloor.expReward} EXP</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
