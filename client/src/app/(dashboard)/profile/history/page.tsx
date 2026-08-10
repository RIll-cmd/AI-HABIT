"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  History,
  Award,
  ArrowUpRight,
  Clock,
  Zap,
  Swords,
  Shield,
  Dumbbell,
  Sparkles,
} from "lucide-react";

export default function HistoryPage() {
  const { character, gainExp } = useCharacterStore();
  const history = character?.history || [];

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-[24px] bg-[#0B1020]/90 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              Chronological Progression Feed (Chronicles)
            </h2>
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5">
              {history.length} LOGGED ENTRIES
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            A permanent chronological audit log recording every milestone, stat allocation, boss victory, and level progression.
          </p>
        </div>
      </div>

      {/* ACTIVITY FEED TIMELINE */}
      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Progression Chronicles Logged"
          description="Complete training simulations, stat allocations, or daily missions to generate historical activity logs."
          action={
            <Button
              onClick={() => gainExp(150, "Completed Training Simulation")}
              variant="outline"
              size="sm"
              className="text-xs border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Run Simulation (+150 EXP)
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {[...history].reverse().map((item, index) => {
              const isLevelUp = item.type === "LEVEL_UP";
              const isStatAllocation = item.type === "STAT_ALLOCATION";
              const isWorkout = item.type === "WORKOUT";

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                  className={`p-4 rounded-[18px] bg-[#151C33] border ${
                    isLevelUp
                      ? "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-gradient-to-r from-amber-950/20 to-slate-900"
                      : isStatAllocation
                      ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 to-slate-900"
                      : "border-white/10 hover:border-blue-500/30"
                  } transition-all flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${
                        isLevelUp
                          ? "bg-amber-950/60 text-amber-400 border border-amber-500/40"
                          : isStatAllocation
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                          : isWorkout
                          ? "bg-indigo-950/60 text-indigo-400 border border-indigo-500/40"
                          : "bg-blue-950/60 text-blue-400 border border-blue-500/40"
                      }`}
                    >
                      {isLevelUp ? (
                        <Award className="w-5 h-5" />
                      ) : isStatAllocation ? (
                        <Sparkles className="w-5 h-5" />
                      ) : isWorkout ? (
                        <Dumbbell className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white font-sans leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {new Date(item.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={isLevelUp ? "gold" : "default"}
                    className="font-mono text-xs shrink-0"
                  >
                    {isStatAllocation ? `+${item.amount} SP` : `+${item.amount} EXP`}
                  </Badge>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
