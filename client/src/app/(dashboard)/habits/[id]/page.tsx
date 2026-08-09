"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useHabitStore } from "@/features/habits/store/useHabitStore";
import { EditHabitModal } from "@/features/habits/components/EditHabitModal";

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.id as string;
  
  const { habits, loadHabits, updateHabitStatus, isLoading } = useHabitStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (habits.length === 0) {
      loadHabits();
    }
  }, [habits.length, loadHabits]);

  const habit = habits.find(h => h.id === habitId);

  if (isLoading && !habit) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mr-3" />
        Loading Habit Data...
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Habit Not Found</h2>
        <p className="text-slate-400 mb-6">This habit may have been deleted or doesn't exist.</p>
        <Link href="/habits" className="text-cyan-400 hover:underline">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: "PAUSED" | "ACTIVE" | "ARCHIVED" | "DELETED") => {
    setIsMenuOpen(false);
    
    // Warn before delete
    if (newStatus === "DELETED") {
      const confirmDelete = window.confirm("Are you sure you want to delete this habit? This action cannot be undone.");
      if (!confirmDelete) return;
    }

    await updateHabitStatus(habit.id, newStatus);
    
    if (newStatus === "DELETED") {
      router.push("/habits");
    }
  };

  const strength = habit.metrics?.habitStrength || 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link href="/habits" className="inline-block text-slate-400 hover:text-cyan-400 font-medium mb-6 transition-colors">
        &larr; Back to Habits
      </Link>
      
      {/* HEADER */}
      <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6 lg:p-10 mb-8 relative">
        <div className="absolute top-6 right-6">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-slate-200 p-2 rounded hover:bg-slate-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-xl z-10 overflow-hidden">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-cyan-300 hover:bg-slate-700 font-semibold"
                >
                  Edit Habit & Frequency
                </button>
                
                {habit.status === "ACTIVE" ? (
                  <button 
                    onClick={() => handleStatusChange("PAUSED")}
                    className="w-full text-left px-4 py-2 text-sm text-amber-400 hover:bg-slate-700"
                  >
                    Pause
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStatusChange("ACTIVE")}
                    className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700"
                  >
                    Resume
                  </button>
                )}

                <button 
                  onClick={() => handleStatusChange("ARCHIVED")}
                  className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:bg-slate-700"
                >
                  Archive
                </button>
                <button 
                  onClick={() => handleStatusChange("DELETED")}
                  className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-700 border-t border-slate-700 mt-1 pt-2"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl">
            {habit.icon || "💧"}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">{habit.name}</h1>
            <p className="text-slate-400">
              {habit.category} • {habit.primaryStat}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <span className={`px-3 py-1 text-xs font-bold rounded ${
            habit.status === "ACTIVE" ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800" :
            habit.status === "PAUSED" ? "bg-amber-900/50 text-amber-400 border border-amber-800" :
            "bg-slate-800 text-slate-400 border border-slate-700"
          }`}>
            {habit.status}
          </span>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-800">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Habit Strength</span>
            <span className="text-2xl font-black text-cyan-400">{Math.round(strength)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000"
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CONFIGURATION */}
        <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Schedule & Frequency</span>
              <span className="text-slate-200 font-medium">
                {habit.scheduleType}
                {habit.tiers?.find((t) => t.tier === "NORMAL")?.targetValue
                  ? ` (${habit.tiers.find((t) => t.tier === "NORMAL")?.targetValue} ${habit.tiers.find((t) => t.tier === "NORMAL")?.targetUnit || "times"})`
                  : ""}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Difficulty</span>
              <span className="text-slate-200 font-medium">{habit.difficulty}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Primary Stat</span>
              <span className="text-slate-200 font-medium capitalize">{habit.primaryStat}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Preferred Time</span>
              <span className="text-slate-200 font-medium">{habit.preferredTime || "Throughout Day"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase">Created</span>
              <span className="text-slate-200 font-medium">{new Date(habit.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-200 mb-6 border-b border-slate-800 pb-2">Current Progress</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">Consistency</span>
                <span className="text-xl font-bold text-slate-200">{habit.metrics?.currentConsistency || 0}%</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">Success Rate</span>
                <span className="text-xl font-bold text-slate-200">{habit.metrics?.successRate || 0}%</span>
              </div>
            </div>
            
            <div className="text-center p-4 bg-slate-900/30 rounded border border-slate-800/50">
              <p className="text-slate-400 text-sm">Advanced analytics and historical calendars are under construction.</p>
            </div>
          </div>
        </div>
      </div>

      <EditHabitModal
        habit={habit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
