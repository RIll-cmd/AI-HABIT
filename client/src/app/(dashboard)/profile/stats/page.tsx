"use client";

import { API_BASE_URL } from "@/constants";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import {
  Dumbbell,
  BookOpen,
  Shield,
  Target,
  Heart,
  RefreshCw,
  Flame,
  PieChart,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  Loader2,
  Zap,
  Info,
  Award,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { STAT_LORE } from "@/features/lore/loreData";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { CHARACTER_AVATAR_SPRITE } from "@/utils/sprites";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

const StatRadarChart = dynamic(
  () => import("@/components/ui/StatRadarChart").then((mod) => mod.StatRadarChart),
  { ssr: false }
);

interface Allocations {
  strength: number;
  knowledge: number;
  discipline: number;
  focus: number;
  endurance: number;
  recovery: number;
  consistency: number;
}

const INITIAL_ALLOCATIONS: Allocations = {
  strength: 0,
  knowledge: 0,
  discipline: 0,
  focus: 0,
  endurance: 0,
  recovery: 0,
  consistency: 0,
};

export default function StatMatrixPage() {
  const { character, updateCharacter, refetch } = useCharacterStore();
  const [allocations, setAllocations] = useState<Allocations>(INITIAL_ALLOCATIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRespeccing, setIsRespeccing] = useState(false);
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

  const availableSP = character?.availableSP || 0;
  const totalAllocated = Object.values(allocations).reduce((sum, v) => sum + v, 0);
  const remainingSP = availableSP - totalAllocated;

  const currentStats = {
    strength: character?.stats?.strength || 1,
    knowledge: character?.stats?.knowledge || 1,
    discipline: character?.stats?.discipline || 1,
    focus: character?.stats?.focus || 1,
    endurance: character?.stats?.endurance || 1,
    recovery: character?.stats?.recovery || 1,
    consistency: character?.stats?.consistency || 1,
  };

  const projectedStats = {
    strength: currentStats.strength + allocations.strength,
    knowledge: currentStats.knowledge + allocations.knowledge,
    discipline: currentStats.discipline + allocations.discipline,
    focus: currentStats.focus + allocations.focus,
    endurance: currentStats.endurance + allocations.endurance,
    recovery: currentStats.recovery + allocations.recovery,
    consistency: currentStats.consistency + allocations.consistency,
  };

  // Standardized Power Score Calculation
  const basePower = ((character?.level || 1) * 50) + (Object.values(currentStats).reduce((a, b) => a + b, 0) * 10);
  const projectedPower = ((character?.level || 1) * 50) + (Object.values(projectedStats).reduce((a, b) => a + b, 0) * 10);

  const statDefs = [
    {
      key: "strength",
      label: "Strength",
      abbr: "STR",
      description: "Physical power & heavy compound lifting output",
      icon: Dumbbell,
      color: "text-red-400",
      glowColor: "rgba(239,68,68,0.3)",
      bg: "bg-red-950/40",
      border: "border-red-500/30 hover:border-red-400/60",
      barGrad: "from-red-600 via-rose-500 to-amber-500",
    },
    {
      key: "knowledge",
      label: "Knowledge",
      abbr: "KNW",
      description: "Intellectual depth, skill retention & tactical analysis",
      icon: BookOpen,
      color: "text-blue-400",
      glowColor: "rgba(59,130,246,0.3)",
      bg: "bg-blue-950/40",
      border: "border-blue-500/30 hover:border-blue-400/60",
      barGrad: "from-blue-600 via-cyan-500 to-indigo-500",
    },
    {
      key: "discipline",
      label: "Discipline",
      abbr: "DIS",
      description: "Friction defense, will mastery & resistance to burnout",
      icon: Shield,
      color: "text-amber-400",
      glowColor: "rgba(245,158,11,0.3)",
      bg: "bg-amber-950/40",
      border: "border-amber-500/30 hover:border-amber-400/60",
      barGrad: "from-amber-600 via-yellow-500 to-orange-500",
    },
    {
      key: "focus",
      label: "Focus",
      abbr: "FCS",
      description: "Deep work capacity, hyper-state & precision accuracy",
      icon: Target,
      color: "text-purple-400",
      glowColor: "rgba(168,85,247,0.3)",
      bg: "bg-purple-950/40",
      border: "border-purple-500/30 hover:border-purple-400/60",
      barGrad: "from-purple-600 via-indigo-500 to-pink-500",
    },
    {
      key: "endurance",
      label: "Endurance",
      abbr: "END",
      description: "Cardiovascular threshold & maximum combat stamina",
      icon: Heart,
      color: "text-emerald-400",
      glowColor: "rgba(16,185,129,0.3)",
      bg: "bg-emerald-950/40",
      border: "border-emerald-500/30 hover:border-emerald-400/60",
      barGrad: "from-emerald-600 via-teal-500 to-cyan-500",
    },
    {
      key: "recovery",
      label: "Recovery",
      abbr: "REC",
      description: "Parasympathetic rest, sleep optimization & energy regen",
      icon: RefreshCw,
      color: "text-cyan-400",
      glowColor: "rgba(6,182,212,0.3)",
      bg: "bg-cyan-950/40",
      border: "border-cyan-500/30 hover:border-cyan-400/60",
      barGrad: "from-cyan-600 via-blue-500 to-teal-500",
    },
    {
      key: "consistency",
      label: "Consistency",
      abbr: "CON",
      description: "Streak continuity momentum & rare loot drop scaling",
      icon: Flame,
      color: "text-orange-400",
      glowColor: "rgba(249,115,22,0.3)",
      bg: "bg-orange-950/40",
      border: "border-orange-500/30 hover:border-orange-400/60",
      barGrad: "from-orange-600 via-amber-500 to-red-500",
    },
  ];

  const handleIncrement = (key: keyof Allocations) => {
    if (remainingSP <= 0) {
      toast.error("No unallocated stat points remaining.");
      return;
    }
    playUIMenuSFX();
    setAllocations((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const handleDecrement = (key: keyof Allocations) => {
    if (allocations[key] <= 0) return;
    playUIMenuSFX();
    setAllocations((prev) => ({ ...prev, [key]: prev[key] - 1 }));
  };

  const handleConfirmAllocation = async () => {
    if (totalAllocated === 0) {
      toast.info("Please allocate at least 1 stat point.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/character/stats/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character?.id || "char-id-123",
          allocations,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(`Allocated ${totalAllocated} stat points! Power Score increased to ${data.character.power}.`);

        if (data.newlyUnlockedTitles && data.newlyUnlockedTitles.length > 0) {
          data.newlyUnlockedTitles.forEach((t: any) => {
            toast.success(`Milestone Unlocked: ${t.name}!`, {
              description: t.description,
              duration: 6000,
            });
          });
          if (character?.id) {
            fetch(`${API_BASE_URL}/api/character/titles/${character.id}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.titles) setTitles(d.titles);
              });
          }
        }

        setAllocations(INITIAL_ALLOCATIONS);
        await refetch();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || "Failed to allocate stat points.");
      }
    } catch (e) {
      toast.error("Network error while allocating stat points.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRespecStats = async () => {
    if ((character?.gold || 0) < 500) {
      toast.error("Insufficient Gold. Respec costs 500 Gold.");
      return;
    }

    setIsRespeccing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/character/stats/respec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character?.id || "char-id-123",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(data.message);
        setAllocations(INITIAL_ALLOCATIONS);
        await refetch();
      } else {
        toast.error("Respec failed.");
      }
    } catch (e) {
      toast.error("Network error during respec.");
    } finally {
      setIsRespeccing(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================= */}
      {/* STAT ALLOCATION WIZARD HEADER BANNER */}
      {/* ========================================================= */}
      <div className="p-6 md:p-7 rounded-[26px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-amber-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes & Ambient Particles */}
        <FloatingRuneField density="medium" />

        {/* Glowing Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="space-y-1.5 z-10 flex-1 min-w-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#121b38] to-[#0a1024] border-2 border-amber-500/40 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(245,158,11,0.25)] relative overflow-hidden shrink-0 group">
              <img
                src={CHARACTER_AVATAR_SPRITE}
                alt="Avatar"
                className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-white font-heading flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  Stat Allocation Deck
                </h2>
                {availableSP > 0 ? (
                  <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                    ⚡ {remainingSP} SP Available
                  </Badge>
                ) : (
                  <Badge className="bg-slate-900 text-slate-400 border border-slate-700/80 font-mono text-[11px] px-2 py-0.5">
                    0 Unallocated SP
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Allocate earned Stat Points into core attributes to power up combat ratings and unlock masteries.
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Power Score Projection & Actions */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto justify-start lg:justify-end">
          {/* Projected Power Score Box */}
          <div className="p-3 px-5 rounded-2xl bg-[#070D1E] border border-cyan-500/30 text-right font-mono shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-center">
            <span className="block text-[9.5px] text-slate-400 uppercase tracking-widest font-bold">PROJECTED POWER</span>
            <div className="text-xl font-black text-cyan-300 flex items-center justify-end gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="animate-number-glow">{projectedPower.toLocaleString()}</span>
              {totalAllocated > 0 && (
                <span className="text-emerald-400 text-xs font-bold font-mono ml-1 animate-pulse">
                  (+{projectedPower - basePower})
                </span>
              )}
            </div>
          </div>

          {/* Respec Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRespecStats}
            disabled={isRespeccing}
            className="h-11 px-4 rounded-xl border-slate-700/80 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all shadow-md"
          >
            {isRespeccing ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-1.5 text-amber-400" />
            )}
            <span>Respec (500g)</span>
          </Button>

          {/* Confirm Button */}
          <Button
            size="sm"
            onClick={handleConfirmAllocation}
            disabled={isSubmitting || totalAllocated === 0}
            className={`h-11 px-6 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
              totalAllocated > 0
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-pulse"
                : "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2 text-white" />
            )}
            <span>CONFIRM ({totalAllocated} SP)</span>
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RADAR GRAPH & INTERACTIVE CARDS GRID */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: ATTRIBUTE RADAR POLYGON CARD */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/25 rounded-[26px] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between backdrop-blur-2xl">
          {/* Floating Runes */}
          <FloatingRuneField density="low" />

          {/* Top Header */}
          <div className="flex items-center justify-between mb-3 border-b border-cyan-500/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                  Attribute Polygon
                </span>
                <span className="text-[10px] text-slate-400 font-mono">7-Axis Kinetic Matrix</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 font-bold px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              LIVE PREVIEW
            </span>
          </div>

          {/* Radar Chart Component */}
          <div className="py-2">
            <StatRadarChart
              data={statDefs.map((st) => ({
                subject: st.abbr,
                value: projectedStats[st.key as keyof Allocations],
              }))}
              primaryName="Stat Value"
              primaryColor="#06B6D4"
              secondaryColor="#8B5CF6"
              height={380}
            />
          </div>

          {/* Stat Distribution Footer Chips */}
          <div className="pt-3 border-t border-cyan-500/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Total Stat Pool:</span>
              <strong className="text-cyan-300 font-bold">
                {Object.values(projectedStats).reduce((a, b) => a + b, 0)} Pts
              </strong>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {statDefs.map((st) => (
                <span
                  key={st.key}
                  className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md border ${st.bg} ${st.color} ${st.border}`}
                >
                  {st.abbr}: {projectedStats[st.key as keyof Allocations]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: 7 INTERACTIVE ALLOCATION CARDS */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statDefs.map((st) => {
            const Icon = st.icon;
            const key = st.key as keyof Allocations;
            const currentVal = currentStats[key];
            const addedVal = allocations[key];
            const projectedVal = projectedStats[key];
            const lore = STAT_LORE[key];

            return (
              <SystemTooltip
                key={st.key}
                title={`${st.label} (${st.abbr})`}
                subtitle={lore?.category || "Core Character Attribute"}
                category="Attribute Deck"
                rarity={lore?.rarity || "RARE"}
                description={lore?.description || st.description}
                lore={lore?.lore}
                mechanics={`🧬 Real-World Impact: ${lore?.realWorldImpact || "Accelerates neuromuscular adaptation."}\n⚡ Combat Scaling: ${lore?.combatScaling || "Directly scales damage output & defense efficiency."}`}
                stats={[
                  { label: "Base Attribute", value: currentVal, color: "text-slate-300" },
                  { label: "Projected Value", value: projectedVal, color: "text-cyan-400" },
                  { label: "Skills Unlocked", value: lore?.associatedSkills?.[0] || "Mastery Perk", color: "text-amber-400" },
                ]}
                tags={lore?.associatedSkills || ["Attribute", "CombatScore"]}
                className="w-full h-full"
              >
                <div
                  className={`bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border ${st.border} transition-all duration-300 rounded-[22px] p-4 flex flex-col justify-between shadow-xl group relative overflow-hidden w-full h-full text-left cursor-help backdrop-blur-xl hover:shadow-[0_0_25px_${st.glowColor}]`}
                >
                  {/* Top Header with Icon & Counter */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${st.bg} border ${st.border} flex items-center justify-center ${st.color} shadow-inner group-hover:scale-105 transition-transform shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-heading leading-tight flex items-center gap-1.5">
                          <span>{st.label}</span>
                          <Info className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                          {st.abbr} MATRIX
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className={`text-2xl font-black ${st.color} drop-shadow-[0_0_8px_${st.glowColor}]`}>
                        {projectedVal}
                      </span>
                      {addedVal > 0 && (
                        <span className="block text-[10px] text-emerald-400 font-bold font-mono animate-pulse">
                          (+{addedVal})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-3">
                    {st.description}
                  </p>

                  {/* Milestone Progress to Next Title */}
                  {(() => {
                    const statTitles = titles.filter((t) => t.requirementType === `STAT_${key.toUpperCase()}`);
                    statTitles.sort((a, b) => a.requirementValue - b.requirementValue);
                    const nextMilestone = statTitles.find((t) => t.requirementValue > currentVal);

                    if (!nextMilestone) return null;

                    const prevMilestone = [...statTitles].reverse().find((t) => t.requirementValue <= currentVal);
                    const min = prevMilestone ? prevMilestone.requirementValue : 0;
                    const max = nextMilestone.requirementValue;
                    const progress = Math.max(0, Math.min(100, ((projectedVal - min) / (max - min)) * 100));

                    return (
                      <div className="mb-3.5 space-y-1.5 bg-[#050914]/80 p-2.5 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-400" />
                            Next Title:
                          </span>
                          <span className="text-amber-300 font-bold flex items-center gap-1 font-mono">
                            {nextMilestone.icon} {nextMilestone.name}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full bg-gradient-to-r ${st.barGrad} transition-all duration-300 shadow-sm`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>Threshold</span>
                          <span>
                            {projectedVal} / {max}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Tactile SP Allocation Controls */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-auto">
                    <span className="text-[10px] font-mono text-slate-400">
                      Base: <strong className="text-slate-200">{currentVal}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={addedVal === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrement(key);
                        }}
                        className="h-8 w-8 rounded-xl border-slate-700/80 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-30 cursor-pointer active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>

                      <span className="font-mono text-xs font-extrabold text-white w-7 text-center bg-slate-900/80 border border-slate-800 py-1 rounded-lg">
                        {addedVal}
                      </span>

                      <Button
                        size="icon"
                        variant="outline"
                        disabled={remainingSP <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(key);
                        }}
                        className="h-8 w-8 rounded-xl border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 hover:text-emerald-200 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all disabled:opacity-30 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SystemTooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

