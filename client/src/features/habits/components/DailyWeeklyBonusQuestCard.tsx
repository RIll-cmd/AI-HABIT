"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Zap,
  Flame,
  Brain,
  Dumbbell,
  Gift,
  RefreshCw,
  Crown,
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
  Award,
  Swords,
  Coins,
  ShieldCheck,
  Footprints,
} from "lucide-react";
import { useDailyBonusStore, getDailyEggForLevel } from "@/store/useDailyBonusStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import Link from "next/link";

export const DailyWeeklyBonusQuestCard: React.FC = () => {
  const {
    habitBoostCharges,
    maxHabitBoostCharges,
    learningBoostCharges,
    maxLearningBoostCharges,
    workoutBoostCharges,
    maxWorkoutBoostCharges,
    dailyEggClaimed,
    shopRefreshCharges,
    maxShopRefreshCharges,
    weeklyBossPrDefeated,
    weeklyBonusesClaimedCount,
    weeklyTowerFloorsCleared,
    weeklyStepsAccumulated,
    claimDailyEgg,
    checkAndResetDaily,
  } = useDailyBonusStore();

  const { character, gainExp, gainGold, gainGems, gainStreakFreeze } = useCharacterStore();
  const [activeTab, setActiveTab] = useState<"DAILY_BONUSES" | "WEEKLY_QUESTS">("DAILY_BONUSES");
  const [claimedWeeklyQuests, setClaimedWeeklyQuests] = useState<Record<string, boolean>>({});
  const [isClaimingEgg, setIsClaimingEgg] = useState(false);
  const [timeLeftToMidnight, setTimeLeftToMidnight] = useState("");

  const charId = character?.id || "char-id-123";
  const charLevel = character?.level || 1;
  const scaledEgg = getDailyEggForLevel(charLevel);

  useEffect(() => {
    checkAndResetDaily();
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeftToMidnight(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [checkAndResetDaily]);

  const handleClaimEgg = async () => {
    if (dailyEggClaimed || isClaimingEgg) return;
    setIsClaimingEgg(true);
    await claimDailyEgg(charId, charLevel);
    setIsClaimingEgg(false);
  };

  const handleClaimWeeklyQuest = (questId: string, exp: number, gold: number, bonusType?: string) => {
    playBuffSFX("levelup");
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    gainExp(exp, `Weekly Quest Cleared: ${questId}`);
    gainGold(gold, `Weekly Bounty: ${questId}`);
    if (bonusType === "GEMS") gainGems(10, "Weekly Quest Bounty");
    if (bonusType === "FREEZE") gainStreakFreeze(1, "Weekly Discipline Reward");

    setClaimedWeeklyQuests((prev) => ({ ...prev, [questId]: true }));
    toast.success(`🎉 WEEKLY QUEST COMPLETED!`, {
      description: `+${exp} EXP, +${gold} Gold earned!`,
    });
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070D1C]/95 to-[#040814]/98 border border-cyan-500/30 p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-5 font-sans">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/15 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              SYSTEM SURGES & DIRECTIVES
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Reset in {timeLeftToMidnight || "00:00:00"}
            </span>
          </div>
          <h3 className="text-xl font-black font-heading text-white tracking-wide">
            Daily Bonuses & Weekly Quests
          </h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              playUIMenuSFX("confirm");
              setActiveTab("DAILY_BONUSES");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "DAILY_BONUSES"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Daily Bonuses (5)
          </button>
          <button
            type="button"
            onClick={() => {
              playUIMenuSFX("confirm");
              setActiveTab("WEEKLY_QUESTS");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "WEEKLY_QUESTS"
                ? "bg-purple-500 text-slate-950 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Weekly Quests (4)
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 5 CORE DAILY BONUSES MATRIX */}
      {/* ========================================================= */}
      {activeTab === "DAILY_BONUSES" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {/* 1. Habit Double Boost (5 charges) */}
          <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-cyan-500/25 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 relative group shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono font-bold text-[10px]">
                {habitBoostCharges}/{maxHabitBoostCharges} CHARGES
              </Badge>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-white">
                5x Habit 2x Boost
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                Doubles Gold & EXP on your next 5 completed daily habits.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 text-[10px] font-mono border-t border-white/5">
              <span className="text-slate-500">Auto-applies</span>
              <span className={habitBoostCharges > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}>
                {habitBoostCharges > 0 ? "⚡ ACTIVE (2X)" : "EXHAUSTED"}
              </span>
            </div>
          </div>

          {/* 2. Learning Double Multiplier (1 charge) */}
          <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-indigo-500/25 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-3 relative group shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                <Brain className="w-5 h-5" />
              </div>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 font-mono font-bold text-[10px]">
                {learningBoostCharges}/{maxLearningBoostCharges} CHARGE
              </Badge>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-white">
                1x Learning 2x Boost
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                Doubles EXP & Gold on your daily study/Pomodoro focus session.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 text-[10px] font-mono border-t border-white/5">
              <span className="text-slate-500">Auto-applies</span>
              <span className={learningBoostCharges > 0 ? "text-indigo-400 font-bold" : "text-slate-500"}>
                {learningBoostCharges > 0 ? "🧠 READY (2X)" : "USED TODAY"}
              </span>
            </div>
          </div>

          {/* 3. Workout Double Surge (1 charge) */}
          <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-red-500/25 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-3 relative group shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <Badge className="bg-red-500/20 text-red-300 border border-red-500/50 font-mono font-bold text-[10px]">
                {workoutBoostCharges}/{maxWorkoutBoostCharges} CHARGE
              </Badge>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-white">
                1x Workout 2x Surge
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                Doubles kinetic EXP, Gold & progression on your daily workout.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 text-[10px] font-mono border-t border-white/5">
              <span className="text-slate-500">Auto-applies</span>
              <span className={workoutBoostCharges > 0 ? "text-red-400 font-bold" : "text-slate-500"}>
                {workoutBoostCharges > 0 ? "⚔️ READY (2X)" : "USED TODAY"}
              </span>
            </div>
          </div>

          {/* 4. Daily Scaled Free Mystery Egg (1 claim) */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-950/90 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3 relative group shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Gift className="w-5 h-5" />
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono font-bold text-[10px]">
                LV.{charLevel} SCALED
              </Badge>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-white leading-tight">
                {scaledEgg.name}
              </h4>
              <p className="text-xs text-amber-300/90 font-mono mt-1">
                {scaledEgg.rarity} tier free companion egg!
              </p>
            </div>
            <Button
              type="button"
              disabled={dailyEggClaimed || isClaimingEgg}
              onClick={handleClaimEgg}
              className={`w-full h-8 text-[11px] font-mono font-black uppercase rounded-xl transition-all cursor-pointer ${
                dailyEggClaimed
                  ? "bg-slate-900 border border-slate-800 text-slate-500"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              }`}
            >
              {dailyEggClaimed ? "CLAIMED TODAY ✓" : isClaimingEgg ? "CLAIMING..." : "CLAIM FREE EGG"}
            </Button>
          </div>

          {/* 5. 5x Free Shop Refreshes (5 charges) */}
          <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-teal-500/25 hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-3 relative group shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <Badge className="bg-teal-500/20 text-teal-300 border border-teal-500/50 font-mono font-bold text-[10px]">
                {shopRefreshCharges}/{maxShopRefreshCharges} REROLLS
              </Badge>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-white">
                5x Free Shop Rerolls
              </h4>
              <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                Reroll items in the Armory & Market without spending tokens.
              </p>
            </div>
            <Link href="/shop" className="w-full">
              <Button
                type="button"
                className="w-full h-8 text-[11px] font-mono font-bold uppercase rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 hover:bg-teal-900 cursor-pointer"
              >
                GO TO SHOP
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: WEEKLY QUESTS BOARD */}
      {/* ========================================================= */}
      {activeTab === "WEEKLY_QUESTS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* Weekly Quest 1: Defeat Boss PR */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#170B1B]/80 via-[#0E0A1A]/80 to-[#080512]/90 border-2 border-red-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white">
                    Titan Executioner: Defeat Boss PR
                  </h4>
                  <span className="text-[10px] font-mono text-red-300">
                    Weekly Boss Confrontation
                  </span>
                </div>
              </div>
              <Badge className="bg-red-500/20 text-red-300 border border-red-500/50 font-mono font-bold text-[10px]">
                WEEKLY BOSS
              </Badge>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Challenge and overcome your current Weekly Boss in the Boss PR Arena by hitting your target exercise overloads.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-300 font-bold">+500 EXP</span>
                <span className="text-yellow-400 font-bold">+200 Gold</span>
                <span className="text-fuchsia-400 font-bold">+10 Gems</span>
              </div>

              {claimedWeeklyQuests["boss_pr"] ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs py-1">
                  CLEARED ✓
                </Badge>
              ) : weeklyBossPrDefeated ? (
                <Button
                  type="button"
                  onClick={() => handleClaimWeeklyQuest("boss_pr", 500, 200, "GEMS")}
                  className="h-8 px-4 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-mono font-black text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                >
                  CLAIM REWARD
                </Button>
              ) : (
                <Link href="/workouts/boss-pr">
                  <Button
                    type="button"
                    className="h-8 px-4 bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                  >
                    ENTER ARENA
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Weekly Quest 2: Claim each daily bonus 5x across the week */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#0C152B]/80 via-[#0A1022]/80 to-[#060A18]/90 border-2 border-cyan-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white">
                    Perfectionist Cadence
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-300">
                    Utilize Daily System Boosts 5x
                  </span>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono font-bold text-[10px]">
                {weeklyBonusesClaimedCount} / 5 USAGES
              </Badge>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Complete habits, learning sessions, workouts, and egg claims using daily bonuses at least 5 times across the week.
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (weeklyBonusesClaimedCount / 5) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-300 font-bold">+400 EXP</span>
                <span className="text-yellow-400 font-bold">+150 Gold</span>
                <span className="text-cyan-300 font-bold">+1 Freeze</span>
              </div>

              {claimedWeeklyQuests["daily_bonuses"] ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs py-1">
                  CLEARED ✓
                </Badge>
              ) : (
                <Button
                  type="button"
                  disabled={weeklyBonusesClaimedCount < 5}
                  onClick={() => handleClaimWeeklyQuest("daily_bonuses", 400, 150, "FREEZE")}
                  className={`h-8 px-4 font-mono font-black text-xs uppercase rounded-xl cursor-pointer ${
                    weeklyBonusesClaimedCount >= 5
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                      : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {weeklyBonusesClaimedCount >= 5 ? "CLAIM REWARD" : "IN PROGRESS"}
                </Button>
              )}
            </div>
          </div>

          {/* Weekly Quest 3: Spire Conqueror (3 Tower Floors) */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#140C26]/80 via-[#0F081E]/80 to-[#090514]/90 border-2 border-purple-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white">
                    Spire Conqueror
                  </h4>
                  <span className="text-[10px] font-mono text-purple-300">
                    Tower of Ascension Trial
                  </span>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/50 font-mono font-bold text-[10px]">
                {Math.min(3, weeklyTowerFloorsCleared)} / 3 FLOORS
              </Badge>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Clear or attempt at least 3 Ascension Tower floors to demonstrate unyielding spiritual mastery.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-300 font-bold">+600 EXP</span>
                <span className="text-yellow-400 font-bold">+250 Gold</span>
                <span className="text-purple-300 font-bold">+50 Tokens</span>
              </div>

              {claimedWeeklyQuests["tower"] ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs py-1">
                  CLEARED ✓
                </Badge>
              ) : (
                <Link href="/tower">
                  <Button
                    type="button"
                    className="h-8 px-4 bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-900 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                  >
                    ENTER TOWER
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Weekly Quest 4: Ascendant Stride (40,000 Steps) */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#0C1E1E]/80 via-[#081717]/80 to-[#040E0E]/90 border-2 border-emerald-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white">
                    Ascendant Stride
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-300">
                    Kinetic Movement Quota
                  </span>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-[10px]">
                {((character?.dailySteps || 0) * 4).toLocaleString()} / 40,000 STEPS
              </Badge>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Accumulate total weekly walking steps across workouts and daily activities to strengthen companions.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-amber-300 font-bold">+750 EXP</span>
                <span className="text-yellow-400 font-bold">+300 Gold</span>
              </div>

              {claimedWeeklyQuests["steps"] ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs py-1">
                  CLEARED ✓
                </Badge>
              ) : (
                <Link href="/beasts">
                  <Button
                    type="button"
                    className="h-8 px-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer"
                  >
                    VIEW SANCTUM
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
