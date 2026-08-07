import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { CompletionType } from "../../types";

export const StepTiers: React.FC = () => {
  const { draft, updateTier } = useCreateHabitStore();

  const handleTargetValueChange = (tierKey: CompletionType, val: string) => {
    updateTier(tierKey, { targetValue: val ? parseFloat(val) : null });
  };

  const handleTargetUnitChange = (tierKey: CompletionType, val: string) => {
    updateTier(tierKey, { targetUnit: val });
  };

  const tiers: CompletionType[] = ["MINI", "NORMAL", "ELITE"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Completion Tiers</h2>
        <p className="text-slate-400">Define the targets for each completion level.</p>
        <p className="text-xs text-amber-500 mt-2">Rewards are auto-calculated to protect the economy.</p>
      </div>

      <div className="space-y-6">
        {tiers.map((tierKey) => {
          const tierData = draft.tiers[tierKey];
          return (
            <div key={tierKey} className="p-5 bg-[#0D1117] border border-slate-700 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-100">{tierKey} TIER</h3>
                <div className="text-sm space-x-3 text-cyan-400">
                  <span>+{tierData.baseExp} EXP</span>
                  <span>+{tierData.baseGold} Gold</span>
                  <span>+{tierData.statReward} {draft.primaryStat.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Value</label>
                  <input
                    type="number"
                    className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. 1"
                    value={tierData.targetValue || ""}
                    onChange={(e) => handleTargetValueChange(tierKey, e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Unit</label>
                  <input
                    type="text"
                    className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. Glass"
                    value={tierData.targetUnit || ""}
                    onChange={(e) => handleTargetUnitChange(tierKey, e.target.value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
