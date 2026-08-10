"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Swords,
  PieChart,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  Loader2,
} from "lucide-react";

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
      fetch(`http://127.0.0.1:8000/api/character/titles/${character.id}`)
        .then(res => res.json())
        .then(data => {
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
    { key: "strength", label: "Strength", abbr: "STR", description: "Physical power & heavy lifting output", icon: Dumbbell, color: "text-red-400", bg: "bg-red-950/40", border: "border-red-500/30" },
    { key: "knowledge", label: "Knowledge", abbr: "KNW", description: "Intellectual depth & tactical logic", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-950/40", border: "border-blue-500/30" },
    { key: "discipline", label: "Discipline", abbr: "DIS", description: "Willpower & friction defense", icon: Shield, color: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-500/30" },
    { key: "focus", label: "Focus", abbr: "FCS", description: "Deep work capacity & accuracy", icon: Target, color: "text-purple-400", bg: "bg-purple-950/40", border: "border-purple-500/30" },
    { key: "endurance", label: "Endurance", abbr: "END", description: "Stamina & maximum HP pool", icon: Heart, color: "text-emerald-400", bg: "bg-emerald-950/40", border: "border-emerald-500/30" },
    { key: "recovery", label: "Recovery", abbr: "REC", description: "Rest, energy regen & sustain", icon: RefreshCw, color: "text-cyan-400", bg: "bg-cyan-950/40", border: "border-cyan-500/30" },
    { key: "consistency", label: "Consistency", abbr: "CON", description: "Streak continuity & loot drop quality", icon: Flame, color: "text-orange-400", bg: "bg-orange-950/40", border: "border-orange-500/30" },
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
      const res = await fetch("http://127.0.0.1:8000/api/character/stats/allocate", {
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
        toast.success(`Allocated ${totalAllocated} stat points! Power Score increased to ⚡ ${data.character.power}.`);
        
        if (data.newlyUnlockedTitles && data.newlyUnlockedTitles.length > 0) {
          data.newlyUnlockedTitles.forEach((t: any) => {
            toast.success(`${t.icon || '🏆'} Milestone Unlocked: ${t.name}!`, {
              description: t.description,
              duration: 6000,
            });
          });
          // Refresh titles
          if (character?.id) {
            fetch(`http://127.0.0.1:8000/api/character/titles/${character.id}`)
              .then(res => res.json())
              .then(d => { if (d.titles) setTitles(d.titles); });
          }
        }
        
        setAllocations(INITIAL_ALLOCATIONS);
        await refetch();
      } else {
        toast.error("Failed to allocate stat points.");
      }
    } catch (e) {
      toast.error("Network error during allocation.");
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
      const res = await fetch("http://127.0.0.1:8000/api/character/stats/respec", {
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
      {/* STAT ALLOCATION WIZARD HEADER BANNER */}
      <div className="p-6 rounded-[24px] bg-[#0B1020]/90 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#0B1020] border border-amber-500/30 flex items-center justify-center p-1 shadow-inner relative overflow-hidden shrink-0">
              <img 
                src="/Character_sprite_placeholder/cropped/player-front.png" 
                alt="Avatar" 
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                style={{ imageRendering: "pixelated" }} 
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Stat Allocation Wizard
              </h2>
              {availableSP > 0 && (
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5 animate-pulse w-fit mt-1">
                  {remainingSP} SP Available
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Customize your character build by allocating earned Stat Points into core attributes.
          </p>
        </div>

        {/* Real-Time Power Score Projection & Actions */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto justify-end">
          <div className="p-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right font-mono">
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Projected Power</span>
            <span className="text-lg font-bold text-cyan-400">
              ⚡ {projectedPower} {totalAllocated > 0 && <span className="text-emerald-400 text-xs">(+{projectedPower - basePower})</span>}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRespecStats}
            disabled={isRespeccing}
            className="border-slate-800 text-slate-400 hover:text-white font-mono text-xs"
          >
            {isRespeccing ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 mr-1" />}
            Respec (500g)
          </Button>

          <Button
            size="sm"
            onClick={handleConfirmAllocation}
            disabled={isSubmitting || totalAllocated === 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs uppercase tracking-wider px-5 shadow-lg shadow-emerald-950/50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />}
            Confirm ({totalAllocated} SP)
          </Button>
        </div>
      </div>

      {/* RADAR GRAPH & INTERACTIVE CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Stat Radar Chart Card */}
        <div className="lg:col-span-5 bg-[#151C33] border border-blue-500/30 rounded-[24px] p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Attribute Radar Polygon
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
              LIVE PREVIEW
            </span>
          </div>

          <StatRadarChart
            data={statDefs.map((st) => ({
              subject: st.abbr,
              value: projectedStats[st.key as keyof Allocations],
            }))}
            primaryName="Stat Value"
            primaryColor="#3B82F6"
            secondaryColor="#8B5CF6"
            height={320}
          />

          <div className="text-[11px] text-slate-400 font-mono text-center pt-2 border-t border-white/10">
            Interactive 7-Axis Attribute Matrix
          </div>
        </div>

        {/* Interactive Allocation Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {statDefs.map((st) => {
            const Icon = st.icon;
            const key = st.key as keyof Allocations;
            const currentVal = currentStats[key];
            const addedVal = allocations[key];
            const projectedVal = projectedStats[key];

            return (
              <div
                key={st.key}
                className={`bg-[#151C33] border ${st.border} hover:border-blue-500/40 transition-all duration-300 rounded-[18px] p-4 flex flex-col justify-between shadow-xl group relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[14px] ${st.bg} border ${st.border} flex items-center justify-center ${st.color}`}>
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

                  <div className="text-right font-mono">
                    <span className={`text-xl font-extrabold ${st.color}`}>
                      {projectedVal}
                    </span>
                    {addedVal > 0 && (
                      <span className="block text-[10px] text-emerald-400 font-bold">
                        (+{addedVal})
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed mb-4">
                  {st.description}
                </p>

                {/* Milestone Progress */}
                {(() => {
                  const statTitles = titles.filter(t => t.requirementType === `STAT_${key.toUpperCase()}`);
                  statTitles.sort((a, b) => a.requirementValue - b.requirementValue);
                  const nextMilestone = statTitles.find(t => t.requirementValue > currentVal);
                  
                  if (!nextMilestone) return null;
                  
                  const prevMilestone = [...statTitles].reverse().find(t => t.requirementValue <= currentVal);
                  const min = prevMilestone ? prevMilestone.requirementValue : 0;
                  const max = nextMilestone.requirementValue;
                  const progress = Math.max(0, Math.min(100, ((projectedVal - min) / (max - min)) * 100));

                  return (
                    <div className="mb-4 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 uppercase tracking-wider font-mono">Next Title:</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          {nextMilestone.icon} {nextMilestone.name}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full ${st.bg.replace('/40', '')} transition-all duration-300`} 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right text-[9px] font-mono text-slate-500">
                        {projectedVal} / {max}
                      </div>
                    </div>
                  );
                })()}

                {/* Allocation Controls */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-auto">
                  <span className="text-[10px] font-mono text-slate-400">
                    Base: <strong className="text-slate-200">{currentVal}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={addedVal === 0}
                      onClick={() => handleDecrement(key)}
                      className="h-7 w-7 rounded-lg border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>

                    <span className="font-mono text-xs font-bold text-white w-6 text-center">
                      {addedVal}
                    </span>

                    <Button
                      size="icon"
                      variant="outline"
                      disabled={remainingSP <= 0}
                      onClick={() => handleIncrement(key)}
                      className="h-7 w-7 rounded-lg border-slate-800 bg-slate-950 hover:bg-slate-800 text-emerald-400"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
