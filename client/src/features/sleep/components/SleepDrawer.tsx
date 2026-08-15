"use client";

import React, { useEffect, useState } from "react";
import { X, Moon, Sparkles, Activity, Clock, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSleepStore } from "../store/useSleepStore";
import { SleepLoggerCard } from "./SleepLoggerCard";
import { SleepHistoryChart } from "./SleepHistoryChart";

export const SleepDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useSleepStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!mounted || !isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-out Sidebar Drawer */}
      <aside
        className="relative w-full max-w-lg h-full bg-[#070C18]/98 border-l border-cyan-500/30 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 space-y-6 animate-in slide-in-from-right duration-300 scan-lines"
      >
        {/* Top Drawer Controls */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                SYSTEM TELEMETRY
              </span>
              <h3 className="text-lg font-black font-heading text-white tracking-wide">
                Sleep & Somatic Recovery
              </h3>
            </div>
          </div>

          <button
            onClick={closeDrawer}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content: Interactive Sleep Logger & Live Stats */}
        <div className="space-y-6 flex-1">
          <SleepLoggerCard onLogSuccess={() => {}} className="p-4 sm:p-5" />
          <SleepHistoryChart className="p-4 sm:p-5" />
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-center font-mono text-[10px] text-slate-500">
          Ascend OS Biometric Optimization Engine • Optimal Target: 8.0h Daily
        </div>
      </aside>
    </div>
  );
};
