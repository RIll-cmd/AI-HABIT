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

  // Calculate perimeter length for stroke animation
  const perimeterEstimate = validData.length * 40;

  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center">
      {/* Rotating glow behind chart */}
      <div 
        suppressHydrationWarning
        className="absolute inset-4 rounded-full bg-cyan-500/[0.04] blur-xl animate-pulse-glow-intense pointer-events-none" 
      />
      
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible relative z-10">
        <defs>
          {/* Gradient for the data polygon */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.35)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.25)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.30)" />
          </linearGradient>
          
          {/* Glow filter for the polygon stroke */}
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Point glow filter */}
          <filter id="pointGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid Webs — subtle animated opacity */}
        {gridLevels.map((level, idx) => {
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
              stroke={idx === 3 ? "rgba(6, 182, 212, 0.12)" : "#1a1d30"}
              strokeWidth={idx === 3 ? "1.5" : "0.8"}
              className={idx === 3 ? "animate-border-glow" : ""}
              style={{ opacity: 0.6 + idx * 0.1 }}
            />
          );
        })}

        {/* Axis Spokes — with subtle glow */}
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
              stroke="#1a1d30"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Glow version of data polygon (blurred, below) */}
        <polygon
          points={points}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          filter="url(#glowFilter)"
          opacity="0.4"
          style={{
            strokeDasharray: perimeterEstimate,
            strokeDashoffset: 0,
            animation: 'draw-in 1.5s ease-out forwards',
          }}
        />

        {/* Filled Data Polygon — with animated draw-in */}
        <polygon
          points={points}
          fill="url(#radarGradient)"
          stroke="#06b6d4"
          strokeWidth="2"
          className="transition-all duration-500"
          style={{
            strokeDasharray: perimeterEstimate,
            strokeDashoffset: 0,
            animation: 'draw-in 1.5s ease-out forwards',
          }}
        />

        {/* Value Points — with glow */}
        {validData.map((d, i) => {
          const val = Number(d?.value) || 1;
          const { x, y } = getCoordinates(i, val);
          const safeCx = Number.isNaN(x) ? 0 : x;
          const safeCy = Number.isNaN(y) ? 0 : y;
          return (
            <g key={i}>
              {/* Outer glow */}
              <circle
                cx={safeCx}
                cy={safeCy}
                r="6"
                fill="rgba(6, 182, 212, 0.15)"
                filter="url(#pointGlow)"
              >
                <animate
                  attributeName="r"
                  values="5;7;5"
                  dur="2s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur="2s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Core point */}
              <circle
                cx={safeCx}
                cy={safeCy}
                r="3.5"
                fill="#22d3ee"
                stroke="#030712"
                strokeWidth="1.5"
                filter="url(#pointGlow)"
              />
            </g>
          );
        })}

        {/* Labels */}
        {validData.map((d, i) => {
          const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
          const labelRadius = radius + 18;
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
              style={{ filter: 'drop-shadow(0 0 3px rgba(6, 182, 212, 0.3))' }}
            >
              {shortName}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
