"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  Footprints,
  Flame,
  ChevronRight,
  Plus,
  Edit2,
  Check,
  X,
  ArrowUpCircle,
  HelpCircle,
  Activity,
  Coins
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { DRAGON_LORE, EGG_LORE } from "@/features/lore/loreData";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";

export function CompanionSanctumCard() {
  const { character } = useCharacterStore();
  const {
    collection,
    syncSteps,
    setDailySteps,
    setStepGoal,
    upgradeBeast,
    hatchEgg,
    isSyncingSteps,
    isUpgrading,
    isHatching
  } = useBeastStore();

  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [tempSteps, setTempSteps] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState("");

  const equippedBeast = collection?.equippedBeast;
  const activeEgg = collection?.activeEgg;
  const charId = character?.id || "char-id-123";

  const dailySteps = collection?.dailySteps ?? character?.dailySteps ?? 0;
  const dailyStepGoal = collection?.dailyStepGoal ?? character?.dailyStepGoal ?? 10000;
  const dailyProgress = Math.min(100, Math.round((dailySteps / dailyStepGoal) * 100));

  // Quick step addition
  const handleQuickAddSteps = async (amount: number) => {
    playUIMenuSFX("confirm");
    await syncSteps(charId, amount, "DASHBOARD_QUICK_ADD");
  };

  // Custom steps save
  const handleSaveCustomSteps = async () => {
    const val = parseInt(tempSteps, 10);
    if (isNaN(val) || val < 0) {
      toast.error("Please enter a valid step count.");
      return;
    }
    await setDailySteps(charId, val);
    setIsEditingSteps(false);
    setTempSteps("");
  };

  // Custom goal save
  const handleSaveCustomGoal = async () => {
    const val = parseInt(tempGoal, 10);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid daily step goal.");
      return;
    }
    await setStepGoal(charId, val);
    setIsEditingGoal(false);
    setTempGoal("");
  };

  // Beast level-up upgrade
  const handleUpgradeBeast = async () => {
    if (!equippedBeast || isUpgrading) return;
    await upgradeBeast(charId, equippedBeast.id);
  };

  // Hatch egg
  const handleHatchEgg = async () => {
    if (!activeEgg || isHatching) return;
    playBuffSFX("levelup");
    await hatchEgg(charId, activeEgg.id);
  };

  // Rarity color helpers
  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case "HOLOGRAPHIC":
        return "bg-purple-950/80 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]";
      case "LEGENDARY":
        return "bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
      case "EPIC":
        return "bg-red-950/80 border-red-400 text-red-200";
      case "RARE":
        return "bg-cyan-950/80 border-cyan-400 text-cyan-200";
      default:
        return "bg-emerald-950/80 border-emerald-500 text-emerald-300";
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col space-y-5 relative overflow-hidden group">
      {/* Decorative Rune & Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-bl-[80px] pointer-events-none" />
      <span className="rune-static text-cyan-400/15" style={{ top: '6%', right: '6%', fontSize: '13px' }}>ᚲ</span>
      <span className="rune-drift text-purple-400/10" style={{ bottom: '15%', left: '4%', fontSize: '11px', animationDuration: '18s' }}>ᛗ</span>

      {/* CARD HEADER */}
      <div className="flex items-center justify-between relative z-10 border-b border-cyan-500/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse" />
          <h2 className="text-sm font-bold text-cyan-200/90 font-heading tracking-[0.15em] uppercase">
            Companion & Step Matrix
          </h2>
        </div>
        <Link
          href="/beasts"
          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 hover:bg-cyan-950/80 px-2 py-0.5 rounded-lg border border-cyan-500/30 transition-all cursor-pointer"
        >
          <span>Bestiary</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 1. EQUIPPED COMPANION SPOTLIGHT & ASCENSION UPGRADE */}
      <div className="relative z-10 p-3.5 rounded-2xl bg-[#0a1024]/80 border border-cyan-500/25 relative overflow-hidden">
        {equippedBeast ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              {/* Animated Pixel Sprite */}
              <div className="w-16 h-16 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center justify-center p-1.5 relative group/sprite flex-shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <img
                  src={equippedBeast.spritePath ? equippedBeast.spritePath.replace('.png', '.gif') : '/beasts/beast_1.gif'}
                  alt={equippedBeast.name}
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-float-slow"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-md bg-cyan-950 border border-cyan-400 text-[9px] font-mono font-black text-cyan-300 shadow">
                  LV.{equippedBeast.level || 1}
                </div>
              </div>

              {/* Beast Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-white font-heading truncate">
                    {equippedBeast.name}
                  </h3>
                  <Badge className={`text-[8.5px] font-mono px-1.5 py-0 border ${getRarityBadge(equippedBeast.rarity)}`}>
                    {equippedBeast.rarity}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                  {equippedBeast.species} • {equippedBeast.element}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-mono font-bold text-cyan-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>+{equippedBeast.statBonusValue}% {equippedBeast.statBonusType?.replace("_", " ")}</span>
                </div>
              </div>
            </div>

            {/* LEVEL UP / UPGRADE PROGRESSION BAR */}
            {(() => {
              const bLevel = equippedBeast.level || 1;
              const bAccum = equippedBeast.accumulatedSteps || 0;
              const effectiveSteps = Math.max(bAccum, dailySteps);
              const bStepReq = equippedBeast.stepUpgradeReq || (bLevel * 5000);
              const bGoldReq = equippedBeast.goldUpgradeReq || (bLevel * 1000);
              const charGold = character?.gold || 0;

              const stepProgress = Math.min(100, Math.round((effectiveSteps / bStepReq) * 100));
              const canUpgrade = effectiveSteps >= bStepReq && charGold >= bGoldReq && bLevel < 10;

              return (
                <div className="pt-2 border-t border-cyan-500/15 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Footprints className="w-3 h-3 text-cyan-400" />
                      Steps to Level Up:
                    </span>
                    <span className="text-cyan-300 font-bold">
                      {effectiveSteps.toLocaleString()} / {bStepReq.toLocaleString()} ({stepProgress}%)
                    </span>
                  </div>

                  {/* Step Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${stepProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Upgrade CTA Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>{bGoldReq.toLocaleString()} Gold</span>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleUpgradeBeast}
                      disabled={!canUpgrade || isUpgrading}
                      className={`h-7 px-3 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        canUpgrade
                          ? "bg-gradient-to-r from-amber-500 via-cyan-500 to-indigo-500 hover:from-amber-400 hover:to-indigo-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"
                          : "bg-slate-800/60 text-slate-500 border border-white/5 opacity-60"
                      }`}
                    >
                      {isUpgrading ? (
                        "Ascending..."
                      ) : bLevel >= 10 ? (
                        "MAX ASCENSION"
                      ) : (
                        `⚡ Level Up to LV.${bLevel + 1}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="py-4 text-center space-y-2">
            <p className="text-xs text-slate-400 font-mono">No Companion currently linked.</p>
            <Link href="/beasts">
              <Button size="sm" className="h-7 text-xs bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono rounded-lg">
                <Plus className="w-3.5 h-3.5 mr-1" /> Bind Companion
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 2. DAILY STEPS TRACKER (USER-MODIFIABLE) */}
      <div className="relative z-10 p-3.5 rounded-2xl bg-[#080E22]/90 border border-indigo-500/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.3)]">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                DAILY STEPS TRACKER
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black font-mono text-indigo-200">
                  {dailySteps.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  / {dailyStepGoal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Edit / Quick Goal Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsEditingSteps(!isEditingSteps);
                setTempSteps(dailySteps.toString());
              }}
              title="Manually edit daily steps"
              className="p-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer text-[10px]"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                setIsEditingGoal(!isEditingGoal);
                setTempGoal(dailyStepGoal.toString());
              }}
              title="Change daily step goal"
              className="px-1.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 font-mono text-[9px] cursor-pointer"
            >
              Goal
            </button>
          </div>
        </div>

        {/* INLINE EDIT MODE FOR STEPS */}
        {isEditingSteps && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/90 border border-indigo-500/40 animate-in fade-in duration-200">
            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">Set Steps:</span>
            <Input
              type="number"
              value={tempSteps}
              onChange={(e) => setTempSteps(e.target.value)}
              className="h-7 text-xs font-mono bg-black/60 border-indigo-500/40 text-white rounded-lg flex-1"
              placeholder="e.g. 7500"
            />
            <Button
              size="sm"
              onClick={handleSaveCustomSteps}
              className="h-7 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono rounded-lg cursor-pointer"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingSteps(false)}
              className="h-7 px-2 border-slate-700 text-slate-400 hover:text-white text-[10px] rounded-lg cursor-pointer"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* INLINE EDIT MODE FOR STEP GOAL */}
        {isEditingGoal && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/90 border border-indigo-500/40 animate-in fade-in duration-200">
            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">Target Goal:</span>
            <Input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="h-7 text-xs font-mono bg-black/60 border-indigo-500/40 text-white rounded-lg flex-1"
              placeholder="e.g. 10000"
            />
            <Button
              size="sm"
              onClick={handleSaveCustomGoal}
              className="h-7 px-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono rounded-lg cursor-pointer"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingGoal(false)}
              className="h-7 px-2 border-slate-700 text-slate-400 hover:text-white text-[10px] rounded-lg cursor-pointer"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Progress Bar & Telemetry */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>{dailyProgress}% OF DAILY TARGET</span>
            <span>~{(dailySteps * 0.04).toFixed(0)} kcal • {(dailySteps * 0.0008).toFixed(2)} km</span>
          </div>
        </div>

        {/* Quick Add Step Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => handleQuickAddSteps(500)}
            disabled={isSyncingSteps}
            className="flex-1 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/20 hover:border-indigo-500/50 text-[9.5px] font-mono font-bold text-indigo-300 transition-all cursor-pointer disabled:opacity-40"
          >
            +500
          </button>
          <button
            onClick={() => handleQuickAddSteps(1000)}
            disabled={isSyncingSteps}
            className="flex-1 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/20 hover:border-indigo-500/50 text-[9.5px] font-mono font-bold text-indigo-300 transition-all cursor-pointer disabled:opacity-40"
          >
            +1,000
          </button>
          <button
            onClick={() => handleQuickAddSteps(2500)}
            disabled={isSyncingSteps}
            className="flex-1 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/20 hover:border-indigo-500/50 text-[9.5px] font-mono font-bold text-indigo-300 transition-all cursor-pointer disabled:opacity-40"
          >
            +2,500
          </button>
        </div>
      </div>

      {/* 3. INCUBATION CHAMBER & STEPS TO HATCH */}
      <div className="relative z-10 p-3.5 rounded-2xl bg-[#09112a]/90 border border-purple-500/25 space-y-3">
        {activeEgg ? (
          <div>
            {(() => {
              const eCur = activeEgg.currentSteps ?? activeEgg.currentEnergy ?? 0;
              const eTar = activeEgg.targetSteps ?? activeEgg.targetEnergy ?? 5000;
              const eProg = Math.min(100, Math.round((eCur / eTar) * 100));
              const isReadyToHatch = activeEgg.status === "READY_TO_HATCH" || eProg >= 100;

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Egg Sprite with crack pulse */}
                    <div className={`w-14 h-14 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center p-1.5 flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.25)] relative ${isReadyToHatch ? "animate-pulse" : ""}`}>
                      <img
                        src={activeEgg.sprite || "/eggs/egg_1.png"}
                        alt={activeEgg.name}
                        className={`w-full h-full object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] ${isReadyToHatch ? "animate-bounce" : "animate-float-slow"}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white font-heading truncate">
                          {activeEgg.name}
                        </h4>
                        <Badge className={`text-[8px] font-mono px-1 py-0 border ${getRarityBadge(activeEgg.rarity)}`}>
                          {activeEgg.rarity}
                        </Badge>
                      </div>
                      <p className="text-[9.5px] font-mono text-purple-300/70 truncate mt-0.5">
                        {isReadyToHatch ? "⚡ Ready to Hatch!" : `${(eTar - eCur).toLocaleString()} steps remaining`}
                      </p>
                      <div className="text-[10px] font-mono font-bold text-purple-300 mt-1">
                        {eCur.toLocaleString()} / {eTar.toLocaleString()} Steps ({eProg}%)
                      </div>
                    </div>
                  </div>

                  {/* Egg Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div
                      className={`h-full rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)] ${
                        isReadyToHatch
                          ? "bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 animate-pulse"
                          : "bg-gradient-to-r from-purple-500 to-indigo-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${eProg}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Hatch Action Button */}
                  {isReadyToHatch ? (
                    <Button
                      onClick={handleHatchEgg}
                      disabled={isHatching}
                      className="w-full h-8 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black font-mono text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse cursor-pointer"
                    >
                      {isHatching ? "Cracking Shell..." : "🐣 HATCH MYSTERY EGG NOW!"}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>Walking strides feed incubation energy</span>
                      <Link href="/beasts" className="text-purple-400 hover:underline">
                        Shop Eggs
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="py-2.5 text-center space-y-2">
            <span className="text-[10px] text-slate-400 font-mono block">Incubation chamber empty</span>
            <Link href="/beasts">
              <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono rounded-lg">
                <Plus className="w-3.5 h-3.5 mr-1" /> Place Egg in Chamber
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
