import React from "react";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { ScheduleType } from "../../types";
import { playUIMenuSFX } from "@/utils/audio";

export const StepSchedule: React.FC = () => {
  const { draft, updateDraft, updateSchedule } = useCreateHabitStore();

  const handleTypeChange = (type: ScheduleType) => {
    playUIMenuSFX();
    updateDraft({ scheduleType: type });
  };

  const selectedDays: string[] = (() => {
    try {
      return draft.schedule.daysOfWeek ? JSON.parse(draft.schedule.daysOfWeek) : [];
    } catch {
      return [];
    }
  })();

  const handleToggleDay = (day: string) => {
    playUIMenuSFX();
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    updateSchedule({ daysOfWeek: JSON.stringify(newDays) });
  };

  const scheduleOptions: { id: ScheduleType; label: string; desc: string }[] = [
    { id: "DAILY", label: "Every Day", desc: "Build momentum with daily repetition" },
    { id: "SPECIFIC_DAYS", label: "Specific Days", desc: "E.g., Mon, Wed, Fri only" },
    { id: "X_TIMES_WEEK", label: "Times Per Week", desc: "Flexible weekly target (e.g. 3x/week)" },
    { id: "MONTHLY", label: "Monthly", desc: "Monthly routine (e.g. review budget 1x/mo)" },
  ];

  return (
    <div className="space-y-4 font-pixel text-[#1d2d2a] select-none animate-in fade-in duration-150">
      <div className="text-center mb-4">
        <h2 className="text-sm sm:text-base font-bold uppercase text-[#1d2d2a]">✦ Frequency & Schedule ✦</h2>
        <p className="text-[10px] text-[#5a6472] uppercase font-mono font-bold mt-0.5">How often do you want to complete this habit?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {scheduleOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleTypeChange(opt.id)}
            className={`p-3 border-2 text-left cursor-pointer transition-all active:translate-y-0.5 ${
              draft.scheduleType === opt.id
                ? "border-[#1d2d2a] bg-[#ffb03a] text-[#1d2d2a] shadow-[2px_2px_0_0_#1d2d2a]"
                : "border-[#3b424c] bg-[#2f3640] text-[#ffd166] hover:border-[#ffb03a]/70"
            }`}
          >
            <div className="text-xs font-bold uppercase">{opt.label}</div>
            <div className={`text-[10px] font-mono mt-0.5 ${draft.scheduleType === opt.id ? "text-[#1d2d2a]" : "text-[#d1d6dc]"}`}>
              {opt.desc}
            </div>
          </button>
        ))}
      </div>

      {draft.scheduleType === "DAILY" && (
        <div className="p-3.5 bg-[#b0b8c4]/60 border-2 border-[#3b424c] space-y-1.5 shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]">
          <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
            Target Frequency (Times per day)
          </label>
          <input
            type="number"
            min="1"
            max="20"
            className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
            placeholder="e.g., 1 (Once daily), or 8 (e.g., 8 glasses of water)"
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
          <p className="text-[9px] text-[#5a6472] uppercase font-mono mt-1">
            Example: For "Daily Hydration", set 8 to target 8 glasses of water per day.
          </p>
        </div>
      )}

      {draft.scheduleType === "SPECIFIC_DAYS" && (
        <div className="p-3.5 bg-[#b0b8c4]/60 border-2 border-[#3b424c] space-y-2.5 shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]">
          <p className="text-[10px] font-bold text-[#3b424c] uppercase font-mono">Select Days of the Week:</p>
          <div className="grid grid-cols-7 gap-1.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const isChecked = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`py-2 text-center text-xs font-bold font-mono uppercase border-2 cursor-pointer transition-all active:translate-y-0.5 ${
                    isChecked
                      ? "bg-[#ffb03a] text-[#1d2d2a] border-[#1d2d2a] shadow-[1px_1px_0_0_#1d2d2a]"
                      : "bg-[#2f3640] text-[#d1d6dc] border-[#1d2d2a] hover:border-[#ffb03a]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {draft.scheduleType === "X_TIMES_WEEK" && (
        <div className="p-3.5 bg-[#b0b8c4]/60 border-2 border-[#3b424c] space-y-1.5 shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]">
          <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
            Target completions per week
          </label>
          <input
            type="number"
            min="1"
            max="7"
            className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
            placeholder="e.g., 3 (e.g. 3 gym sessions per week)"
            value={draft.schedule.timesPerWeek || ""}
            onChange={(e) => updateSchedule({ timesPerWeek: parseInt(e.target.value) || null })}
          />
        </div>
      )}

      {draft.scheduleType === "MONTHLY" && (
        <div className="p-3.5 bg-[#b0b8c4]/60 border-2 border-[#3b424c] space-y-1.5 shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]">
          <label className="block text-[10px] font-bold text-[#3b424c] uppercase mb-1">
            Target completions per month
          </label>
          <input
            type="number"
            min="1"
            max="31"
            className="w-full bg-[#e2e7ec] border-2 border-[#1d2d2a] focus:border-[#ffb03a] px-3 py-2 text-xs text-[#1d2d2a] font-mono font-bold focus:outline-none shadow-[inset_0_0_6px_rgba(0,0,0,0.1)]"
            placeholder="e.g., 4 (e.g. weekly finance review 4x a month)"
            value={draft.schedule.timesPerMonth || ""}
            onChange={(e) => updateSchedule({ timesPerMonth: parseInt(e.target.value) || null })}
          />
        </div>
      )}
    </div>
  );
};

