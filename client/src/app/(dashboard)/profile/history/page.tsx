"use client";

import React from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import {
  PixelHistoryIcon,
  PixelAwardIcon,
  PixelSparklesIcon,
  PixelDumbbellIcon,
  PixelLightningIcon,
} from "@/components/ui/pixel/PixelIcons";

export default function HistoryPage() {
  const { character, gainExp } = useCharacterStore();
  const history = character?.history || [];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* HEADER BANNER */}
      <div className="konosuba-adventurer-card p-4 sm:p-5 shadow-[0_8px_16px_rgba(0,0,0,0.6)] space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold font-pixel text-[#241208] flex items-center gap-2">
                <PixelHistoryIcon className="w-4 h-4 text-amber-800" />
                <span>ᚺᛁᛋᛏᛟᚱᚤ GUILD ADVENTURER DEEDS & CHRONICLES</span>
              </h2>
              <PixelBadge variant="gold">
                {history.length} LOGGED DEEDS
              </PixelBadge>
            </div>
            <p className="text-xs font-pixel text-[#633a20] max-w-2xl leading-relaxed">
              A permanent chronological audit log recording every milestone, stat allocation, training deed, and level certification on your card.
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVITY FEED TIMELINE */}
      {history.length === 0 ? (
        <div className="konosuba-adventurer-card text-center py-12 space-y-4 shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
          <div className="w-12 h-12 bg-[#ebd9b5] border-2 border-[#522e18] mx-auto flex items-center justify-center">
            <PixelHistoryIcon className="w-6 h-6 text-[#633a20]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-pixel font-bold text-sm text-[#241208]">No Progression Chronicles Logged</h3>
            <p className="font-pixel text-xs text-[#633a20] max-w-md mx-auto">
              Complete training simulations, stat allocations, or daily missions to generate historical activity logs.
            </p>
          </div>
          <PixelButton
            onClick={() => gainExp(150, "Completed Training Simulation")}
            variant="gold"
            className="inline-flex items-center gap-1.5 text-xs"
          >
            <PixelLightningIcon className="w-3.5 h-3.5 text-amber-900" />
            <span>Run Simulation (+150 EXP)</span>
          </PixelButton>
        </div>
      ) : (
        <div className="space-y-2.5">
          {[...history].reverse().map((item, index) => {
            const isLevelUp = item.type === "LEVEL_UP";
            const isStatAllocation = item.type === "STAT_ALLOCATION";
            const isWorkout = item.type === "WORKOUT";

            return (
              <div
                key={item.id || index}
                className={`p-3.5 bg-[#caa97e] border-2 border-[#4a2813] shadow-[2px_2px_0_0_#221208,inset_0_0_12px_rgba(89,59,34,0.35)] flex items-center justify-between gap-4 transition-colors ${
                  isLevelUp
                    ? "border-amber-950 bg-[#dfcaac]"
                    : isStatAllocation
                    ? "border-emerald-950 bg-[#c2d6be]"
                    : "hover:border-amber-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 border border-[#4a2813] flex items-center justify-center shrink-0 shadow-inner ${
                      isLevelUp
                        ? "bg-amber-200 text-amber-950"
                        : isStatAllocation
                        ? "bg-emerald-200 text-emerald-950"
                        : isWorkout
                        ? "bg-sky-200 text-sky-950"
                        : "bg-[#dfcaac] text-[#6d4c3d]"
                    }`}
                  >
                    {isLevelUp ? (
                      <PixelAwardIcon className="w-4 h-4" />
                    ) : isStatAllocation ? (
                      <PixelSparklesIcon className="w-4 h-4" />
                    ) : isWorkout ? (
                      <PixelDumbbellIcon className="w-4 h-4" />
                    ) : (
                      <PixelHistoryIcon className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-pixel font-bold text-[#221208] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-pixel text-[#593b22] font-bold">
                      <span>
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <PixelBadge
                  variant={isLevelUp ? "gold" : isStatAllocation ? "success" : "dark"}
                  className="font-pixel text-xs shrink-0"
                >
                  {isStatAllocation ? `+${item.amount} SP` : `+${item.amount} EXP`}
                </PixelBadge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
