"use client";

import React from "react";

interface AttributeData {
  name: string;
  value: number;
}

interface RadarChartProps {
  data: AttributeData[];
}

export function RadarChart({ data }: RadarChartProps) {
  // Center (100, 100) with radius 75
  const center = 100;
  const radius = 70;
  const numPoints = data.length;

  // Compute angles for each attribute point
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate grid webs (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Polygon points string for actual attribute values
  const points = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.value);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {/* Background Grid Webs */}
        {gridLevels.map((level) => {
          const webPoints = data
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
              const r = level * radius;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={webPoints}
              fill="none"
              stroke="#23253a"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Spokes */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#23253a"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={points}
          fill="rgba(139, 92, 246, 0.35)"
          stroke="#a855f7"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Value Points */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill="#c084fc"
              stroke="#13141f"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
          const labelRadius = radius + 16;
          const lx = center + labelRadius * Math.cos(angle);
          const ly = center + labelRadius * Math.sin(angle);
          const shortName = d.name.slice(0, 3).toUpperCase();
          return (
            <text
              key={d.name}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-400 text-[9px] font-mono font-bold"
            >
              {shortName}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
