"use client";

import React, { useEffect, useState } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { API_BASE_URL } from "@/constants";
import { Sparkles, CheckCircle2, Target, Trophy, Filter, Award, Lock, Check } from "lucide-react";
import { playUIMenuSFX, playBuffSFX, playAIRASound } from "@/utils/audio";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  targetValue: number;
  currentProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewardGold: number;
  rewardGems: number;
  unlockRequirement?: string;
}

const CATEGORIES = ["ALL", "HABITS", "WORKOUT", "TOWER", "SOCIAL"];
type StatusFilter = "ALL" | "OBTAINED" | "NOT_OBTAINED";

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "First Step of Greatness",
    description: "Complete your first daily habit mission.",
    category: "HABITS",
    icon: "/icons/Icon10.png",
    targetValue: 1,
    currentProgress: 1,
    isCompleted: true,
    isClaimed: true,
    rewardGold: 100,
    rewardGems: 10,
    unlockRequirement: "Complete 1 daily habit mission",
  },
  {
    id: "ach-2",
    title: "Unbroken Streak",
    description: "Maintain a 7-day habit streak.",
    category: "HABITS",
    icon: "/icons/Icon15.png",
    targetValue: 7,
    currentProgress: 3,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 250,
    rewardGems: 25,
    unlockRequirement: "Maintain a 7-day habit streak",
  },
  {
    id: "ach-3",
    title: "Consistency Sovereign",
    description: "Complete 50 daily habit missions.",
    category: "HABITS",
    icon: "/icons/Icon20.png",
    targetValue: 50,
    currentProgress: 12,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 500,
    rewardGems: 50,
    unlockRequirement: "Complete 50 daily habit missions",
  },
  {
    id: "ach-4",
    title: "Iron Will",
    description: "Maintain a 30-day habit streak.",
    category: "HABITS",
    icon: "/icons/Icon25.png",
    targetValue: 30,
    currentProgress: 3,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 1000,
    rewardGems: 100,
    unlockRequirement: "Maintain a 30-day habit streak",
  },
  {
    id: "ach-5",
    title: "Novice Lifter",
    description: "Complete 1 workout session.",
    category: "WORKOUT",
    icon: "/icons/Icon30.png",
    targetValue: 1,
    currentProgress: 1,
    isCompleted: true,
    isClaimed: true,
    rewardGold: 100,
    rewardGems: 10,
    unlockRequirement: "Log 1 workout session",
  },
  {
    id: "ach-6",
    title: "Strength Unleashed",
    description: "Log 10 workout sessions.",
    category: "WORKOUT",
    icon: "/icons/Icon35.png",
    targetValue: 10,
    currentProgress: 4,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 300,
    rewardGems: 30,
    unlockRequirement: "Log 10 workout sessions",
  },
  {
    id: "ach-7",
    title: "Barbell Master",
    description: "Log 25 workout sessions.",
    category: "WORKOUT",
    icon: "/icons/Icon40.png",
    targetValue: 25,
    currentProgress: 4,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 750,
    rewardGems: 75,
    unlockRequirement: "Log 25 workout sessions",
  },
  {
    id: "ach-8",
    title: "Titan of the Gym",
    description: "Achieve an S-Rank on any exercise e1RM.",
    category: "WORKOUT",
    icon: "/icons/Icon45.png",
    targetValue: 1,
    currentProgress: 0,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 1500,
    rewardGems: 150,
    unlockRequirement: "Achieve S-Rank e1RM on any exercise",
  },
  {
    id: "ach-9",
    title: "Tower Challenger",
    description: "Conquer Floor 5 in the Tower.",
    category: "TOWER",
    icon: "/icons/Icon50.png",
    targetValue: 5,
    currentProgress: 2,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 200,
    rewardGems: 20,
    unlockRequirement: "Clear Floor 5 in Tower of Ascension",
  },
  {
    id: "ach-10",
    title: "Floor Dominator",
    description: "Conquer Floor 15 in the Tower.",
    category: "TOWER",
    icon: "/icons/Icon55.png",
    targetValue: 15,
    currentProgress: 2,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 500,
    rewardGems: 50,
    unlockRequirement: "Clear Floor 15 in Tower of Ascension",
  },
  {
    id: "ach-11",
    title: "Tower Monarch",
    description: "Conquer Floor 30 in the Tower.",
    category: "TOWER",
    icon: "/icons/Icon60.png",
    targetValue: 30,
    currentProgress: 2,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 1200,
    rewardGems: 120,
    unlockRequirement: "Clear Floor 30 in Tower of Ascension",
  },
  {
    id: "ach-12",
    title: "Grandmaster Ascendant",
    description: "Reach the 50th Floor of the Tower.",
    category: "TOWER",
    icon: "/icons/Icon65.png",
    targetValue: 50,
    currentProgress: 2,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 2500,
    rewardGems: 250,
    unlockRequirement: "Reach Floor 50 in Tower of Ascension",
  },
  {
    id: "ach-13",
    title: "AI Assistant Partner",
    description: "Send 10 prompts to AIRA.",
    category: "SOCIAL",
    icon: "/icons/Icon70.png",
    targetValue: 10,
    currentProgress: 5,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 150,
    rewardGems: 15,
    unlockRequirement: "Send 10 messages/prompts to AIRA",
  },
  {
    id: "ach-14",
    title: "Guild Contributor",
    description: "Earn 1,000 Total Power Score.",
    category: "SOCIAL",
    icon: "/icons/Icon75.png",
    targetValue: 1000,
    currentProgress: 350,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 400,
    rewardGems: 40,
    unlockRequirement: "Reach 1,000 Total Character Power",
  },
  {
    id: "ach-15",
    title: "Ascended Being",
    description: "Reach Character Level 25.",
    category: "SOCIAL",
    icon: "/icons/Icon80.png",
    targetValue: 25,
    currentProgress: 5,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 1000,
    rewardGems: 100,
    unlockRequirement: "Reach Level 25",
  },
  {
    id: "ach-16",
    title: "Shadow Monarch Ascended",
    description: "Reach Character Level 50.",
    category: "SOCIAL",
    icon: "/icons/Icon85.png",
    targetValue: 50,
    currentProgress: 5,
    isCompleted: false,
    isClaimed: false,
    rewardGold: 3000,
    rewardGems: 300,
    unlockRequirement: "Reach Level 50",
  },
];

