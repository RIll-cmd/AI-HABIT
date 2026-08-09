import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { ScheduleType } from "../../types";

export const StepSchedule: React.FC = () => {
  const { draft, updateDraft } = useCreateHabitStore();

  const handleTypeChange = (type: ScheduleType) => {
    updateDraft({ scheduleType: type });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Schedule</h2>
        <p className="text-slate-400">When should this habit generate missions?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {["DAILY", "SPECIFIC_DAYS", "X_TIMES_WEEK", "MONTHLY"].map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type as ScheduleType)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              draft.scheduleType === type
                ? "border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "border-slate-700 bg-[#0D1117] hover:border-slate-500"
            }`}
          >
            <div className="font-bold text-slate-100 mb-1">
              {type.replace(/_/g, " ")}
            </div>
          </button>
        ))}
      </div>

      {draft.scheduleType === "DAILY" && (
        <div className="p-4 bg-[#0D1117] border border-slate-700 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Target Frequency (Times per day)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="20"
              className="w-full bg-[#151C33] border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. 1 (Once daily), 3, 4, or 5"
              value={draft.tiers.NORMAL.targetValue || 1}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                updateDraft({
                  tiers: {
                    ...draft.tiers,
                    NORMAL: { ...draft.tiers.NORMAL, targetValue: val },
                    MINI: { ...draft.tiers.MINI, targetValue: Math.max(1, Math.floor(val / 2)) },
                    ELITE: { ...draft.tiers.ELITE, targetValue: val + 2 }
                  }
                });
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Example: For "Drink Water", set 4 to accomplish 4 glasses per day.
          </p>
        </div>
      )}

      {draft.scheduleType === "SPECIFIC_DAYS" && (
        <div className="p-4 bg-[#0D1117] border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-300 mb-3">Select Days:</p>
          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <label key={day} className="flex items-center space-x-2 text-slate-300">
                <input type="checkbox" className="form-checkbox text-cyan-500 bg-slate-800 border-slate-600 rounded" />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {draft.scheduleType === "X_TIMES_WEEK" && (
        <div className="p-4 bg-[#0D1117] border border-slate-700 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Times per week
          </label>
          <input
            type="number"
            min="1"
            max="7"
            className="w-full bg-[#151C33] border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            placeholder="e.g., 3"
            value={draft.schedule.timesPerWeek || ""}
            onChange={(e) => useCreateHabitStore.getState().updateSchedule({ timesPerWeek: parseInt(e.target.value) || null })}
          />
        </div>
      )}

      {draft.scheduleType === "MONTHLY" && (
        <div className="p-4 bg-[#0D1117] border border-slate-700 rounded-lg">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Times per month
          </label>
          <input
            type="number"
            min="1"
            max="31"
            className="w-full bg-[#151C33] border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            placeholder="e.g., 4"
            value={draft.schedule.timesPerMonth || ""}
            onChange={(e) => useCreateHabitStore.getState().updateSchedule({ timesPerMonth: parseInt(e.target.value) || null })}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Preferred Time (Optional)
        </label>
        <input
          type="time"
          className="w-full bg-[#0D1117] border border-slate-700 rounded-md px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          value={draft.preferredTime || ""}
          onChange={(e) => updateDraft({ preferredTime: e.target.value })}
        />
        <p className="text-xs text-slate-500 mt-1">
          This does not mean the mission expires at this time. It's a preferred activity time.
        </p>
      </div>
    </div>
  );
};
