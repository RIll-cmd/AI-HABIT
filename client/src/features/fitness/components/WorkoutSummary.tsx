import React from "react";
import { Award, Zap, Flame, Clock, Check, X, Shield, Dumbbell } from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { useFitnessStore } from "../store/useFitnessStore";

export const WorkoutSummary: React.FC = () => {
  const { latestRewardsSummary, dismissRewardsSummary } = useFitnessStore();

  if (!latestRewardsSummary) return null;

  const { exp, gold, statsEarned, volume, duration } = latestRewardsSummary;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-3xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] relative overflow-hidden text-center text-slate-100">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissRewardsSummary}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>

        <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
          WORKOUT COMPLETED
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-4">
          Session Rewards Granted
        </h2>

        {/* Session Stats Chips */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-left">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-400">DURATION</div>
              <div className="text-sm font-bold text-white font-mono">{formatDuration(duration)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-left">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-400">TOTAL VOLUME</div>
              <div className="text-sm font-bold text-white font-mono">{volume} kg</div>
            </div>
          </div>
        </div>

        {/* Rewards Earned Grid */}
        <div className="space-y-2 mb-6 text-left">
          <div className="text-xs font-mono font-bold text-slate-400 mb-2">REWARDS UNLOCKED</div>

          {/* EXP & Gold */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyan-950/50 border border-cyan-500/40 rounded-xl p-3 flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-cyan-300">+{exp} EXP</div>
                <div className="text-[10px] text-slate-400">Character Leveling</div>
              </div>
            </div>

            <div className="bg-amber-950/50 border border-amber-500/40 rounded-xl p-3 flex items-center gap-3">
              <CurrencyIcon type="GOLD" size="md" />
              <div>
                <div className="text-xs font-bold text-amber-300">+{gold} Gold</div>
                <div className="text-[10px] text-slate-400">System Economy</div>
              </div>
            </div>
          </div>

          {/* Stat Boosts */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mt-3">
            <div className="text-[10px] font-mono text-slate-400 mb-2 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> STAT INCREASES APPLIED
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statsEarned).map(([stat, val]) => {
                if (!val || val <= 0) return null;
                return (
                  <span
                    key={stat}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 font-bold capitalize"
                  >
                    +{val} {stat}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={dismissRewardsSummary}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm uppercase tracking-wider py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Awesome! Continue
        </button>
      </div>
    </div>
  );
};
