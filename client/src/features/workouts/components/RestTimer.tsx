"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { X, Clock, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";

export function RestTimer() {
  const { restTimerEnd, clearRestTimer, startRestTimer } = useWorkoutStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!restTimerEnd) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((restTimerEnd - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        playBuffSFX("speed");
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
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-br from-[#0C1226]/98 via-[#080E20]/98 to-[#050914]/98 backdrop-blur-2xl text-white p-4 rounded-[22px] shadow-[0_0_40px_rgba(6,182,212,0.3)] border border-cyan-500/40 flex flex-col items-center gap-3 animate-in slide-in-from-bottom-5 w-72">
      {/* Top Header */}
      <div className="flex items-center gap-3 w-full justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
              REST INTERVAL
            </span>
            <span className="font-mono text-2xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            playUIMenuSFX("decline");
            clearRestTimer();
          }}
          className="p-1.5 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex gap-2 w-full justify-between">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs bg-[#050914] border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/50 hover:text-white rounded-xl cursor-pointer"
          onClick={() => {
            playUIMenuSFX("confirm");
            startRestTimer(30);
          }}
        >
          +30s
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs bg-[#050914] border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/50 hover:text-white rounded-xl cursor-pointer"
          onClick={() => {
            playUIMenuSFX("confirm");
            startRestTimer(60);
          }}
        >
          +60s
        </Button>
        <Button
          variant="default"
          size="sm"
          className="h-8 flex-1 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.4)] cursor-pointer"
          onClick={() => {
            playUIMenuSFX("confirm");
            clearRestTimer();
          }}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

