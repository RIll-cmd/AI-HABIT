"use client";

import React, { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { EggIncubatorWidget } from "@/components/beasts/EggIncubatorWidget";
import { BeastBestiary } from "@/components/beasts/BeastBestiary";
import { MysteryEggShop } from "@/features/beasts/components/MysteryEggShop";
import { HatchCelebrationModal } from "@/features/beasts/components/HatchCelebrationModal";
import { EquippedBeastDisplay } from "@/features/beasts/components/EquippedBeastDisplay";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Footprints,
  Crown,
  Flame,
  Shield,
  Heart,
  TrendingUp,
  Coins,
  Loader2,
  Compass,
  ArrowRight,
} from "lucide-react";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export default function BeastsPage() {
  const { user } = useUser();
  const { character } = useCharacterStore();
  const { collection, isLoading, fetchCollection } = useBeastStore();

  const characterId = user?.id || character?.id || "";

  useEffect(() => {
    if (characterId) {
      fetchCollection(characterId);
    }
  }, [characterId, fetchCollection]);

  if (isLoading && !collection) {
    return (
      <div className="flex h-[70vh] items-center justify-center font-mono text-sm text-cyan-400 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <span>Synchronizing Beast Incubation Chamber & Bestiary...</span>
      </div>
    );
  }

  const activeEgg = collection?.activeEgg || null;
  const ownedEggs = collection?.ownedEggs || [];
  const bestiary = collection?.bestiary || [];
  const equippedBeast = collection?.equippedBeast || null;
  const totalDiscovered = collection?.totalDiscovered || 0;
  const totalSpecies = collection?.totalSpecies || 20;
  const passiveBuffs = collection?.passiveBuffs || {};

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 font-sans relative text-slate-100 pb-20 animate-in fade-in duration-300">
      {/* Background Floating Runes */}
      <FloatingRuneField density="low" className="opacity-40" />

      {/* ========================================================= */}
      {/* 1. TOP CINEMATIC HERO BANNER */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#070D1E]/98 via-[#0E1630]/95 to-[#0A1024]/98 border border-cyan-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden backdrop-blur-2xl shrink-0">
        {/* Glow & Runes */}
        <FloatingRuneField density="medium" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Holographic Egg / Dragon Pedestal */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#0f1a3d] to-[#070c20] border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
              <img
                src={equippedBeast?.spritePath ? equippedBeast.spritePath.replace('.png', '.gif') : "/beasts/beast_1.gif"}
                alt="Active Familiar"
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float-slow"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  BIO-KINETIC SANCTUARY
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center gap-1">
                  STEPS & BEASTS ENGINE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Beast Incubation & Familiars
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl font-sans leading-relaxed">
                Turn your daily walking steps, habit streaks, and workout intensity into bio-kinetic incubation energy.
                Crack mystery eggs to collect dragons and familiars that grant permanent passive stat buffs!
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto justify-end">
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Footprints className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  Bestiary Unlocked
                </span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  {totalDiscovered} / {totalSpecies}
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  Passive EXP Boost
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  +{passiveBuffs["EXP_BOOST"] || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN INCUBATION & COMPANION SPLIT */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 cols: Active Incubator Chamber */}
        <div className="lg:col-span-7 flex flex-col">
          <EggIncubatorWidget egg={activeEgg} characterId={characterId} />
        </div>

        {/* Right 5 cols: Active Equipped Companion Showcase */}
        <div className="lg:col-span-5 rounded-[28px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/25 p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl flex flex-col justify-between">
          <FloatingRuneField density="low" className="opacity-30" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Active Familiar Link
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40">
              {equippedBeast ? "LINKED" : "NO COMPANION"}
            </span>
          </div>

          {/* Active Familiar Display */}
          {equippedBeast ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-cyan-500/20 blur-xl animate-pulse pointer-events-none" />
                <div className="relative w-24 h-24 bg-black/50 rounded-3xl border border-cyan-500/40 p-2 shadow-2xl flex items-center justify-center">
                  <img
                    src={equippedBeast.spritePath ? equippedBeast.spritePath.replace('.png', '.gif') : '/beasts/beast_1.gif'}
                    alt={equippedBeast.name}
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-float-slow"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black font-heading text-white">
                  {equippedBeast.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {equippedBeast.species} ({equippedBeast.element} Element)
                </span>
              </div>

              <div className="w-full bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-bold">
                  {(equippedBeast.statBonusType || equippedBeast.passiveBuffType || "EXP_PERCENT").replace("_PERCENT", "").replace("_BOOST", "").replace("_", " ")} Multiplier:
                </span>
                <span className="text-sm font-mono font-black text-emerald-400">
                  +{(equippedBeast.statBonusValue ?? equippedBeast.passiveBuffValue ?? 5).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-300 font-heading">
                No Familiar Equipped
              </h4>
              <p className="text-xs text-slate-500 font-mono max-w-xs">
                Equip an unlocked dragon from the Bestiary below to channel passive stat bonuses.
              </p>
            </div>
          )}

          {/* Passive Resonance Summary */}
          <div className="pt-3 border-t border-cyan-500/10 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Total Sanctuary Passive Resonance:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex justify-between">
                <span className="text-slate-400">EXP Bonus:</span>
                <span className="text-emerald-400 font-bold">+{passiveBuffs["EXP_BOOST"] || 0}%</span>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex justify-between">
                <span className="text-slate-400">Gold Bonus:</span>
                <span className="text-amber-400 font-bold">+{passiveBuffs["GOLD_BOOST"] || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MYSTERY EGG SHOP & STORAGE */}
      {/* ========================================================= */}
      <MysteryEggShop
        characterId={characterId}
        ownedEggs={ownedEggs}
        activeEggId={activeEgg?.id}
      />

      {/* ========================================================= */}
      {/* 4. BESTIARY & CODEX COLLECTION */}
      {/* ========================================================= */}
      <BeastBestiary
        bestiary={bestiary}
        characterId={characterId}
        totalDiscovered={totalDiscovered}
        totalSpecies={totalSpecies}
      />

      {/* ========================================================= */}
      {/* 5. THEATRICAL CELEBRATION HATCH MODAL */}
      {/* ========================================================= */}
      <HatchCelebrationModal characterId={characterId} />
    </div>
  );
}
