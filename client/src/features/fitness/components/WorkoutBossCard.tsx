import React, { useEffect } from "react";
import { Skull, Target, Zap, Shield, CheckCircle2, Flame, Award } from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { useFitnessStore } from "../store/useFitnessStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useUser } from "@/context/UserContext";

export const WorkoutBossCard: React.FC = () => {
  const { activeBoss, isLoadingBoss, loadWeeklyBoss } = useFitnessStore();
  const { character } = useCharacterStore();
  const { user } = useUser();

  useEffect(() => {
    const targetId = character?.id || user?.id;
    loadWeeklyBoss(targetId);
  }, [loadWeeklyBoss, character?.id, user?.id]);

  if (isLoadingBoss) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-center text-slate-500 font-mono text-xs">
        Summoning Weekly Boss...
      </div>
    );
  }

  if (!activeBoss) return null;

  // Calculate estimated success chance based on character stats & target weight
  const recoveryStat = character?.stats?.recovery || 1;
  const strengthStat = character?.stats?.strength || 1;
  const successChance = Math.min(95, Math.max(45, 60 + (recoveryStat * 2) + (strengthStat * 1.5)));

  let rewardsObj = { exp: 500, gold: 100, stat: "strength", statAmount: 1 };
  try {
    if (activeBoss.rewards) {
      rewardsObj = JSON.parse(activeBoss.rewards);
    }
  } catch (e) {
    // fallback default
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 transition-all border-2 shadow-2xl ${
        activeBoss.isDefeated
          ? "bg-slate-950/90 border-emerald-500/40 shadow-emerald-950/30"
          : "bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-950 border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)]"
      }`}
    >
      {/* Background Red/Green Glow Accent */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none ${
          activeBoss.isDefeated ? "bg-emerald-500/10" : "bg-rose-500/15"
        }`}
      />

      {/* Defeated / Cleared Watermark Stamp */}
      {activeBoss.isDefeated && (
        <div className="absolute top-6 right-6 z-10 rotate-12 bg-emerald-500/20 border-4 border-emerald-400 text-emerald-300 font-black text-2xl font-mono px-4 py-1.5 rounded-2xl shadow-lg tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          CLEARED
        </div>
      )}

      {/* Header Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-3 rounded-2xl border ${
            activeBoss.isDefeated
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/20 border-rose-500/40 text-rose-400"
          }`}
        >
          {activeBoss.isDefeated ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Skull className="w-6 h-6 animate-pulse" />
          )}
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">
            WEEKLY BOSS ENCOUNTER
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {activeBoss.name}
          </h3>
        </div>
      </div>

      {/* Boss Target Info Box */}
      <div
        className={`p-4 rounded-2xl border mb-5 ${
          activeBoss.isDefeated
            ? "bg-slate-900/60 border-slate-800 text-slate-400"
            : "bg-slate-950/80 border-rose-500/30 text-slate-100"
        }`}
      >
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-rose-400" />
          PHYSICAL OBJECTIVE
        </div>
        <div className="text-2xl font-black font-mono text-white flex items-center justify-between">
          <span>{activeBoss.targetExercise}</span>
          <span className="text-cyan-400">
            {activeBoss.targetWeight} kg × {activeBoss.targetReps}
          </span>
        </div>

        {/* Success Chance bar */}
        {!activeBoss.isDefeated && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Current Success Chance:</span>
            <span className="font-mono font-bold text-emerald-400">{Math.round(successChance)}%</span>
          </div>
        )}
      </div>

      {/* Loot Rewards Box */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          VICTORY REWARDS & LOOT
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-mono text-xs font-bold">
              <Zap className="w-3.5 h-3.5" /> +{rewardsObj.exp}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">EXP</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-mono text-xs font-bold">
              <CurrencyIcon type="GOLD" size="xs" /> +{rewardsObj.gold}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Gold</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-mono text-xs font-bold capitalize">
              <Shield className="w-3.5 h-3.5" /> +{rewardsObj.statAmount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono capitalize">
              {rewardsObj.stat}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
