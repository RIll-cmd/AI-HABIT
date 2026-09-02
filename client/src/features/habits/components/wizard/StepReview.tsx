import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { CompletionType } from "../../types";

export const StepReview: React.FC = () => {
  const { draft } = useCreateHabitStore();

  return (
    <div className="space-y-4 font-pixel text-[#1d2d2a] select-none animate-in fade-in duration-150">
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-bold uppercase text-[#1d2d2a]">✦ Review Habit Configuration ✦</h2>
        <p className="text-[10px] text-[#5a6472] uppercase font-mono font-bold mt-0.5">Confirm your habit parameters before activating.</p>
      </div>

      <div className="bg-[#b0b8c4]/60 border-2 border-[#3b424c] p-4 space-y-3.5 shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]">
        <div className="border-b-2 border-[#3b424c]/30 pb-3">
          <h3 className="text-sm sm:text-base font-bold uppercase text-[#1d2d2a] mb-1.5">{draft.name || "Unnamed Habit"}</h3>
          {draft.description && (
            <p className="text-xs text-[#2a2b2e] font-mono mb-2">{draft.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2 py-0.5 bg-[#2f3640] text-[#ffd166] border border-[#1d2d2a] text-[9px] font-bold">
              Category: {draft.category}
            </span>
            <span className="px-2 py-0.5 bg-[#5a6472] text-white border border-[#1d2d2a] text-[9px] font-bold">
              Stat Boost: +{draft.primaryStat.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-[#e2e7ec] border-2 border-[#3b424c]">
            <p className="text-[9px] text-[#5a6472] uppercase font-bold mb-0.5 font-mono">SCHEDULE</p>
            <p className="text-[#1d2d2a] font-bold">{draft.scheduleType.replace(/_/g, " ")}</p>
          </div>
          <div className="p-2.5 bg-[#e2e7ec] border-2 border-[#3b424c]">
            <p className="text-[9px] text-[#5a6472] uppercase font-bold mb-0.5 font-mono">DIFFICULTY</p>
            <p className="text-[#ea580c] font-bold">{draft.difficulty}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-[#3b424c] uppercase font-mono">COMPLETION TIERS</p>
          {(["MINI", "NORMAL", "ELITE"] as CompletionType[]).map((tierKey) => {
            const t = draft.tiers[tierKey];

            return (
              <div key={tierKey} className="flex justify-between items-center text-xs p-2 bg-[#e2e7ec] border-2 border-[#3b424c]">
                <span className="px-2 py-0.5 bg-[#2f3640] text-[#ffd166] border border-[#1d2d2a] text-[9px] font-bold">
                  {tierKey}
                </span>
                <span className="text-[10px] text-[#1d2d2a] font-mono font-bold">
                  {t.targetValue ? `${t.targetValue} ${t.targetUnit || ""}` : "Not Set"}
                </span>
                <span className="text-[#ea580c] font-bold text-xs">
                  +{t.baseExp} EXP • +{t.baseGold}g
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

