import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { CompletionType } from "../../types";
import { PixelCoinsIcon } from "@/components/ui/pixel/PixelIcons";

export const StepTiers: React.FC = () => {
  const { draft, updateTier } = useCreateHabitStore();

  const handleTargetValueChange = (tierKey: CompletionType, val: string) => {
    updateTier(tierKey, { targetValue: val ? parseFloat(val) : null });
  };

  const handleTargetUnitChange = (tierKey: CompletionType, val: string) => {
    updateTier(tierKey, { targetUnit: val });
  };

  const tiers: { key: CompletionType; label: string; subtitle: string }[] = [
    { key: "MINI", label: "MINIMUM (MINI)", subtitle: "Low-friction win for busy or low-energy days" },
    { key: "NORMAL", label: "TARGET (NORMAL)", subtitle: "Your standard daily target milestone" },
    { key: "ELITE", label: "OVERACHIEVE (ELITE)", subtitle: "Bonus push when you have extra energy" },
  ];

  return (
    <div className="space-y-4 font-pixel text-[#1d2d2a] select-none animate-in fade-in duration-150">
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-bold uppercase text-[#1d2d2a]">✦ Completion Tiers & Targets ✦</h2>
        <p className="text-[10px] text-[#5a6472] uppercase font-mono font-bold mt-0.5">Define milestones for standard, minimum, and overachieve completions.</p>
        <p className="text-[9px] text-[#ea580c] uppercase font-mono mt-1">Earn scaled EXP, Gold, and Stat rewards according to your effort.</p>
      </div>

      <div className="space-y-3">
        {tiers.map((t) => {
          const tierData = draft.tiers[t.key];

          return (
            <div key={t.key} className="p-3.5 bg-[#b0b8c4]/60 border-2 border-[#3b424c] space-y-2.5 shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="px-2 py-0.5 bg-[#2f3640] text-[#ffd166] border border-[#1d2d2a] text-xs font-bold shadow-[1px_1px_0_0_#1d2d2a]">
                    {t.label}
                  </span>
                  <p className="text-[9px] text-[#5a6472] font-mono mt-0.5">{t.subtitle}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="px-1.5 py-0.5 bg-[#2f3640] text-[#ffd166] border border-[#1d2d2a] text-[9px] font-bold">
                    +{tierData.baseExp} EXP
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#2f3640] text-[#ffb03a] border border-[#1d2d2a] text-[9px] font-bold flex items-center gap-0.5">
                    <PixelCoinsIcon className="w-2.5 h-2.5 text-[#ffd166]" />
                    +{tierData.baseGold}g
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#5a6472] text-white border border-[#1d2d2a] text-[9px] font-bold">
                    +{tierData.statReward} {draft.primaryStat.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-[#3b424c] uppercase mb-1">Target Amount</label>
                  <input
                    type="number"
                    className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-2.5 py-1.5 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
                    placeholder={t.key === "MINI" ? "e.g., 4" : t.key === "NORMAL" ? "e.g., 8" : "e.g., 10"}
                    value={tierData.targetValue ?? ""}
                    onChange={(e) => handleTargetValueChange(t.key, e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-[#3b424c] uppercase mb-1">Unit of Measurement</label>
                  <input
                    type="text"
                    className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-2.5 py-1.5 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
                    placeholder="e.g., Glasses, Pages, Minutes, Reps, Steps"
                    value={tierData.targetUnit || ""}
                    onChange={(e) => handleTargetUnitChange(t.key, e.target.value)}
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

