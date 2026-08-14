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
  primaryColor = "#06B6D4",
  secondaryColor = "#8B5CF6",
  height = 380,
  showLegend = false,
}) => {
  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);

  // Compute maximum domain value dynamically so the radar polygon fills the chart
  const highestDataValue = Math.max(
    1,
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0))
  );

  // Scale domain intelligently so early game stats (1-5) and late game stats (>50) fill the graph
  const domainMax =
    highestDataValue <= 3
      ? Math.max(highestDataValue + 1, 3)
      : highestDataValue <= 10
      ? Math.ceil(highestDataValue * 1.2)
      : Math.ceil(highestDataValue * 1.12);

  return (
    <div className="w-full relative flex items-center justify-center select-none" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="82%" data={data}>
          <PolarGrid stroke="rgba(6, 182, 212, 0.25)" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#38BDF8", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, domainMax]}
            tick={{ fill: "#64748B", fontSize: 9, fontFamily: "monospace" }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Primary Radar */}
          <Radar
            name={primaryName}
            dataKey="value"
            stroke={primaryColor}
            fill={primaryColor}
            fillOpacity={0.45}
            strokeWidth={2.5}
            dot={{ r: 3, fill: primaryColor, stroke: "#0B1020", strokeWidth: 1.5 }}
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
              dot={{ r: 3, fill: secondaryColor, stroke: "#0B1020", strokeWidth: 1.5 }}
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
