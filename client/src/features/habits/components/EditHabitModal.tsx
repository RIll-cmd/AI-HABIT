"use client";

import React, { useState, useEffect } from "react";
import { Habit, HabitDifficulty, ScheduleType } from "../types";
import { useHabitStore } from "../store/useHabitStore";
import { toast } from "sonner";
import { X, Save, Target, Calendar, Sparkles } from "lucide-react";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";

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
        playBuffSFX();
        toast.success("Habit protocol updated successfully!");
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-[#0C1226]/98 via-[#080E20]/98 to-[#050914]/98 border border-cyan-500/30 rounded-[28px] w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-slate-100 animate-in zoom-in-95 duration-200 backdrop-blur-2xl">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-heading text-white tracking-tight">
                Edit Habit Protocol
              </h2>
              <p className="text-[10.5px] font-mono text-slate-400">
                Configure execution quotas and schedule settings
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playUIMenuSFX();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-mono text-xs">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                HABIT TITLE *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all font-sans text-xs"
                placeholder="e.g. Daily Hydration Protocol"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-white focus:outline-none cursor-pointer transition-all"
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
            <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
              DESCRIPTION / LOGIC
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white focus:outline-none transition-all font-sans text-xs"
              placeholder="e.g. Maintain high baseline cellular hydration"
            />
          </div>

          {/* Schedule & Target Frequency */}
          <div className="p-4 bg-[#060B18] border border-cyan-500/20 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Target Frequency & Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  SCHEDULE INTERVAL
                </label>
                <select
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                  className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="DAILY">DAILY</option>
                  <option value="X_TIMES_WEEK">X TIMES PER WEEK</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="SPECIFIC_DAYS">SPECIFIC DAYS</option>
                </select>
              </div>

              {scheduleType === "DAILY" && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    TIMES PER DAY (QUOTA)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g., 3, 4, or 5 times daily"
                  />
                </div>
              )}

              {scheduleType === "X_TIMES_WEEK" && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    TIMES PER WEEK
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={timesPerWeek}
                    onChange={(e) => setTimesPerWeek(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              )}

              {scheduleType === "MONTHLY" && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    TIMES PER MONTH
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={timesPerMonth}
                    onChange={(e) => setTimesPerMonth(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Target Unit */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                TARGET UNIT
              </label>
              <input
                type="text"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none text-xs"
                placeholder="e.g. Glasses, Pages, Reps, Liters"
              />
            </div>
          </div>

          {/* Difficulty & Primary Stat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                THREAT DIFFICULTY
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as HabitDifficulty)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer"
              >
                <option value="EASY">EASY (+Low Rewards)</option>
                <option value="MEDIUM">MEDIUM (+Balanced Rewards)</option>
                <option value="HARD">HARD (+High Rewards)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                PRIMARY STAT REWARD
              </label>
              <select
                value={primaryStat}
                onChange={(e) => setPrimaryStat(e.target.value)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer capitalize"
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/15">
            <button
              type="button"
              onClick={() => {
                playUIMenuSFX();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Protocol"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

