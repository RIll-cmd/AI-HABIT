"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useHabitStore } from "@/features/habits/store/useHabitStore";
import { HabitCard } from "@/features/habits/components";

export default function HabitsDashboardPage() {
  const { habits, isLoading, loadHabits } = useHabitStore();

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const activeHabits = useMemo(() => habits.filter(h => h.status === "ACTIVE"), [habits]);
  const averageStrength = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    const sum = activeHabits.reduce((acc, h) => acc + (h.metrics?.habitStrength || 0), 0);
    return Math.round(sum / activeHabits.length);
  }, [activeHabits]);
  
  // Note: For MVP, overall completion is a mock value since we don't have historical mission stats aggregated per character yet.
  const overallCompletion = 87; 

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">HABITS</h1>
          <p className="text-slate-400 mt-1">Build your real-life progression.</p>
        </div>
        <Link 
          href="/habits/create"
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-md font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
        >
          + New Habit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6 flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Active Habits</span>
          <span className="text-4xl font-black text-slate-100">{activeHabits.length}</span>
        </div>
        <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6 flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg Strength</span>
          <span className="text-4xl font-black text-cyan-400">{averageStrength}%</span>
        </div>
        <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6 flex flex-col justify-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Overall Completion</span>
          <span className="text-4xl font-black text-emerald-400">{overallCompletion}%</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-200 uppercase tracking-wide">Active Habits</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
          <p className="text-slate-400 mt-4">Loading your habits...</p>
        </div>
      ) : activeHabits.length === 0 ? (
        <div className="text-center py-20 bg-[#0D1117] border border-slate-800 rounded-lg">
          <p className="text-slate-400 mb-4">You have no active habits.</p>
          <Link href="/habits/create" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">
            Create your first habit
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
