"use client";

import React, { useState, useEffect } from "react";
import { Habit, HabitDifficulty, ScheduleType } from "../types";
import { useHabitStore } from "../store/useHabitStore";
import { toast } from "sonner";
import { X, Save, Target, Calendar } from "lucide-react";
import { playVoiceLine } from "@/utils/audio";

interface EditHabitModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, isOpen, onClose }) => {
  const { updateHabitDetails } = useHabitStore();

  const normalTier = habit.tiers?.find((t) => t.tier === "NORMAL");
  const initialTargetVal = normalTier?.targetValue || 1;
  const initialUnit = normalTier?.targetUnit || "";

  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || "");
  const [category, setCategory] = useState(habit.category || "Health");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>(habit.difficulty);
  const [primaryStat, setPrimaryStat] = useState<string>(habit.primaryStat);
  const [scheduleType, setScheduleType] = useState<ScheduleType>(habit.scheduleType);
  const [preferredTime, setPreferredTime] = useState(habit.preferredTime || "");
  
  // Frequency & Targets
  const [targetValue, setTargetValue] = useState<number>(initialTargetVal);
  const [targetUnit, setTargetUnit] = useState<string>(initialUnit);
  const [timesPerWeek, setTimesPerWeek] = useState<number>(habit.schedule?.timesPerWeek || 3);
  const [timesPerMonth, setTimesPerMonth] = useState<number>(habit.schedule?.timesPerMonth || 10);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || "");
      setCategory(habit.category || "Health");
      setDifficulty(habit.difficulty);
      setPrimaryStat(habit.primaryStat);
      setScheduleType(habit.scheduleType);
      setPreferredTime(habit.preferredTime || "");
      const norm = habit.tiers?.find((t) => t.tier === "NORMAL");
      setTargetValue(norm?.targetValue || 1);
      setTargetUnit(norm?.targetUnit || "");
      setTimesPerWeek(habit.schedule?.timesPerWeek || 3);
      setTimesPerMonth(habit.schedule?.timesPerMonth || 10);
    }
  }, [habit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Habit name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const updatedTiers = [
        {
          tier: "MINI" as const,
          targetType: "COUNT",
          targetValue: Math.max(1, Math.floor(targetValue / 2)),
          targetUnit: targetUnit,
          baseExp: 25,
          baseGold: 10,
          statReward: 1,
        },
        {
          tier: "NORMAL" as const,
          targetType: "COUNT",
          targetValue: targetValue,
          targetUnit: targetUnit,
          baseExp: 50,
          baseGold: 20,
          statReward: 2,
        },
        {
          tier: "ELITE" as const,
          targetType: "COUNT",
          targetValue: targetValue + 2,
          targetUnit: targetUnit,
          baseExp: 100,
          baseGold: 40,
          statReward: 4,
        },
      ];

      const payload = {
        name,
        description,
        category,
        difficulty,
        primaryStat,
        scheduleType,
        preferredTime: preferredTime || null,
        schedule: {
          timesPerWeek: scheduleType === "X_TIMES_WEEK" ? timesPerWeek : null,
          timesPerMonth: scheduleType === "MONTHLY" ? timesPerMonth : null,
        },
        tiers: updatedTiers,
      };

      const result = await updateHabitDetails(habit.id, payload);
      if (result) {
        toast.success("Habit updated successfully!");
        playVoiceLine("/sounds/AIRA Persona/AI-CONFIRMED.mp3");
        onClose();
      } else {
        toast.error("Failed to update habit.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving habit changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-cyan-500/30 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Edit Habit & Target Frequency</h2>
              <p className="text-xs text-slate-400">Configure target count and schedule settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Habit Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                placeholder="e.g. Drink Water"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
              >
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Mindset">Mindset</option>
                <option value="Productivity">Productivity</option>
                <option value="Finance">Finance</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
              placeholder="e.g. Stay hydrated throughout the day"
            />
          </div>

          {/* Schedule & Target Frequency */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Target Frequency & Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Schedule Interval
                </label>
                <select
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                  className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                >
                  <option value="DAILY">DAILY</option>
                  <option value="X_TIMES_WEEK">X TIMES PER WEEK</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="SPECIFIC_DAYS">SPECIFIC DAYS</option>
                </select>
              </div>

              {scheduleType === "DAILY" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Times Per Day (Target Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm font-mono font-bold text-cyan-300"
                    placeholder="e.g., 3, 4, or 5 times daily"
                  />
                </div>
              )}

              {scheduleType === "X_TIMES_WEEK" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Times Per Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={timesPerWeek}
                    onChange={(e) => setTimesPerWeek(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm font-mono font-bold text-cyan-300"
                  />
                </div>
              )}

              {scheduleType === "MONTHLY" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Times Per Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={timesPerMonth}
                    onChange={(e) => setTimesPerMonth(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm font-mono font-bold text-cyan-300"
                  />
                </div>
              )}
            </div>

            {/* Target Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Target Unit (Optional)
              </label>
              <input
                type="text"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                placeholder="e.g. Glasses, Pages, Reps, Liters"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Display format: Accomplish {targetValue} {targetUnit || "times"} {scheduleType === "DAILY" ? "daily" : "per schedule"}
              </p>
            </div>
          </div>

          {/* Difficulty & Primary Stat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as HabitDifficulty)}
                className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
              >
                <option value="EASY">EASY (+Low Rewards)</option>
                <option value="MEDIUM">MEDIUM (+Balanced Rewards)</option>
                <option value="HARD">HARD (+High Rewards)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Primary Stat Reward
              </label>
              <select
                value={primaryStat}
                onChange={(e) => setPrimaryStat(e.target.value)}
                className="w-full bg-[#151C33] border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm capitalize"
              >
                <option value="discipline">Discipline</option>
                <option value="consistency">Consistency</option>
                <option value="strength">Strength</option>
                <option value="endurance">Endurance</option>
                <option value="focus">Focus</option>
                <option value="knowledge">Knowledge</option>
                <option value="recovery">Recovery</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
