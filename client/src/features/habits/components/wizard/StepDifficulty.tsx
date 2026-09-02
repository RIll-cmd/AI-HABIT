import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { HabitDifficulty } from "../../types";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";
import { playUIMenuSFX } from "@/utils/audio";

export const StepDifficulty: React.FC = () => {
  const { draft, updateDraft } = useCreateHabitStore();

  const handleDifficultyChange = (diff: HabitDifficulty) => {
    playUIMenuSFX();
    updateDraft({ difficulty: diff });
  };

  const difficulties: { type: HabitDifficulty; label: string; desc: string; exp: string; variant: "success" | "gold" | "danger" }[] = [
    {
      type: "EASY",
      label: "Easy Habit (< 10 mins)",
      desc: "Quick, low-friction habits (e.g., drink water, take vitamins, 5-min morning stretch).",
      exp: "+15–60 EXP",
      variant: "success",
    },
    {
      type: "MEDIUM",
      label: "Medium Habit (15–30 mins)",
      desc: "Standard daily focused routine (e.g., 20-min cardio, read 15 pages, daily journaling).",
      exp: "+30–120 EXP",
      variant: "gold",
    },
    {
      type: "HARD",
      label: "Hard Habit (45+ mins)",
      desc: "Challenging growth routines (e.g., intense gym workout, deep focus coding sprint, 5km run).",
      exp: "+60–250 EXP",
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-4 font-pixel text-[#1d2d2a] select-none animate-in fade-in duration-150">
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-bold uppercase text-[#1d2d2a]">✦ Habit Difficulty ✦</h2>
        <p className="text-[10px] text-[#5a6472] uppercase font-mono font-bold mt-0.5">Determines the baseline EXP, Gold, and Stat progression earned.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {difficulties.map((d) => (
          <button
            key={d.type}
            type="button"
            onClick={() => handleDifficultyChange(d.type)}
            className={`p-4 border-2 text-left cursor-pointer transition-all active:translate-y-0.5 ${
              draft.difficulty === d.type
                ? "border-[#1d2d2a] bg-[#ffb03a] text-[#1d2d2a] shadow-[3px_3px_0_0_#1d2d2a]"
                : "border-[#3b424c] bg-[#2f3640] text-[#ffd166] hover:border-[#ffb03a]/70"
            }`}
          >
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase">{d.label}</span>
              <PixelBadge variant={d.variant} size="sm">
                {d.exp}
              </PixelBadge>
            </div>
            <p className={`text-[10px] font-mono font-medium leading-relaxed ${draft.difficulty === d.type ? "text-[#1d2d2a]" : "text-[#d1d6dc]"}`}>
              {d.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

