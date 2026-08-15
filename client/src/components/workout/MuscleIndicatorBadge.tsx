"use client";

import React from "react";
import { MuscleGroupKey, RecoveryStatus } from "@/features/workouts/types/muscleRecovery";
import { Activity, Zap, Flame, Shield } from "lucide-react";

interface MuscleIndicatorBadgeProps {
  muscleKey: MuscleGroupKey | string;
  name?: string;
  freshness?: number;
  status?: RecoveryStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MuscleIndicatorBadge: React.FC<MuscleIndicatorBadgeProps> = ({
  muscleKey,
  name,
  freshness = 100,
  status = "FRESH",
  size = "md",
  showIcon = true,
  className = "",
  onClick
}) => {
  const displayName = name || muscleKey.replace("_", " ");

  const getStatusStyles = () => {
    if (status === "FATIGUED" || freshness < 40) {
      return {
        bg: "bg-red-950/80 hover:bg-red-900/80",
        border: "border-red-500/50 hover:border-red-400",
        text: "text-red-300",
        glow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",
        dot: "bg-red-500 animate-pulse",
        icon: Flame,
      };
    }
    if (status === "RECOVERING" || freshness < 80) {
      return {
        bg: "bg-amber-950/80 hover:bg-amber-900/80",
        border: "border-amber-500/50 hover:border-amber-400",
        text: "text-amber-300",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
        dot: "bg-amber-400",
        icon: Zap,
      };
    }
    return {
      bg: "bg-cyan-950/80 hover:bg-cyan-900/80",
      border: "border-cyan-500/50 hover:border-cyan-400",
      text: "text-cyan-300",
      glow: "shadow-[0_0_12px_rgba(6,182,212,0.25)]",
      dot: "bg-cyan-400",
      icon: Activity,
    };
  };

  const styles = getStatusStyles();
  const IconComponent = styles.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-mono font-bold border transition-all duration-300 select-none ${styles.bg} ${styles.border} ${styles.text} ${styles.glow} ${sizeClasses[size]} ${onClick ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default"} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {showIcon && <IconComponent className="w-3 h-3 shrink-0" />}
      <span className="truncate">{displayName}</span>
      {freshness !== undefined && (
        <span className="opacity-80 text-[9px] font-mono ml-0.5">
          {Math.round(freshness)}%
        </span>
      )}
    </button>
  );
};
