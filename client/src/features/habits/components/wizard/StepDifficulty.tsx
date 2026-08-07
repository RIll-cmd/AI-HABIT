import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { HabitDifficulty } from "../../types";

export const StepDifficulty: React.FC = () => {
  const { draft, updateDraft } = useCreateHabitStore();

  const handleDifficultyChange = (diff: HabitDifficulty) => {
    updateDraft({ difficulty: diff });
  };

  const difficulties: { type: HabitDifficulty; desc: string; exp: string }[] = [
    { type: "EASY", desc: "Small tasks that take < 10 mins.", exp: "Low Rewards" },
    { type: "MEDIUM", desc: "Requires moderate effort (10-30 mins).", exp: "Standard Rewards" },
    { type: "HARD", desc: "Significant effort or > 45 mins.", exp: "High Rewards" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Difficulty</h2>
        <p className="text-slate-400">This determines the baseline rewards.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {difficulties.map((d) => (
          <button
            key={d.type}
            onClick={() => handleDifficultyChange(d.type)}
            className={`p-6 rounded-lg border-2 text-left transition-all ${
              draft.difficulty === d.type
                ? "border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "border-slate-700 bg-[#0D1117] hover:border-slate-500"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold text-slate-100">{d.type}</span>
              <span className="text-sm font-medium text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">
                {d.exp}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
