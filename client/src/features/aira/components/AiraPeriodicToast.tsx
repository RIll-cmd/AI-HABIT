"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AiraAvatar, AiraMood } from "@/components/ui/AiraAvatar";
import { useAiraStore } from "../store";

export function AiraPeriodicToast() {
  const router = useRouter();
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
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          style={{ transformOrigin: "top right" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full font-mono select-none"
        >
          <div className="bg-[#0B1020]/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_35px_rgba(6,182,212,0.3)] backdrop-blur-md relative overflow-hidden group">
            {/* Background Holographic Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-purple-500" />

            {/* Header Tag */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-sm overflow-hidden relative">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                  {activePeriodicToast.category || "AIRA TACTICAL BRIEFING"}
                </span>
              </div>

              <button
                onClick={dismissPeriodicToast}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body with Prominent Avatar */}
            <div className="flex gap-3 items-start my-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] bg-slate-900 relative">
                <AiraAvatar mood={currentMood as AiraMood} className="w-full h-full rounded-none border-none shadow-none" />
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed pt-1">
                {activePeriodicToast.text}
              </p>
            </div>

            {/* Quick Action Navigation Footer */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
              <button
                onClick={() => {
                  dismissPeriodicToast();
                  router.push("/aira");
                }}
                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <span>Command Center</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <span className="text-[9px] text-slate-500 font-mono">8s auto-dismiss</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
