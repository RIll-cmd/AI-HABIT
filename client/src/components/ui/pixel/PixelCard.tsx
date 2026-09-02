"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleBadge?: React.ReactNode;
  variant?: "default" | "danger" | "purple" | "cyan" | "amber";
  glow?: boolean;
}

export function PixelCard({
  title,
  titleBadge,
  variant = "default",
  glow = false,
  className,
  children,
  ...props
}: PixelCardProps) {
  const variantStyles = {
    default: "border-[#3b1861] bg-[#1A102F] text-white",
    danger: "border-[#7f1d1d] bg-[#1f0b14] text-white",
    purple: "border-[#581c87] bg-[#1b0d2e] text-white",
    cyan: "border-[#0e7490] bg-[#0c1829] text-white",
    amber: "border-[#78350f] bg-[#241407] text-white",
  };

  return (
    <div
      className={cn(
        "relative rounded-none p-4 sm:p-5 pixel-container select-none",
        variantStyles[variant],
        glow && "shadow-[0_0_20px_rgba(255,255,255,0.15)]",
        className
      )}
      {...props}
    >
      {/* Header if title exists */}
      {(title || titleBadge) && (
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b-2 border-black/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-3.5 bg-[#22c55e] inline-block shadow-[1px_1px_0_0_#000]" />
            <h2 className="pixel-text-outlined text-sm sm:text-base tracking-wider uppercase font-bold text-white px-1 py-0.5">
              {title}
            </h2>
          </div>
          {titleBadge && <div>{titleBadge}</div>}
        </div>
      )}

      {children}
    </div>
  );
}

export default PixelCard;
