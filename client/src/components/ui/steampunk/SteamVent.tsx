"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SteamVentProps {
  trigger?: boolean | number;
  particleCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface Particle {
  id: number;
  xOffset: number;
  scale: number;
  duration: number;
  delay: number;
}

/**
 * Procedural Steampunk Steam Vent Discharge Effect
 */
export function SteamVent({
  trigger,
  particleCount = 5,
  size = "md",
  className = "",
}: SteamVentProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === undefined || trigger === false || trigger === 0) return;

    let cleanupTimer: NodeJS.Timeout;
    const animFrame = requestAnimationFrame(() => {
      const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
        id: Date.now() + i,
        xOffset: (Math.random() - 0.5) * 28,
        scale: 0.6 + Math.random() * 0.7,
        duration: 0.8 + Math.random() * 0.6,
        delay: Math.random() * 0.15,
      }));

      setParticles(newParticles);

      cleanupTimer = setTimeout(() => {
        setParticles([]);
      }, 1600);
    });

    return () => {
      cancelAnimationFrame(animFrame);
      if (cleanupTimer) clearTimeout(cleanupTimer);
    };
  }, [trigger, particleCount]);

  if (particles.length === 0) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }[size];

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-20",
        className
      )}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            transform: `translateX(${p.xOffset}px)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
          className={cn(
            "absolute rounded-full bg-white/40 blur-[3px] animate-steampunk-steam pointer-events-none",
            sizeClasses
          )}
        />
      ))}
    </div>
  );
}
