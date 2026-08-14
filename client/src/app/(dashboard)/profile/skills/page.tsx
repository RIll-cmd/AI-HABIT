"use client";

import { API_BASE_URL } from "@/constants";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import {
  Shield,
  Zap,
  Swords,
  Sparkles,
  Lock,
  CheckCircle2,
  Award,
  Loader2,
  BookOpen,
  Flame,
  Crown,
  Layers,
  Heart,
  Eye,
  Check,
  X,
  Target,
} from "lucide-react";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

interface Specialization {
  id: string;
  name: string;
  baseClass: string;
  tier: number;
  requiredLevel: number;
  requiredStats?: string | null;
  description?: string | null;
  lore?: string | null;
  icon?: string | null;
  statBonus?: string | null;
  powerMultiplier?: number | null;
  passivePerk?: string | null;
  passiveEffect?: string | null;
}

export default function SkillTreePage() {
  const { character, refetch } = useCharacterStore();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<number | "ALL">("ALL");

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/character/specializations/all`);
        if (res.ok) {
          const data = await res.json();
          setSpecializations(data.specializations || []);
        }
      } catch (e) {
        console.error("Failed to fetch specializations", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  const activeSpecId = character?.specializationId;
  const currentLevel = character?.level || 1;
  const playerStats = character?.stats || {
    strength: 1,
    knowledge: 1,
    discipline: 1,
    focus: 1,
    endurance: 1,
    recovery: 1,
    consistency: 1,
  };

  const handleSelectSpecialization = async (spec: Specialization) => {
    // Check Level Requirement
    if (currentLevel < spec.requiredLevel) {
      toast.error(`Requires Level ${spec.requiredLevel} to awaken ${spec.name}. (Current Level: ${currentLevel})`);
      return;
    }

    // Check Stat Requirements
    if (spec.requiredStats) {
      try {
        const reqStats = JSON.parse(spec.requiredStats);
        const unmet: string[] = [];
        for (const [statKey, minVal] of Object.entries(reqStats)) {
          const currVal = (playerStats as any)[statKey] || 1;
          if (currVal < (minVal as number)) {
            unmet.push(`${statKey.toUpperCase()}: ${currVal}/${minVal}`);
          }
        }
        if (unmet.length > 0) {
          toast.error(`Unmet Stat Requirements: ${unmet.join(", ")}`);
          return;
        }
      } catch (e) {}
    }

    setIsSelecting(spec.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/character/specializations/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character?.id || "char-id-123",
          specializationId: spec.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(`Awakened Class: ${spec.name}! Passive Perk Activated.`);
        await refetch();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || "Failed to awaken class specialization.");
      }
    } catch (e) {
      toast.error("Network error during class awakening.");
    } finally {
      setIsSelecting(null);
    }
  };

  const filteredSpecs = specializations.filter((s) => {
    if (tierFilter === "ALL") return true;
    return s.tier === tierFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-[24px] bg-gradient-to-r from-[#0B1020] via-[#111A38] to-[#0B1020] border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Floating Runes & Particles */}
        <FloatingRuneField density="medium" />

        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2 font-heading">
              <Crown className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              ASCENDANT CLASS MATRIX
            </h2>
            {character?.specialization ? (
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-mono font-bold text-xs uppercase px-3 py-1 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE CLASS: {character.specialization.name}
              </Badge>
            ) : (
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 font-mono font-bold text-xs uppercase px-3 py-1">
                NO CLASS AWAKENED
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Awaken specialized combat classes to channel monumental stat bonuses, power multipliers, and game-changing passive perks into your build.
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-2 z-10 font-mono text-xs">
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setTierFilter("ALL");
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
              tierFilter === "ALL"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            ALL CLASSES ({specializations.length})
          </button>
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setTierFilter(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
              tierFilter === 1
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            TIER 1 (LV. 5+)
          </button>
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setTierFilter(2);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
              tierFilter === 2
                ? "bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            TIER 2 (LV. 10+)
          </button>
        </div>
      </div>

      {/* CLASS ROSTER GRID */}
      {isLoading ? (
        <div className="flex items-center justify-center p-16 text-slate-400 font-mono text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Synchronizing Ascendant Class Registry...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSpecs.map((spec) => {
            const isEquipped = activeSpecId === spec.id;
            const meetsLevel = currentLevel >= spec.requiredLevel;

            // Parse Required Stats
            let reqStatsObj: Record<string, number> = {};
            if (spec.requiredStats) {
              try {
                reqStatsObj = JSON.parse(spec.requiredStats);
              } catch (e) {}
            }

            // Parse Stat Bonuses
            let statBonusObj: Record<string, number> = {};
            if (spec.statBonus) {
              try {
                statBonusObj = JSON.parse(spec.statBonus);
              } catch (e) {}
            }

            // Evaluate stat requirements
            let meetsAllStats = true;
            const statReqChecks = Object.entries(reqStatsObj).map(([statKey, minVal]) => {
              const currentVal = (playerStats as any)[statKey] || 1;
              const isMet = currentVal >= minVal;
              if (!isMet) meetsAllStats = false;
              return {
                name: statKey.toUpperCase(),
                required: minVal,
                current: currentVal,
                isMet,
              };
            });

            const canAwaken = meetsLevel && meetsAllStats;

            // Tier styling
            const isTier2 = spec.tier === 2;
            const borderColor = isEquipped
              ? "border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              : isTier2
              ? "border-purple-500/40 hover:border-purple-400"
              : "border-slate-800 hover:border-slate-700";

            return (
              <Card
                key={spec.id}
                className={`bg-[#0D1429]/95 border transition-all duration-300 overflow-hidden flex flex-col justify-between relative shadow-xl ${borderColor}`}
              >
                {/* Top Header */}
                <CardHeader className="pb-3 bg-slate-900/60 border-b border-slate-800/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Glowing Class Portrait */}
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-500/40 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                        <img
                          src={spec.icon || "/class_icons/icHunter.png"}
                          alt={spec.name}
                          className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/class_icons/icHunter.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none rounded-2xl" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-bold text-white tracking-tight">
                            {spec.name}
                          </CardTitle>
                          {isEquipped && (
                            <Badge className="bg-cyan-500 text-slate-950 font-mono font-black text-[10px] uppercase shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                              ACTIVE
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                          <span className="text-cyan-400 font-bold">{spec.baseClass}</span>
                          <span>•</span>
                          <span className={isTier2 ? "text-purple-400 font-bold" : "text-slate-300"}>
                            Tier {spec.tier}
                          </span>
                          <span>•</span>
                          <span className={meetsLevel ? "text-emerald-400" : "text-red-400 font-bold"}>
                            Req. Lv. {spec.requiredLevel} ({currentLevel})
                          </span>
                        </div>
                      </div>
                    </div>

                    {isEquipped ? (
                      <CheckCircle2 className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    ) : !canAwaken ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : null}
                  </div>
                </CardHeader>

                {/* Body Content */}
                <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between font-mono">
                  <div className="space-y-3.5">
                    {/* Short Description */}
                    <p className="text-xs text-slate-200 font-sans leading-relaxed">
                      {spec.description}
                    </p>

                    {/* Lore Chronicle */}
                    {spec.lore && (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#121933] to-[#0A0E1A] border border-purple-500/30 relative overflow-hidden shadow-inner">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold text-purple-300 uppercase tracking-wider mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          <span>ANCIENT AWAKENING LORE</span>
                        </div>
                        <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">
                          &ldquo;{spec.lore}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Stat Requirements Checklist */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        REQUIRED ATTRIBUTES FOR AWAKENING:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {statReqChecks.map((req) => (
                          <div
                            key={req.name}
                            className={`p-2 rounded-lg border text-center font-mono ${
                              req.isMet
                                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                                : "bg-red-950/30 border-red-500/40 text-red-400"
                            }`}
                          >
                            <span className="block text-[9.5px] uppercase font-bold text-slate-400">
                              {req.name}
                            </span>
                            <span className="text-xs font-black flex items-center justify-center gap-1 mt-0.5">
                              {req.current}/{req.required}
                              {req.isMet ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <X className="w-3 h-3 text-red-400" />
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stat Bonuses & Power Multiplier */}
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 uppercase">
                        <span>CLASS ATTRIBUTE BONUSES:</span>
                        <span className="text-amber-400">
                          Power: +{Math.round(((spec.powerMultiplier || 1.2) - 1.0) * 100)}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(statBonusObj).map(([bonusStat, val]) => (
                          <Badge
                            key={bonusStat}
                            className="bg-cyan-900/40 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono px-2 py-0.5"
                          >
                            +{val} {bonusStat.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Passive Perk Card */}
                    {spec.passivePerk && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-amber-300 uppercase tracking-wider mb-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                          <span>PASSIVE PERK: {spec.passivePerk}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          {spec.passiveEffect}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Awakening Action Button */}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      disabled={isEquipped || !canAwaken || isSelecting === spec.id}
                      onClick={() => handleSelectSpecialization(spec)}
                      className={`w-full font-mono text-xs font-black uppercase tracking-wider py-5 rounded-xl transition-all ${
                        isEquipped
                          ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 cursor-default"
                          : canAwaken
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/60"
                          : "bg-slate-900/80 text-slate-500 border border-slate-800 cursor-not-allowed"
                      }`}
                    >
                      {isSelecting === spec.id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          AWAKENING CLASS LINEAGE...
                        </span>
                      ) : isEquipped ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          ACTIVE CLASS AWAKENED
                        </span>
                      ) : canAwaken ? (
                        <span className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-300" />
                          AWAKEN {spec.name.toUpperCase()} (+{Math.round(((spec.powerMultiplier || 1.2) - 1.0) * 100)}% POWER)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          LOCKED ({!meetsLevel ? `REQ. LVL ${spec.requiredLevel}` : "UNMET STATS"})
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
