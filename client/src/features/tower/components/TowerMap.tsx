"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  CheckCircle2,
  Swords,
  AlertTriangle,
  Flame,
  Trophy,
  Sparkles,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Floor } from "../types";
import { validateFloorAccess } from "../utils/floorValidator";

interface TowerMapProps {
  floors: Floor[];
  character: any;
  onChallenge: (floor: Floor) => void;
  isLoading?: boolean;
}

export function TowerMap({
  floors,
  character,
  onChallenge,
  isLoading,
}: TowerMapProps) {
  const [selectedFloorReqs, setSelectedFloorReqs] = useState<{
    floorId: string;
    requirements: string[];
  } | null>(null);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-20 bg-slate-900/60 rounded-xl" />
        <div className="h-24 bg-slate-900/60 rounded-xl" />
        <div className="h-24 bg-slate-900/60 rounded-xl" />
      </div>
    );
  }

  // Sort floors descending (Floor 100 at top, Floor 1 at bottom)
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tower Summit Badge */}
      <div className="text-center py-4 flex flex-col items-center gap-1.5">
        <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/30">
          <ChevronUp className="w-6 h-6 text-purple-400 animate-bounce" />
        </div>
        <h2 className="text-lg font-bold font-heading text-slate-200">
          Tower Spire Peak (Floor 100)
        </h2>
        <p className="text-xs text-slate-400">
          Climb the spire by developing real-life attributes and overcoming dungeon guardians.
        </p>
      </div>

      {/* Vertical Tower Map Floor Cards */}
      <div className="flex flex-col gap-4 relative before:absolute before:left-1/2 before:top-4 before:bottom-4 before:w-1 before:-translate-x-1/2 before:bg-slate-800/80 before:z-0">
        {sortedFloors.map((floor) => {
          const isBoss = floor.floorNumber % 5 === 0 || !!floor.boss;
          const status = (floor as any).status || "LOCKED";
          const isLocked = status === "LOCKED";
          const isCleared = status === "CLEARED" || status === "PERFECT";

          const accessValidation = validateFloorAccess(character, floor);
          const canChallenge = status === "UNLOCKED" || isCleared;

          const isReqSelected = selectedFloorReqs?.floorId === floor.id;

          return (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <Card
                className={`transition-all duration-300 relative overflow-hidden ${
                  isBoss
                    ? "bg-gradient-to-r from-[#1E112A] via-[#151C33] to-[#1E112A] border-purple-500/50 shadow-purple-950/40 shadow-xl"
                    : isCleared
                    ? "bg-[#151C33] border-emerald-500/30"
                    : isLocked
                    ? "bg-[#0B1020]/80 border-slate-800/60 opacity-60"
                    : "bg-[#151C33] border-blue-500/40 shadow-blue-950/20 shadow-lg"
                }`}
              >
                {/* Top Accent Strip */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isBoss
                      ? "bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500"
                      : isCleared
                      ? "bg-emerald-500"
                      : isLocked
                      ? "bg-slate-700"
                      : "bg-blue-500"
                  }`}
                />

                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Metadata */}
                  <div className="flex items-center gap-4">
                    {/* Floor Number Badge */}
                    <div
                      className={`w-14 h-14 rounded-xl font-mono font-extrabold text-lg flex items-center justify-center shrink-0 border ${
                        isBoss
                          ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                          : isCleared
                          ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-400"
                          : isLocked
                          ? "bg-slate-900 border-slate-800 text-slate-500"
                          : "bg-blue-950/50 border-blue-500/40 text-blue-400"
                      }`}
                    >
                      FL.{floor.floorNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                          {isBoss && <Flame className="w-4 h-4 text-amber-400" />}
                          {floor.boss ? floor.boss.name : `Floor ${floor.floorNumber} Trial`}
                        </h3>

                        {isBoss && (
                          <Badge className="text-[10px] font-mono bg-purple-600">
                            BOSS ENCOUNTER
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                        <span>Rec. Power: {floor.recommendedPower}</span>
                        <span>•</span>
                        <span>
                          Min Stats: STR {floor.minStrength}, KNO {floor.minKnowledge}
                        </span>
                      </div>

                      {(floor as any).attempts > 0 && (
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                          <span>Attempts: {(floor as any).attempts}</span>
                          {(floor as any).bestTime && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-semibold">
                                Best: {(floor as any).bestTime} turns
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Status */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    {isCleared && (
                      <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> CLEARED
                      </Badge>
                    )}

                    {isLocked ? (
                      <Badge variant="outline" className="text-xs text-slate-500 border-slate-800 bg-slate-900/60 px-3 py-1">
                        <Lock className="w-3.5 h-3.5 mr-1" /> LOCKED
                      </Badge>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <Button
                          disabled={!accessValidation.canEnter}
                          onClick={() => onChallenge(floor)}
                          className={`text-xs font-bold px-5 ${
                            isBoss
                              ? "bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white shadow-lg shadow-purple-950/50"
                              : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                          }`}
                        >
                          <Swords className="w-3.5 h-3.5 mr-1.5" />
                          CHALLENGE FLOOR
                        </Button>

                        {!accessValidation.canEnter && (
                          <button
                            onClick={() =>
                              setSelectedFloorReqs(
                                isReqSelected
                                  ? null
                                  : {
                                      floorId: floor.id,
                                      requirements: accessValidation.missingRequirements,
                                    }
                              )
                            }
                            className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <AlertTriangle className="w-3 h-3" /> Requirements Not Met
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Missing Requirements Dropdown */}
                {isReqSelected && (
                  <div className="bg-rose-950/30 border-t border-rose-500/30 p-3 px-5 text-xs text-rose-300 font-mono space-y-1">
                    <p className="font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Entry Requirements Missing:
                    </p>
                    {accessValidation.missingRequirements.map((req, idx) => (
                      <p key={idx} className="pl-4">
                        • {req}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
