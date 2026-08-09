"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RestTimer() {
  const { restTimerEnd, clearRestTimer, startRestTimer } = useWorkoutStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!restTimerEnd) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((restTimerEnd - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearRestTimer();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [restTimerEnd, clearRestTimer]);

  if (!restTimerEnd && timeLeft === 0) {
    return null;
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center gap-3 animate-in slide-in-from-bottom-5 w-64">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span className="font-mono text-3xl font-bold tracking-tight">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
        <button onClick={clearRestTimer} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      
      <div className="flex gap-2 w-full justify-between mt-2">
        <Button variant="outline" size="sm" className="h-8 flex-1 text-xs bg-slate-800 border-slate-700 hover:bg-slate-700" onClick={() => startRestTimer(30)}>+30s</Button>
        <Button variant="outline" size="sm" className="h-8 flex-1 text-xs bg-slate-800 border-slate-700 hover:bg-slate-700" onClick={() => startRestTimer(60)}>+60s</Button>
        <Button variant="default" size="sm" className="h-8 flex-1 text-xs bg-emerald-600 hover:bg-emerald-500" onClick={clearRestTimer}>Skip</Button>
      </div>
    </div>
  );
}
