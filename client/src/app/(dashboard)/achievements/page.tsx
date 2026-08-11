"use client";

import React, { useEffect, useState } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { API_BASE_URL } from "@/constants";
import { Sparkles, CheckCircle2, Target } from "lucide-react";
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
}

const CATEGORIES = ["ALL", "HABITS", "WORKOUT", "TOWER", "SOCIAL"];

export default function AchievementsPage() {
  const { character, loadCharacter } = useCharacterStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (character?.id) {
      fetchAchievements();
    }
  }, [character?.id]);

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/achievements/${character?.id}`);
      if (res.ok) {
        const data = await res.json();
        setAchievements(data.achievements);
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
      const res = await fetch(`${API_BASE_URL}/api/achievements/claim/${character?.id}/${achId}`, {
        method: "POST"
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

  const filteredAchievements = achievements.filter(
    (a) => activeTab === "ALL" || a.category === activeTab
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-heading tracking-wide flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Achievements Gallery
        </h1>
        <p className="text-slate-400 mt-2">
          Track your milestones, claim rewards, and cement your legacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playUIMenuSFX("confirm");
              setActiveTab(cat);
            }}
            className={`px-4 py-2 rounded-lg font-bold font-mono text-sm transition-all ${
              activeTab === cat
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                : "bg-[#151C33] text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {cat === "ALL" && "ALL"}
            {cat === "HABITS" && "🎯 HABITS"}
            {cat === "WORKOUT" && "🏋️ WORKOUT"}
            {cat === "TOWER" && "⚔️ TOWER"}
            {cat === "SOCIAL" && "💬 SOCIAL"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-slate-400 animate-pulse font-mono">Loading Achievements...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-[#151C33] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              {/* Background glow if completed but unclaimed */}
              {ach.isCompleted && !ach.isClaimed && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
              )}
              
              {/* Header */}
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 p-1 relative">
                  <img src={ach.icon} alt={ach.title} className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                  {ach.isClaimed && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold font-heading">{ach.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{ach.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 mb-4 relative z-10">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1.5">
                  <span>PROGRESS</span>
                  <span>
                    {Math.min(ach.currentProgress, ach.targetValue)} / {ach.targetValue}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.isCompleted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-gradient-to-r from-blue-600 to-cyan-400"
                    }`}
                    style={{ width: `${Math.min((ach.currentProgress / ach.targetValue) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions / Rewards */}
              <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex gap-3">
                  {ach.rewardGold > 0 && (
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                      +{ach.rewardGold} G
                    </span>
                  )}
                  {ach.rewardGems > 0 && (
                    <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
                      +{ach.rewardGems} D
                    </span>
                  )}
                </div>

                {ach.isClaimed ? (
                  <span className="text-xs font-bold text-emerald-500/50 px-3 py-1.5 bg-emerald-950/20 rounded-lg border border-emerald-500/10">
                    CLAIMED
                  </span>
                ) : ach.isCompleted ? (
                  <button
                    onClick={() => claimReward(ach.id)}
                    className="text-xs font-bold text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 px-4 py-1.5 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all hover:scale-105 active:scale-95"
                  >
                    CLAIM REWARD
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                    <Target className="w-3 h-3" /> IN PROGRESS
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredAchievements.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono">
              No achievements found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
