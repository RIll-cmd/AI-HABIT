"use client";

import { API_BASE_URL } from "@/constants";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { useSkillStore } from "@/features/skills/store/useSkillStore";
import { calculateTotalCombatStats } from "@/features/inventory/utils/combatStatCalculator";
import { calculateDynamicPower } from "@/features/progression/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import dynamic from "next/dynamic";
import {
  Dumbbell,
  BookOpen,
  Shield,
  Target,
  Heart,
  Zap,
  Sparkles,
  Award,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  HelpCircle,
  Sword,
  Sliders,
  ChevronRight,
  Info,
  Clock,
  BatteryCharging,
} from "lucide-react";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { STAT_LORE } from "@/features/lore/loreData";
import { CHARACTER_AVATAR_SPRITE } from "@/utils/sprites";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

const StatRadarChart = dynamic(
  () => import("@/components/ui/StatRadarChart").then((mod) => mod.StatRadarChart),
  { ssr: false }
);

interface TitleMilestone {
  id: string;
  name: string;
  category: string;
  statRequirement: string;
  targetValue: number;
  unlocked: boolean;
}

const STAT_METADATA = [
  {
    key: "strength",
    label: "Strength",
    short: "STR",
    icon: Dumbbell,
    color: "text-rose-400",
    bgColor: "bg-rose-950/30",
    borderColor: "border-rose-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
    loreKey: "strength",
    irlSource: "Barbell Back Squats, Deadlifts, Bench Press & Workout PRs",
    irlActionHref: "/workouts",
    irlActionText: "Train in Workouts",
    defaultTitle: "Brawler",
    defaultTarget: 10,
  },
  {
    key: "knowledge",
    label: "Knowledge",
    short: "KNW",
    icon: BookOpen,
    color: "text-cyan-400",
    bgColor: "bg-cyan-950/30",
    borderColor: "border-cyan-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    loreKey: "knowledge",
    irlSource: "Study, Reading, Academics, Coding & Skill-building habits",
    irlActionHref: "/habits/create",
    irlActionText: "Build Study Habit",
    defaultTitle: "Scholar",
    defaultTarget: 10,
  },
  {
    key: "discipline",
    label: "Discipline",
    short: "DIS",
    icon: Shield,
    color: "text-amber-400",
    bgColor: "bg-amber-950/30",
    borderColor: "border-amber-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    loreKey: "discipline",
    irlSource: "Fulfilling Daily Missions & protecting unbroken habit streaks",
    irlActionHref: "/missions",
    irlActionText: "View Daily Quests",
    defaultTitle: "Iron Will",
    defaultTarget: 10,
  },
  {
    key: "focus",
    label: "Focus",
    short: "FOC",
    icon: Target,
    color: "text-purple-400",
    bgColor: "bg-purple-950/30",
    borderColor: "border-purple-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    loreKey: "focus",
    irlSource: "Deep Work blocks, Pomodoro cycles & undistracted execution",
    irlActionHref: "/habits/create",
    irlActionText: "Log Deep Work",
    defaultTitle: "Strategist",
    defaultTarget: 10,
  },
  {
    key: "endurance",
    label: "Endurance",
    short: "END",
    icon: Zap,
    color: "text-emerald-400",
    bgColor: "bg-emerald-950/30",
    borderColor: "border-emerald-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    loreKey: "endurance",
    irlSource: "Cardio sessions, Daily step volume, & High-rep workout sets",
    irlActionHref: "/workouts",
    irlActionText: "Track Endurance",
    defaultTitle: "Marathoner",
    defaultTarget: 10,
  },
  {
    key: "recovery",
    label: "Recovery",
    short: "REC",
    icon: Heart,
    color: "text-pink-400",
    bgColor: "bg-pink-950/30",
    borderColor: "border-pink-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(244,114,182,0.2)]",
    loreKey: "recovery",
    irlSource: "Sleep quality, Rest days & biological cellular repair",
    irlActionHref: "/workouts",
    irlActionText: "Check Muscle Recovery",
    defaultTitle: "Regenerator",
    defaultTarget: 10,
  },
  {
    key: "consistency",
    label: "Consistency",
    short: "CNS",
    icon: Activity,
    color: "text-indigo-400",
    bgColor: "bg-indigo-950/30",
    borderColor: "border-indigo-500/30",
    accentGlow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
    loreKey: "consistency",
    irlSource: "Achieving 100% Daily All-Clear habit completions across the week",
    irlActionHref: "/habits",
    irlActionText: "Review Habits",
    defaultTitle: "Ascendant",
    defaultTarget: 10,
  },
];

