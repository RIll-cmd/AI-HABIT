"use client";

import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { API_BASE_URL } from "@/constants";
import { Calendar, Sparkles, Activity, CheckCircle2 } from "lucide-react";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

interface HeatmapData {
  date: string;
  count: number;
  level: number;
}

const HeatmapComponent = CalendarHeatmap as unknown as React.ComponentType<{
  startDate: Date;
  endDate: Date;
  values: HeatmapData[];
  classForValue: (value: HeatmapData | undefined) => string;
  tooltipDataAttrs: (value: HeatmapData | undefined) => Record<string, string>;
}>;

export function HabitHeatmap({ characterId }: { characterId: string }) {
  const [data, setData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/missions/heatmap/${characterId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to load heatmap", e);
      }
    }
    fetchData();
  }, [characterId]);

  const today = new Date();
  const shiftDate = new Date();
  shiftDate.setFullYear(today.getFullYear() - 1);

  const totalActiveDays = data.filter((d) => d.count > 0).length;

  return (
    <div className="p-6 md:p-7 rounded-[26px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/25 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      {/* Floating Runes */}
      <FloatingRuneField density="low" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-cyan-500/15 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              Ascension Habit Heatmap
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </h3>
            <p className="text-[10.5px] font-mono text-slate-400">
              365-Day Neural Execution Matrix & Mission Density
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Days:</span>
            <strong className="text-white font-bold">{totalActiveDays}</strong>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Display */}
      <div className="overflow-x-auto custom-scrollbar pb-3 relative z-10">
        <div style={{ minWidth: "720px" }}>
          <HeatmapComponent
            startDate={shiftDate}
            endDate={today}
            values={data}
            classForValue={(value) => {
              if (!value || !value.count) {
                return "color-empty";
              }
              return `color-scale-${value.level}`;
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) {
                return {
                  "data-tooltip-id": "heatmap-tooltip",
                  "data-tooltip-content": "No protocols logged on this day",
                };
              }
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": `${value.count} protocol execution${value.count > 1 ? "s" : ""} on ${value.date}`,
              };
            }}
          />
          <Tooltip id="heatmap-tooltip" />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-[11px] font-mono text-slate-400 relative z-10 flex-wrap gap-2">
        <span>Consistency Frequency: 0 to 4+ executions / day</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500">Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-950 border border-cyan-800" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-800 border border-cyan-600" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-600 border border-cyan-400" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-200 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
          <span className="text-[10px] text-cyan-400">More</span>
        </div>
      </div>
    </div>
  );
}

