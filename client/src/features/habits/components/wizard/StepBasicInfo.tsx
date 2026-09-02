import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";

export const StepBasicInfo: React.FC = () => {
  const { draft, updateDraft } = useCreateHabitStore();

  return (
    <div className="space-y-4 font-pixel text-[#1d2d2a] select-none animate-in fade-in duration-150">
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-bold uppercase text-[#1d2d2a]">✦ Habit Information ✦</h2>
        <p className="text-[10px] text-[#5a6472] uppercase font-mono font-bold mt-0.5">What habit do you want to build?</p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] placeholder-[#5a6472] font-mono font-bold focus:outline-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
            placeholder="e.g., Drink 2.5L Water, Morning Exercise, Read 20 Pages, Daily Code Practice"
            value={draft.name}
            onChange={(e) => updateDraft({ name: e.target.value })}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
            Description / Reason (Optional)
          </label>
          <textarea
            className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] placeholder-[#5a6472] font-mono font-bold focus:outline-none h-20 resize-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
            placeholder="e.g., Stay hydrated throughout the day to boost energy and mental clarity."
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
              Category
            </label>
            <select
              className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none cursor-pointer shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
              value={draft.category}
              onChange={(e) => updateDraft({ category: e.target.value })}
            >
              <option value="Health">Health</option>
              <option value="Fitness">Fitness</option>
              <option value="Productivity">Productivity</option>
              <option value="Learning">Learning</option>
              <option value="Mindset">Mindset</option>
              <option value="Finance">Finance</option>
              <option value="Daily Routine">Daily Routine</option>
              <option value="Sleep">Sleep</option>
              <option value="Social">Social</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
              Primary Stat Boost
            </label>
            <select
              className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none cursor-pointer capitalize shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
              value={draft.primaryStat}
              onChange={(e) => updateDraft({ primaryStat: e.target.value })}
            >
              <option value="discipline">Discipline (Habit Willpower)</option>
              <option value="consistency">Consistency (Streak Stability)</option>
              <option value="focus">Focus (Concentration & Deep Work)</option>
              <option value="strength">Strength (Physical Power)</option>
              <option value="endurance">Endurance (Stamina & Persistence)</option>
              <option value="knowledge">Knowledge (Mental Sharpness)</option>
              <option value="recovery">Recovery (Rest & Vitality)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