export default function StatMatrixPage() {
  const { character } = useCharacterStore();
  const { items: inventoryItems } = useInventoryStore();
  const { playerSkills } = useSkillStore();
  const [titles, setTitles] = useState<any[]>([]);

  useEffect(() => {
    if (character?.id) {
      fetch(`${API_BASE_URL}/api/character/titles/${character.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.titles) setTitles(data.titles);
        })
        .catch(console.error);
    }
  }, [character?.id]);

  const equippedItems = (inventoryItems || []).filter((i) => i.isEquipped);

  const baseStats: Record<string, number> = {
    strength: character?.stats?.strength || 1,
    knowledge: character?.stats?.knowledge || 1,
    discipline: character?.stats?.discipline || 1,
    focus: character?.stats?.focus || 1,
    endurance: character?.stats?.endurance || 1,
    recovery: character?.stats?.recovery || 1,
    consistency: character?.stats?.consistency || 1,
  };

  const combatStats = calculateTotalCombatStats(baseStats, equippedItems, playerSkills);
  const multipliers = combatStats.itemMultipliers || {
    strengthPct: 0,
    knowledgePct: 0,
    recoveryPct: 0,
    focusPct: 0,
    disciplinePct: 0,
    endurancePct: 0,
    consistencyPct: 0,
  };

  const basePower = calculateDynamicPower(character?.level || 1, baseStats);
  const effectivePower = calculateDynamicPower(character?.level || 1, {
    strength: combatStats.strength,
    knowledge: combatStats.knowledge,
    discipline: combatStats.discipline,
    focus: combatStats.focus,
    endurance: combatStats.endurance,
    recovery: combatStats.recovery,
    consistency: combatStats.consistency || 1,
  });

  const radarData = [
    {
      subject: "STR",
      value: baseStats.strength,
      secondaryValue: combatStats.strength,
      fullMark: Math.max(15, combatStats.strength * 1.2),
    },
    {
      subject: "KNW",
      value: baseStats.knowledge,
      secondaryValue: combatStats.knowledge,
      fullMark: Math.max(15, combatStats.knowledge * 1.2),
    },
    {
      subject: "DIS",
      value: baseStats.discipline,
      secondaryValue: combatStats.discipline,
      fullMark: Math.max(15, combatStats.discipline * 1.2),
    },
    {
      subject: "FOC",
      value: baseStats.focus,
      secondaryValue: combatStats.focus,
      fullMark: Math.max(15, combatStats.focus * 1.2),
    },
    {
      subject: "END",
      value: baseStats.endurance,
      secondaryValue: combatStats.endurance,
      fullMark: Math.max(15, combatStats.endurance * 1.2),
    },
    {
      subject: "REC",
      value: baseStats.recovery,
      secondaryValue: combatStats.recovery,
      fullMark: Math.max(15, combatStats.recovery * 1.2),
    },
    {
      subject: "CNS",
      value: baseStats.consistency,
      secondaryValue: combatStats.consistency || baseStats.consistency,
      fullMark: Math.max(15, (combatStats.consistency || 1) * 1.2),
    },
  ];

  const availableSP = character?.availableSP || 0;

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================= */}
      {/* 1. KINETIC PROGRESSION & POWER HUB BANNER */}
      {/* ========================================================= */}
      <div className="p-6 md:p-7 rounded-[26px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden backdrop-blur-2xl">
        <FloatingRuneField density="medium" />

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="space-y-1.5 z-10 flex-1 min-w-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#121b38] to-[#0a1024] border-2 border-cyan-500/40 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] relative overflow-hidden shrink-0 group">
              <img
                src={CHARACTER_AVATAR_SPRITE}
                alt="Avatar"
                onError={(e) => {
                  e.currentTarget.src = "/Character_sprite_placeholder/cropped/player-front.png";
                }}
                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-white font-heading flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Biometric Attribute Matrix
                </h2>
                <Badge className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] px-2.5 py-0.5">
                  Real-World Kinetic Scaling
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-2xl leading-relaxed">
                Core attributes level up through real-life physical training, study habits, deep work blocks, and sleep logs. Equipment grants percentage multipliers that scale directly with your real stats.
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Power Telemetry Hub */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto justify-start lg:justify-end">
          <div className="p-3 px-5 rounded-2xl bg-[#070D1E] border border-cyan-500/30 text-right font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-center">
            <span className="block text-[9.5px] text-slate-400 uppercase tracking-widest font-bold">TOTAL COMBAT POWER</span>
            <div className="text-xl font-black text-cyan-300 flex items-center justify-end gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="animate-number-glow">{effectivePower.toLocaleString()}</span>
              {effectivePower > basePower && (
                <span className="text-[11px] text-emerald-400 font-bold ml-1">
                  (+{effectivePower - basePower} Gear)
                </span>
              )}
            </div>
          </div>

          {availableSP > 0 && (
            <Link href="/profile/skills">
              <Button className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold font-mono text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse flex items-center gap-2 cursor-pointer">
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{availableSP} SP $\rightarrow$ Skill Tree</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. REAL-LIFE STAT PROGRESSION PHILOSOPHY BANNER */}
      {/* ========================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/40 border border-indigo-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <span className="font-bold text-white font-mono uppercase tracking-wider block">
              Ascend OS Organic Growth Law
            </span>
            <span className="text-slate-400 text-[11px]">
              Gear bonuses are % multipliers: a +20% Strength weapon gives +0 bonus at Base 1 STR, but amplifies to +10 bonus when you train to Base 50 STR.
            </span>
          </div>
        </div>

        <Link href="/workouts">
          <Button
            size="sm"
            variant="outline"
            className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-mono text-xs shrink-0"
          >
            <span>Log IRL Actions</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN ATTRIBUTE POLYGON & 7-AXIS KINETIC MATRIX */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: 7-AXIS RADAR POLYGON & GEAR MULTIPLIERS BREAKDOWN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radar Chart Card */}
          <div className="p-6 rounded-[26px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 border-b border-cyan-500/15 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-heading tracking-wide uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  7-Axis Kinetic Polygon
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Base IRL Stats vs Total Effective Multiplier
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Base
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> +Gear %
                </span>
              </div>
            </div>

            <div className="w-full flex items-center justify-center py-2">
              <StatRadarChart
                data={radarData}
                primaryName="Base IRL Stat"
                secondaryName="Effective Combat Stat"
                primaryColor="#06B6D4"
                secondaryColor="#A855F7"
                height={320}
              />
            </div>
          </div>

          {/* Active Equipment Multipliers Overview */}
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0a1024]/90 to-[#060a18]/95 border border-indigo-500/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Sword className="w-3.5 h-3.5 text-indigo-400" />
                Active Gear Catalyzers
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {equippedItems.length} Armaments Equipped
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">STR Multiplier</span>
                <span className="text-rose-400 font-bold">+{multipliers.strengthPct}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">KNW Multiplier</span>
                <span className="text-cyan-400 font-bold">+{multipliers.knowledgePct}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">DIS Multiplier</span>
                <span className="text-amber-400 font-bold">+{multipliers.disciplinePct}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">FOC Multiplier</span>
                <span className="text-purple-400 font-bold">+{multipliers.focusPct}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">END Multiplier</span>
                <span className="text-emerald-400 font-bold">+{multipliers.endurancePct}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">REC Multiplier</span>
                <span className="text-pink-400 font-bold">+{multipliers.recoveryPct}%</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Flat Combat Stats:
              </span>
              <span className="font-mono text-white font-bold">
                +{combatStats.attack} ATK • +{combatStats.defense} DEF
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: THE 7 CORE KINETIC ATTRIBUTES CARDS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {STAT_METADATA.map((meta) => {
            const Icon = meta.icon;
            const baseVal = baseStats[meta.key] || 1;
            const effectiveVal = combatStats[meta.key] || baseVal;
            const multPct = (multipliers as any)[`${meta.key}Pct`] || 0;
            const scalingBonus = effectiveVal - baseVal;

            const lore = (STAT_LORE as any)[meta.loreKey] || {
              name: meta.label,
              meaning: "Core physical or mental capability",
              lore: "A core attribute of the Ascendant system.",
              mechanics: "Amplified through dedicated real-world daily training.",
            };

            const matchingTitle = titles.find(
              (t) => t.requirementType === `STAT_${meta.short}`
            );
            const titleTarget = matchingTitle?.requirementValue || meta.defaultTarget;
            const titleName = matchingTitle?.name || meta.defaultTitle;
            const isTitleUnlocked = baseVal >= titleTarget;
            const progressPct = Math.min(100, Math.round((baseVal / titleTarget) * 100));

            return (
              <motion.div
                key={meta.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border ${meta.borderColor} ${meta.accentGlow} transition-all duration-300 relative overflow-hidden backdrop-blur-xl group hover:border-cyan-400/50`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Icon, Name & Lore Tooltip */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl ${meta.bgColor} border ${meta.borderColor} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-6 h-6 ${meta.color}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white font-heading">
                          {meta.label}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                          [{meta.short}]
                        </span>
                        <SystemTooltip
                          title={lore.name}
                          subtitle={`${meta.label} Matrix (${meta.short})`}
                          category="Core Attribute"
                          rarity="MYTHIC"
                          description={lore.description || lore.meaning}
                          howToImprove={lore.howToImprove || meta.irlSource}
                          lore={lore.lore}
                          mechanics={lore.combatScaling || lore.mechanics}
                          stats={[
                            { label: "Base IRL Stat", value: `${baseVal}`, color: "text-white" },
                            { label: "Gear Boost", value: `+${multPct}% (+${scalingBonus})`, color: "text-emerald-400" },
                            { label: "Effective Stat", value: `${effectiveVal}`, color: "text-cyan-300" }
                          ]}
                          tags={["Real-World Growth", "Multiplier Scaling", meta.short]}
                          delayMs={1000}
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-300 transition-colors cursor-help" />
                        </SystemTooltip>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-1">
                        {meta.irlSource}
                      </p>
                    </div>
                  </div>

                  {/* Right: Base Stat & Multiplier Values */}
                  <div className="flex items-center gap-4 self-end sm:self-auto font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                        Base IRL
                      </span>
                      <span className="text-xl font-extrabold text-white">
                        {baseVal}
                      </span>
                    </div>

                    <div className="text-slate-600 font-bold text-sm">+</div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                        Gear Boost
                      </span>
                      <span className={`text-sm font-bold ${multPct > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                        +{multPct}% {scalingBonus > 0 && `(+${scalingBonus})`}
                      </span>
                    </div>

                    <div className="text-slate-600 font-bold text-sm">=</div>

                    <div className="text-right p-2 px-3 rounded-xl bg-[#070D1E] border border-cyan-500/20">
                      <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-bold">
                        Effective
                      </span>
                      <span className="text-xl font-black text-cyan-300">
                        {effectiveVal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Milestone Title Mastery Progress & IRL Action CTA */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  {/* Milestone Title Progress */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                      <Award className="w-3 h-3 text-amber-400" />
                      Title: <strong className="text-amber-300 font-bold">{titleName}</strong>
                    </span>

                    <div className="w-28 sm:w-36 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {baseVal} / {titleTarget}
                    </span>
                  </div>

                  {/* Direct Action Link */}
                  <Link href={meta.irlActionHref}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2.5 text-[11px] text-cyan-300 hover:text-white hover:bg-cyan-950/60 font-mono flex items-center gap-1 rounded-lg border border-cyan-500/20"
                    >
                      <span>{meta.irlActionText}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
