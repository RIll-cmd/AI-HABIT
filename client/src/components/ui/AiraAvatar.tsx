import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export type AiraMood = 
  | "NEUTRAL" 
  | "ANALYZING" 
  | "WARNING" 
  | "ROAST" 
  | "DISAPPOINTED" 
  | "SUCCESS" 
  | "HAPPY";

interface AiraAvatarProps {
  mood?: AiraMood;
  className?: string;
}

export function AiraAvatar({ mood = "NEUTRAL", className = "w-10 h-10" }: AiraAvatarProps) {
  // Always use the animated GIF asset for lively AIRA presence
  const gifPath = "/AIRA ICON/fairy-gif.gif";

  const getMoodBorder = (m: AiraMood) => {
    switch (m) {
      case "ANALYZING":
        return "border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.65)] ring-1 ring-cyan-400/50";
      case "WARNING":
        return "border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.75)] ring-1 ring-amber-400/50 animate-pulse";
      case "ROAST":
      case "DISAPPOINTED":
        return "border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.65)] ring-1 ring-rose-400/50";
      case "SUCCESS":
      case "HAPPY":
        return "border-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.75)] ring-1 ring-emerald-400/50";
      case "NEUTRAL":
      default:
        return "border-indigo-500/70 shadow-[0_0_18px_rgba(99,102,241,0.5)] ring-1 ring-indigo-400/30";
    }
  };

  return (
    <div className={`relative rounded-full overflow-hidden border bg-slate-900 transition-all duration-300 ${getMoodBorder(mood)} ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0.85, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.85, scale: 1.05 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image 
            src={gifPath}
            alt={`AIRA ${mood}`}
            fill
            className="object-cover scale-110"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