export default function AchievementsPage() {
  const { character, loadCharacter } = useCharacterStore();
  const [achievements, setAchievements] = useState<Achievement[]>(FALLBACK_ACHIEVEMENTS);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);

  const characterId = character?.id || "char-id-123";

  useEffect(() => {
    fetchAchievements();
  }, [characterId]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/achievements/${characterId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.achievements && data.achievements.length > 0) {
          setAchievements(data.achievements);
        }
      }
    } catch (err) {
      console.error("Error fetching achievements", err);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (achId: string) => {
    try {
      playUIMenuSFX("confirm");
      const res = await fetch(`${API_BASE_URL}/api/achievements/claim/${characterId}/${achId}`, {
        method: "POST",
      });
      if (res.ok) {
        playBuffSFX();
        playAIRASound("NEW_RESISTANCE");
        fetchAchievements();
        loadCharacter();
      }
    } catch (err) {
      console.error("Error claiming reward", err);
    }
  };

  // Filter achievements by category and status
  const filteredAchievements = achievements.filter((a) => {
    const matchesCategory = activeCategory === "ALL" || a.category === activeCategory;
    const isUnlocked = a.isCompleted || a.isClaimed;

    let matchesStatus = true;
    if (statusFilter === "OBTAINED") {
      matchesStatus = isUnlocked;
    } else if (statusFilter === "NOT_OBTAINED") {
      matchesStatus = !isUnlocked;
    }

    return matchesCategory && matchesStatus;
  });

  // Calculate summary metrics
  const totalCount = achievements.length;
  const obtainedCount = achievements.filter((a) => a.isCompleted || a.isClaimed).length;
  const completionPercent = totalCount > 0 ? Math.round((obtainedCount / totalCount) * 100) : 0;
  const totalGoldEarned = achievements
    .filter((a) => a.isClaimed)
    .reduce((sum, a) => sum + a.rewardGold, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#151C33] via-[#1A223D] to-[#151C33] border border-amber-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                SYSTEM MILESTONE REPOSITORY
              </span>
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight mt-0.5">
                Obtainable Achievements & Trophies
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                View all obtainable milestones, complete objectives to claim Gold and Gems, and filter between your unlocked and locked achievements.
              </p>
            </div>
          </div>

          {/* Telemetry Stats Pill Box */}
          <div className="flex items-center gap-4 bg-[#0B1020]/90 border border-white/10 p-3.5 rounded-2xl font-mono text-xs shadow-xl">
            <div className="text-center px-2">
              <span className="block text-[10px] text-slate-400 uppercase">UNLOCKED</span>
              <span className="text-lg font-bold text-amber-400">
                {obtainedCount} / {totalCount}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-slate-400 uppercase">PROGRESS</span>
              <span className="text-lg font-bold text-cyan-400">{completionPercent}%</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <span className="block text-[10px] text-slate-400 uppercase">GOLD EARNED</span>
              <span className="text-lg font-bold text-emerald-400">+{totalGoldEarned}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Status Toggles & Category Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#151C33]/90 border border-white/10 rounded-2xl p-4 shadow-xl">
        {/* Status Filter (ALL / OBTAINED / NOT OBTAINED) */}
        <div className="flex items-center gap-2 font-mono text-xs bg-[#0B1020] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setStatusFilter("ALL");
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>ALL ({achievements.length})</span>
          </button>

          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setStatusFilter("OBTAINED");
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === "OBTAINED"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>OBTAINED ({obtainedCount})</span>
          </button>

          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setStatusFilter("NOT_OBTAINED");
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === "NOT_OBTAINED"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>NOT OBTAINED ({totalCount - obtainedCount})</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playUIMenuSFX("confirm");
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 border ${
                activeCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {cat === "ALL" && "ALL CATEGORIES"}
              {cat === "HABITS" && "🎯 HABITS"}
              {cat === "WORKOUT" && "🏋️ WORKOUT"}
              {cat === "TOWER" && "⚔️ TOWER"}
              {cat === "SOCIAL" && "💬 SOCIAL"}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono animate-pulse">
          Loading system achievement gallery...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => {
            const isUnlocked = ach.isCompleted || ach.isClaimed;
            const unlockHow = ach.unlockRequirement || ach.description;

            return (
              <div
                key={ach.id}
                className={`bg-[#151C33] border rounded-2xl p-5 flex flex-col relative overflow-hidden group transition-all ${
                  ach.isClaimed
                    ? "border-emerald-500/30 bg-emerald-950/10"
                    : ach.isCompleted
                    ? "border-amber-500/50 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    : "border-white/10 hover:border-blue-500/40"
                }`}
              >
                {/* Background glow if completed but unclaimed */}
                {ach.isCompleted && !ach.isClaimed && (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                )}

                {/* Header: Icon, Title & Status */}
                <div className="flex gap-4 items-start relative z-10 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 p-1.5 relative shadow-inner">
                    <img
                      src={ach.icon}
                      alt={ach.title}
                      onError={(e) => {
                        e.currentTarget.src = "/icons/Icon10.png";
                      }}
                      className={`w-full h-full object-contain ${
                        !isUnlocked ? "opacity-40 grayscale" : "drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                      }`}
                    />
                    {ach.isClaimed && (
                      <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-lg border border-emerald-400">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                        {ach.category}
                      </span>
                      {isUnlocked ? (
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                          LOCKED
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white font-heading leading-snug truncate">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed font-sans">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Clear Unlock Requirement Callout Box */}
                <div className="my-2 p-2.5 rounded-xl bg-[#0B1020] border border-slate-800/80 text-[11px] font-mono flex items-start gap-2">
                  <Target className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] font-bold text-cyan-400 uppercase">HOW TO GET:</span>
                    <span className="text-slate-300 font-sans">{unlockHow}</span>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="my-3 relative z-10">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>PROGRESS</span>
                    <span className="font-bold text-slate-200">
                      {Math.min(ach.currentProgress, ach.targetValue)} / {ach.targetValue}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.isCompleted || ach.isClaimed
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                          : "bg-gradient-to-r from-blue-600 to-indigo-400"
                      }`}
                      style={{
                        width: `${Math.min((ach.currentProgress / ach.targetValue) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Footer Rewards & Claim Action */}
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between relative z-10 font-mono">
                  <div className="flex gap-2.5">
                    {ach.rewardGold > 0 && (
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        +{ach.rewardGold}g Gold
                      </span>
                    )}
                    {ach.rewardGems > 0 && (
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                        +{ach.rewardGems} Gems
                      </span>
                    )}
                  </div>

                  {ach.isClaimed ? (
                    <span className="text-[11px] font-bold text-emerald-400/80 px-2.5 py-1 bg-emerald-950/40 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CLAIMED
                    </span>
                  ) : ach.isCompleted ? (
                    <button
                      onClick={() => claimReward(ach.id)}
                      className="text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95"
                    >
                      CLAIM REWARD
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                      <Lock className="w-3 h-3" /> IN PROGRESS
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredAchievements.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 font-mono bg-[#151C33] border border-slate-800 rounded-2xl space-y-2">
              <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No Achievements Found</p>
              <p className="text-xs text-slate-500">Try adjusting your category or status filters above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
