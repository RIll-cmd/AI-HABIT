import React from "react";
import Link from "next/link";
import { Habit } from "../types";

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const strength = habit.metrics?.habitStrength || 0;
  
  // A simplistic status display based on whether today's mission was completed or not
  // (Assuming if they haven't completed a mission today, it's 'Pending' or 'Scheduled')
  // We don't have mission history injected into Habit yet for the MVP frontend display
  const todayStatus = "Pending";

  return (
    <div className="bg-[#0D1117] border border-slate-700 rounded-lg p-5 hover:border-slate-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
            {habit.icon || "💧"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 truncate w-48">
              {habit.name}
            </h3>
            <p className="text-xs text-slate-400">
              {habit.category} • {habit.primaryStat} • {habit.scheduleType}
            </p>
          </div>
        </div>
        <Link 
          href={`/habits/${habit.id}`}
          className="text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors"
        >
          View
        </Link>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400 font-medium">Habit Strength</span>
          <span className="text-cyan-400 font-bold">{Math.round(strength)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
        <span className="text-slate-400">Today:</span>
        <span className="text-slate-300 font-semibold">{todayStatus}</span>
      </div>
    </div>
  );
};
