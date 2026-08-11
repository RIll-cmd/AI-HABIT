"use client";

import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { API_BASE_URL } from "@/constants";

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

  return (
    <div className="p-4 bg-bg-main border border-white/10 rounded-2xl w-full">
      <h3 className="text-lg font-bold text-white mb-4">Ascension Heatmap</h3>
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div style={{ minWidth: "700px" }}>
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
                return { "data-tooltip-id": "heatmap-tooltip", "data-tooltip-content": "No missions completed" };
              }
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": `${value.count} missions on ${value.date}`,
              };
            }}
          />
          <Tooltip id="heatmap-tooltip" />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .react-calendar-heatmap text {
            font-size: 10px;
            fill: #94a3b8;
        }
        .react-calendar-heatmap .color-empty { fill: #1e293b; }
        .react-calendar-heatmap .color-scale-1 { fill: #0e7490; }
        .react-calendar-heatmap .color-scale-2 { fill: #06b6d4; }
        .react-calendar-heatmap .color-scale-3 { fill: #22d3ee; }
        .react-calendar-heatmap .color-scale-4 { fill: #67e8f9; }
        .react-calendar-heatmap rect { rx: 2; ry: 2; outline: none; }
      `}} />
    </div>
  );
}
