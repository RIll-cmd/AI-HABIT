"use client";

import React, { useEffect } from "react";
import { Swords, Shield, Trophy, Sparkles } from "lucide-react";
import { useTowerStore } from "@/features/tower/store";
import { TowerMap, CombatScreen } from "@/features/tower/components";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function TowerPage() {
  const { character } = useCharacterStore();
  const {
    activeTower,
    floors,
    isLoading,
    activeCombat,
    loadTowerData,
    startCombat,
    closeCombat,
  } = useTowerStore();

  useEffect(() => {
    loadTowerData(character?.id || "char-id-123");
  }, [character?.id, loadTowerData]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Page Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#151C33] via-[#1A1836] to-[#151C33] p-6 rounded-2xl border border-purple-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Swords className="w-7 h-7 text-purple-400" />
            <h1 className="text-2xl font-black font-heading text-slate-100 tracking-tight">
              {activeTower?.name || "Tower of Ascension"}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            {activeTower?.description ||
              "Test your real-life attributes against dungeon guardians in turn-based automated RPG trials."}
          </p>
        </div>

        {/* Character Power Overview Badge */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-3 px-5 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Current Power Score
            </span>
            <span className="text-lg font-black font-mono text-purple-400">
              ⚡ {character?.power || 0}
            </span>
          </div>

          <div className="text-right border-l border-slate-800 pl-4">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Rank Title
            </span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              Rank {character?.rank || "F"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Tower Spire Map */}
      <TowerMap
        floors={floors}
        character={character}
        onChallenge={(floor) => startCombat(character, floor)}
        isLoading={isLoading}
      />

      {/* Active Combat Modal Overlay */}
      {activeCombat && (
        <CombatScreen
          combatState={activeCombat}
          character={character}
          onClose={closeCombat}
        />
      )}
    </div>
  );
}
