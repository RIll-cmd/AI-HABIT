import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";

export const StepBasicInfo: React.FC = () => {
  const { draft, updateDraft } = useCreateHabitStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Basic Information</h2>
        <p className="text-slate-400">What habit do you want to build?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Habit Name
          </label>
          <input
            type="text"
            className="w-full bg-[#0D1117] border border-slate-700 rounded-md px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            placeholder="e.g., Drink Water"
            value={draft.name}
            onChange={(e) => updateDraft({ name: e.target.value })}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            className="w-full bg-[#0D1117] border border-slate-700 rounded-md px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all h-24 resize-none"
            placeholder="e.g., Drink at least 2 liters of water throughout the day."
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              className="w-full bg-[#0D1117] border border-slate-700 rounded-md px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              value={draft.category}
              onChange={(e) => updateDraft({ category: e.target.value })}
            >
              <option value="Health">Health</option>
              <option value="Fitness">Fitness</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Sleep">Sleep</option>
              <option value="Personal">Personal</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="Social">Social</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Primary Stat
            </label>
            <select
              className="w-full bg-[#0D1117] border border-slate-700 rounded-md px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              value={draft.primaryStat}
              onChange={(e) => updateDraft({ primaryStat: e.target.value })}
            >
              <option value="strength">Strength</option>
              <option value="endurance">Endurance</option>
              <option value="knowledge">Knowledge</option>
              <option value="recovery">Recovery</option>
              <option value="focus">Focus</option>
              <option value="discipline">Discipline</option>
              <option value="consistency">Consistency</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
