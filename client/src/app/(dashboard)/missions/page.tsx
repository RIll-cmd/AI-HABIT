"use client";

import React from "react";
import { KanbanQuestBoard } from "@/features/habits/components/KanbanQuestBoard";
import { DailyWeeklyBonusDrawer } from "@/features/habits/components/DailyWeeklyBonusDrawer";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import {
  BigTavernLantern,
  RopePulley,
  PixelSwordIcon,
  PixelPushpinIcon,
} from "@/components/ui/pixel";

export default function MissionsPage() {
  return (
    <div className="-mt-3 sm:-mt-5 md:-mt-6 -mx-3 sm:-mx-5 md:-mx-6 space-y-4 pb-12 select-none relative overflow-hidden">
      {/* Background Floating Runes & Particle Field */}
      <FloatingRuneField density="low" className="opacity-15" />

      {/* Floating Side Drawer Trigger for Daily Bonuses & Weekly Quests */}
      <DailyWeeklyBonusDrawer />

      {/* ========================================================= */}
      {/* TAVERN CEILING TIMBER BEAM & ROOF (Flush Top Anchor)      */}
      {/* ========================================================= */}
      <div className="w-full bg-[#30180c] border-b-4 border-[#140a05] h-5 sm:h-6 shadow-[inset_0_2px_0_0_#5c2e17,0_4px_10px_rgba(0,0,0,0.85)] flex items-center justify-between px-4 sm:px-12 relative z-30">
        {/* Ceiling Iron Studs / Fasteners */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#111827] border border-[#374151] shadow-[inset_1px_1px_0_0_#9ca3af] hidden sm:block"
          />
        ))}
      </div>

      {/* ========================================================= */}
      {/* TAVERN QUEST BOARD WITH HANGING FLANKING LANTERNS & ROPES */}
      {/* ========================================================= */}
      <div className="relative pt-1 pb-1 px-1 sm:px-3 md:px-4">
        {/* Left Big Hanging Cast Iron Tavern Lantern */}
        <div className="hidden sm:block absolute left-1 sm:left-3 md:left-4 -top-5 sm:-top-6 z-30 pointer-events-none">
          <BigTavernLantern glowIntensity="high" />
        </div>

        {/* Right Big Hanging Cast Iron Tavern Lantern */}
        <div className="hidden sm:block absolute right-1 sm:right-3 md:right-4 -top-5 sm:-top-6 z-30 pointer-events-none">
          <BigTavernLantern glowIntensity="high" />
        </div>

        {/* Left Side Timber Beam Pixelated Rope Pulley */}
        <div className="hidden md:block absolute left-16 sm:left-20 md:left-24 -top-5 sm:-top-6 z-20 pointer-events-none">
          <RopePulley side="left" />
        </div>

        {/* Right Side Timber Beam Pixelated Rope Pulley */}
        <div className="hidden md:block absolute right-16 sm:right-20 md:right-24 -top-5 sm:-top-6 z-20 pointer-events-none">
          <RopePulley side="right" />
        </div>

        {/* Main Quest Notice Board (Sitting directly on the board) */}
        <KanbanQuestBoard />
      </div>
    </div>
  );
}



