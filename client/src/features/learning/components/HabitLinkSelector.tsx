"use client";

import React from "react";
import { CheckCircle2, Target, Link2, Unlink } from "lucide-react";
import { useHabitStore } from "@/features/habits/store";
import { useLearningStore, FocusCategory } from "../store/useLearningStore";

const CATEGORIES: { id: FocusCategory; label: string; icon: string }[] = [
  { id: "STUDY", label: "Study & Academics", icon: "📚" },
  { id: "CODING", label: "Programming & Tech", icon: "💻" },
  { id: "READING", label: "Reading & Research", icon: "📖" },
  { id: "WORK", label: "Deep Work / Career", icon: "💼" },
  { id: "CREATIVE", label: "Creative & Design", icon: "🎨" },
  { id: "GENERAL", label: "General Focus", icon: "⚡" },
];

export const HabitLinkSelector: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { habits } = useHabitStore();
  const {
    selectedCategory,
    setCategory,
    linkedHabitId,
    linkedHabitName,
    setLinkedHabit,
  } = useLearningStore();

  return (
    <div className={`p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-4 ${className}`}>
      {/* Category Pills */}
      <div>
        <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-2">
          Focus Domain & Cognitive Sphere
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold"
                  : "bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="text-xs font-mono truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Habit Linker Dropdown */}
      <div className="pt-2 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-indigo-400" />
            Link Session Directly to Habit
          </label>
          {linkedHabitId && (
            <button
              type="button"
              onClick={() => setLinkedHabit(null)}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
            >
              <Unlink className="w-3 h-3" /> Unlink
            </button>
          )}
        </div>

        <select
          value={linkedHabitId || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              setLinkedHabit(null);
            } else {
              const found = habits.find((h) => h.id === val);
              setLinkedHabit(val, found?.name || "Habit");
            }
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="">-- No Linked Habit (General Session) --</option>
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.name} ({habit.category})
            </option>
          ))}
        </select>
        <span className="text-[10px] text-slate-400 font-sans mt-1 block">
          Completing this focus session will automatically advance linked habit progress!
        </span>
      </div>
    </div>
  );
};
