"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Trophy,
  XCircle,
  Coins,
  Zap,
  Shield,
  Heart,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ActiveCombatState } from "../store/useTowerStore";

interface CombatScreenProps {
  combatState: ActiveCombatState;
  character: any;
  onClose: () => void;
}

export function CombatScreen({
  combatState,
  character,
  onClose,
}: CombatScreenProps) {
  const { result, enemy, floor, rewards } = combatState;

  // Stagger log entries live for dynamic auto-battler feel
  const [displayedLogCount, setDisplayedLogCount] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (displayedLogCount < result.logs.length) {
      const timer = setTimeout(() => {
        setDisplayedLogCount((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
    }
  }, [displayedLogCount, result.logs.length]);

  const charMaxHp = result.maxCharacterHp;
  const charHp = result.remainingHp;
  const charHpPercent = Math.max(0, Math.min(100, (charHp / charMaxHp) * 100));

  const enemyMaxHp = result.maxEnemyHp;
  const enemyHp = result.isVictory && isFinished ? 0 : enemyMaxHp;
  const enemyHpPercent = Math.max(0, Math.min(100, (enemyHp / enemyMaxHp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0D1322] border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Header */}
        <div className="p-4 px-6 bg-[#151C33] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-100 font-heading">
              Tower Floor {floor.floorNumber} Combat Simulation
            </h2>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Turns: {Math.min(displayedLogCount, result.totalTurns)}
          </span>
        </div>

        {/* Combat Health Bar Matrix */}
        <div className="p-6 bg-gradient-to-b from-[#151C33]/60 to-[#0D1322] border-b border-slate-800/80 grid grid-cols-2 gap-6">
          {/* Character Card */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">{character?.name || "Ascendant"}</span>
              <span className="font-mono text-emerald-400">
                {charHp} / {charMaxHp} HP
              </span>
            </div>
            <Progress value={charHpPercent} className="h-3 bg-slate-800 [&>div]:bg-emerald-500" />
          </div>

          {/* Enemy Card */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-purple-300">{enemy.name}</span>
              <span className="font-mono text-purple-400">
                {enemyHp} / {enemyMaxHp} HP
              </span>
            </div>
            <Progress value={enemyHpPercent} className="h-3 bg-slate-800 [&>div]:bg-purple-500" />
          </div>
        </div>

        {/* Battle Log Terminal */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2.5 bg-[#080C16] min-h-[220px] max-h-[340px]">
          {result.logs.slice(0, displayedLogCount).map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-2 rounded border ${
                log.includes("Victory")
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold"
                  : log.includes("Defeat")
                  ? "bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold"
                  : log.includes("Critical")
                  ? "bg-amber-950/30 border-amber-500/30 text-amber-300"
                  : log.includes("attacks you")
                  ? "bg-rose-950/20 border-slate-800/60 text-rose-200"
                  : "bg-slate-900/60 border-slate-800/60 text-slate-300"
              }`}
            >
              {log}
            </motion.div>
          ))}
        </div>

        {/* Victory / Defeat Modal Footer */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#151C33] border-t border-slate-800 flex flex-col items-center gap-4 text-center"
          >
            {result.isVictory ? (
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-center gap-2 text-2xl font-black font-heading text-amber-400 drop-shadow">
                  <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                  VICTORY ACHIEVED!
                </div>

                {rewards && (
                  <div className="flex items-center justify-center gap-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 max-w-sm mx-auto">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Coins className="w-4 h-4" /> +{rewards.goldEarned} Gold
                    </div>
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                      <Zap className="w-4 h-4" /> +{rewards.expEarned} EXP
                    </div>
                  </div>
                )}

                {/* Animated Loot Drop Banner */}
                {combatState.droppedItem && combatState.droppedItem.item && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="p-3 px-4 rounded-xl bg-slate-900/90 border border-purple-500/50 max-w-sm mx-auto flex items-center justify-between gap-3 shadow-lg shadow-purple-950/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                        <Sparkles className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold">
                          ✨ LOOT ACQUIRED!
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          {combatState.droppedItem.item.name}
                        </span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[10px] bg-purple-950 text-purple-300 border-purple-500/50 font-bold">
                      {combatState.droppedItem.item.rarity}
                    </Badge>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-2xl font-black font-heading text-rose-400">
                  <XCircle className="w-8 h-8 text-rose-400" />
                  VANQUISHED IN THE SPIRE
                </div>
                <p className="text-xs text-slate-400">
                  Strengthen your character through habits and try challenging this floor again.
                </p>
              </div>
            )}

            <Button
              onClick={onClose}
              className={`w-full max-w-xs font-bold ${
                result.isVictory
                  ? "bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {result.isVictory ? "CLAIM REWARDS & RETURN" : "RETURN TO TOWER MAP"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
