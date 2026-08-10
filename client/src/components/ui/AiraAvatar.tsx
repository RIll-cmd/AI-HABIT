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
  const getIconPath = (m: AiraMood) => {
    switch (m) {
      case "ANALYZING":
      case "WARNING":
        return "/AIRA ICON/cropped/aira-alert.png";
      case "ROAST":
      case "DISAPPOINTED":
        return "/AIRA ICON/cropped/aira-annoyed.png";
      case "SUCCESS":
      case "HAPPY":
        return "/AIRA ICON/cropped/aira-happy.png";
      case "NEUTRAL":
      default:
        return "/AIRA ICON/fairy-gif.gif";
    }
  };

  return (
    <div className={`relative rounded-full overflow-hidden border border-indigo-500/50 shadow-lg bg-slate-900 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image 
            src={getIconPath(mood)}
            alt={`AIRA ${mood}`}
            fill
            className="object-cover"
            unoptimized={getIconPath(mood).endsWith('.gif')}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
