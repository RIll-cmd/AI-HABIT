"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiraAvatar, AiraMood } from "@/components/ui/AiraAvatar";
import { useAiraStore } from "../store";

export function AiraPeriodicToast() {
  const { activePeriodicToast, dismissPeriodicToast, currentMood } = useAiraStore();

  useEffect(() => {
    if (!activePeriodicToast) return;

    // Auto-dismiss toast after 8 seconds
    const timer = setTimeout(() => {
      dismissPeriodicToast();
    }, 8000);

    return () => clearTimeout(timer);
  }, [activePeriodicToast, dismissPeriodicToast]);

  return (
    <AnimatePresence>
      {activePeriodicToast && (
        <motion.div
          key={activePeriodicToast.id}
          initial={{ opacity: 0, scale: 0.85, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -15 }}
          style={{ transformOrigin: "top right" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full font-mono select-none"
        >
          <div
            onClick={dismissPeriodicToast}
            className="bg-[#0B1020]/95 border border-cyan-500/40 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(6,182,212,0.3)] backdrop-blur-md relative overflow-hidden group cursor-pointer hover:border-cyan-400/70 transition-all flex items-center gap-3.5"
          >
            {/* Background Holographic Ambient Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-purple-500" />

            {/* Glowing Orb Avatar */}
            <div className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden ring-2 ring-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] bg-slate-900 relative ml-1">
              <AiraAvatar mood={currentMood as AiraMood} className="w-full h-full rounded-none border-none shadow-none" />
            </div>

            {/* Status Message Text */}
            <p className="text-xs text-slate-100 font-sans leading-relaxed flex-1 pr-1 font-medium">
              {activePeriodicToast.text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
