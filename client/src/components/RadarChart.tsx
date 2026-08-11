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
  // Center (100, 100) with radius 70
  const center = 100;
  const radius = 70;
  const validData = Array.isArray(data) ? data : [];
  const numPoints = validData.length > 0 ? validData.length : 1;

  // Compute angles for each attribute point
  const getCoordinates = (index: number, val: number) => {
    const rawVal = Number(val);
    const safeVal = Number.isNaN(rawVal) ? 1 : rawVal;
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (safeVal / 100) * radius;
    const rawX = center + r * Math.cos(angle);
    const rawY = center + r * Math.sin(angle);
    const x = Number.isNaN(rawX) ? center : rawX;
    const y = Number.isNaN(rawY) ? center : rawY;
    return { x, y };
  };

  // Generate grid webs (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Polygon points string for actual attribute values
  const points = validData
    .map((d, i) => {
      const val = Number(d?.value) || 1;
      const { x, y } = getCoordinates(i, val);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {/* Background Grid Webs */}
        {gridLevels.map((level) => {
          const webPoints = validData
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
              const r = level * radius;
              const rawX = center + r * Math.cos(angle);
              const rawY = center + r * Math.sin(angle);
              const x = Number.isNaN(rawX) ? center : rawX;
              const y = Number.isNaN(rawY) ? center : rawY;
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
        {validData.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
          const rawX = center + radius * Math.cos(angle);
          const rawY = center + radius * Math.sin(angle);
          const x = Number.isNaN(rawX) ? center : rawX;
          const y = Number.isNaN(rawY) ? center : rawY;
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
        {validData.map((d, i) => {
          const val = Number(d?.value) || 1;
          const { x, y } = getCoordinates(i, val);
          const safeCx = Number.isNaN(x) ? 0 : x;
          const safeCy = Number.isNaN(y) ? 0 : y;
          return (
            <circle
              key={i}
              cx={safeCx}
              cy={safeCy}
              r="3.5"
              fill="#c084fc"
              stroke="#13141f"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {validData.map((d, i) => {
          const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
          const labelRadius = radius + 16;
          const rawLx = center + labelRadius * Math.cos(angle);
          const rawLy = center + labelRadius * Math.sin(angle);
          const lx = Number.isNaN(rawLx) ? center : rawLx;
          const ly = Number.isNaN(rawLy) ? center : rawLy;
          const shortName = (d?.name || "").slice(0, 3).toUpperCase();
          return (
            <text
              key={d?.name || i}
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
