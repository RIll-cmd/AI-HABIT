"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

export interface RadarDataPoint {
  subject: string;
  value: number;
  secondaryValue?: number;
  fullMark?: number;
}

export interface StatRadarChartProps {
  data: RadarDataPoint[];
  primaryName?: string;
  secondaryName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
  showLegend?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B1020]/95 border border-blue-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono text-slate-100 min-w-[140px] space-y-1.5 z-50">
        <div className="font-bold text-white uppercase tracking-wider text-[11px] pb-1 border-b border-white/10">
          {payload[0].payload.subject}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const StatRadarChart: React.FC<StatRadarChartProps> = ({
  data,
  primaryName = "Current Stat",
  secondaryName,
  primaryColor = "#3B82F6",
  secondaryColor = "#8B5CF6",
  height = 340,
  showLegend = false,
}) => {
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);

  // Compute maximum domain value dynamically
  const maxVal = Math.max(
    10,
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0))
  );
  const domainMax = Math.ceil(maxVal * 1.25);

  return (
    <div className="w-full relative flex items-center justify-center select-none" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, domainMax]}
            tick={{ fill: "#475569", fontSize: 9 }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Primary Radar */}
          <Radar
            name={primaryName}
            dataKey="value"
            stroke={primaryColor}
            fill={primaryColor}
            fillOpacity={0.4}
            strokeWidth={2}
          />

          {/* Secondary Radar (for comparison like Base vs. Equipped) */}
          {hasSecondary && (
            <Radar
              name={secondaryName || "Equipped Stat"}
              dataKey="secondaryValue"
              stroke={secondaryColor}
              fill={secondaryColor}
              fillOpacity={0.35}
              strokeWidth={2}
            />
          )}

          {(showLegend || hasSecondary) && (
            <Legend
              wrapperStyle={{ paddingTop: "10px", fontSize: "11px", fontFamily: "monospace" }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
