"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PixelProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "primary" | "success" | "warning" | "danger" | "purple" | "gold" | "cyan";
  color?: "primary" | "success" | "warning" | "danger" | "purple" | "gold" | "cyan" | string;
  showShimmer?: boolean;
  height?: "sm" | "md" | "lg";
}

export function PixelProgress({
  value = 0,
  max = 100,
  variant,
  color = "primary",
  showShimmer = false,
  height = "md",
  className,
  ...props
}: PixelProgressProps) {
  const percentage = Math.max(0, Math.min(100, Math.round(((value || 0) / (max || 100)) * 100)));

  const activeColor = (variant || color || "primary") as string;

  const variantFills: Record<string, string> = {
    primary: "bg-cyan-400 border-cyan-300",
    cyan: "bg-cyan-400 border-cyan-300",
    success: "bg-emerald-400 border-emerald-300",
    warning: "bg-amber-400 border-amber-300",
    gold: "bg-amber-400 border-amber-300",
    danger: "bg-red-500 border-red-400",
    purple: "bg-purple-500 border-purple-400",
  };

  const heightStyles = {
    sm: "h-2",
    md: "h-3.5",
    lg: "h-5",
  };

  return (
    <div
      className={cn(
        "w-full bg-[#120921] border-2 border-black relative overflow-hidden",
        "shadow-[inset_2px_2px_0_0_#06020c,inset_-2px_-2px_0_0_#2b1247]",
        heightStyles[height],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full border-r-2 border-black transition-transform duration-500 ease-[steps(12)] origin-left",
          "shadow-[inset_0_2px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.35)]",
          variantFills[activeColor] || variantFills.primary
        )}
        style={{
          transform: `scaleX(${percentage / 100})`,
        }}
      />
    </div>
  );
}

export default PixelProgress;
