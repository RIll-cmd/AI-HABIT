import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { CompletionType } from "../../types";

export const StepReview: React.FC = () => {
  const { draft } = useCreateHabitStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Review & Create</h2>
        <p className="text-slate-400">Verify your new habit settings.</p>
      </div>

      <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6">
        <div className="border-b border-slate-700 pb-4 mb-4">
          <h3 className="text-2xl font-bold text-slate-100 mb-1">{draft.name || "Unnamed Habit"}</h3>
          <div className="flex space-x-4 text-sm text-slate-400">
            <span>Category: <strong className="text-slate-200">{draft.category}</strong></span>
            <span>Stat: <strong className="text-cyan-400 capitalize">{draft.primaryStat}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">SCHEDULE</p>
            <p className="text-slate-200 font-medium">{draft.scheduleType.replace(/_/g, " ")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">DIFFICULTY</p>
            <p className="text-slate-200 font-medium">{draft.difficulty}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-500 mb-2">COMPLETION TIERS</p>
          {(["MINI", "NORMAL", "ELITE"] as CompletionType[]).map((tierKey) => {
            const t = draft.tiers[tierKey];
            return (
              <div key={tierKey} className="flex justify-between items-center text-sm border-l-2 pl-3 py-1 border-slate-700">
                <span className="w-16 font-bold text-slate-300">{tierKey}</span>
                <span className="flex-1 text-slate-400">
                  {t.targetValue ? `${t.targetValue} ${t.targetUnit || ""}` : "Not Set"}
                </span>
                <span className="text-cyan-400 font-medium text-right w-24">
                  +{t.baseExp} EXP
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
