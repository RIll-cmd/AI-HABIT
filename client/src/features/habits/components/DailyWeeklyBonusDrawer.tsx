"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Sparkles, Zap, Gift, ChevronLeft, ChevronRight, GripVertical, Minimize2, Maximize2 } from "lucide-react";
import { useDailyBonusStore } from "@/store/useDailyBonusStore";
import { DailyWeeklyBonusQuestCard } from "./DailyWeeklyBonusQuestCard";
import { playUIMenuSFX } from "@/utils/audio";

export function DailyWeeklyBonusDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const isDraggingRef = useRef(false);
  const { habitBoostCharges, dailyEggClaimed } = useDailyBonusStore();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ascend_bonus_drawer_minimized");
      if (saved !== null) {
        setIsMinimized(saved === "true");
      }
    } catch (e) {}
  }, []);

  const toggleMinimized = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ascend_bonus_drawer_minimized", String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleButtonClick = () => {
    if (isDraggingRef.current) return;
    playUIMenuSFX("confirm");
    setIsOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Draggable and Minimizable Floating Side Trigger */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -380, bottom: 380 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none touch-none"
      >
        {isMinimized ? (
          /* ========================================================= */
          /* ULTRA-COMPACT MINIMIZED MODE (38x38px Docked Icon Tab)   */
          /* ========================================================= */
          <div className="relative group flex items-center">
            {/* Expand toggle on hover */}
            <button
              type="button"
              onClick={toggleMinimized}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:text-white cursor-pointer shadow-md"
              title="Expand Tab"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>

            {/* Draggable Icon Tab */}
            <button
              type="button"
              onClick={handleButtonClick}
              className="bg-gradient-to-l from-[#0B1020]/95 via-[#080E20]/95 to-[#050914]/98 border-y border-l border-cyan-500/40 hover:border-cyan-400 p-2 rounded-l-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center gap-1 cursor-grab active:cursor-grabbing transition-all hover:translate-x-[-2px]"
              title="Drag up/down to move. Click to open Daily Bonuses."
            >
              <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-amber-400 shadow-sm">
                <Zap className="w-4 h-4" />
              </div>
              {!dailyEggClaimed && (
                <span className="w-2 h-2 rounded-full bg-amber-400 border border-[#0B1020]" />
              )}
            </button>
          </div>
        ) : (
          /* ========================================================= */
          /* EXPANDED TELEMETRY PILL WITH DRAG HANDLE & MINIMIZE BTN  */
          /* ========================================================= */
          <div className="relative group flex items-center">
            <div className="bg-gradient-to-l from-[#0B1020]/95 via-[#080E20]/95 to-[#050914]/98 border-y border-l border-cyan-500/40 hover:border-cyan-400 p-2 rounded-l-2xl shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center gap-2 transition-all">
              {/* Drag Grip Handle */}
              <div
                className="text-slate-500 hover:text-cyan-400 cursor-grab active:cursor-grabbing p-0.5"
                title="Drag up/down to reposition"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {/* Main Clickable Area */}
              <button
                type="button"
                onClick={handleButtonClick}
                className="flex items-center gap-2 cursor-pointer text-left focus:outline-none"
              >
                {/* Static Icon */}
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-amber-400 shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>

                {/* Compact Text Label */}
                <div className="flex flex-col items-start pr-1 text-left">
                  <span className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                    <span>BONUSES</span>
                    <ChevronLeft className="w-3 h-3 text-cyan-400" />
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {!dailyEggClaimed ? "🎁 EGG READY" : `${habitBoostCharges}/5 Charges`}
                  </span>
                </div>
              </button>

              {/* Minimize to icon toggle button */}
              <button
                type="button"
                onClick={toggleMinimized}
                className="w-5 h-5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 flex items-center justify-center text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors ml-0.5"
                title="Minimize side tab"
              >
                <Minimize2 className="w-2.5 h-2.5" />
              </button>

              {/* Calm Static Unclaimed Indicator */}
              {!dailyEggClaimed && (
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#0B1020]" />
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Slide-Over Command Sheet */}
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-[#070D1E]/98 backdrop-blur-2xl border-l border-cyan-500/30 p-4 sm:p-6 text-slate-200 shadow-2xl overflow-y-auto"
      >
        <SheetHeader className="pb-3 border-b border-cyan-500/20 mb-4">
          <SheetTitle className="text-lg sm:text-xl font-heading font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Daily Bonuses & Weekly Quests Hub
          </SheetTitle>
        </SheetHeader>

        {/* Embedded Full Interactive Matrix with Spacious Layout */}
        <DailyWeeklyBonusQuestCard />
      </SheetContent>
    </Sheet>
  );
}
