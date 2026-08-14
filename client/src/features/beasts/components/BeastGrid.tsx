"use client";

import React, { useState, useMemo } from "react";
import { BestiarySpeciesSummary, BeastRarity, BeastElement } from "../types/beast";
import { useBeastStore } from "../store/useBeastStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
  Shield,
  Flame,
  Info,
  Layers,
  Crown,
  Search,
  Filter,
  X,
} from "lucide-react";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

interface BeastGridProps {
  bestiary: BestiarySpeciesSummary[];
  characterId: string;
  totalDiscovered: number;
  totalSpecies: number;
}

export const BeastGrid: React.FC<BeastGridProps> = ({
  bestiary,
  characterId,
  totalDiscovered,
  totalSpecies,
}) => {
  const { equipBeast, isEquipping } = useBeastStore();
  const [selectedRarity, setSelectedRarity] = useState<string>("ALL");
  const [selectedElement, setSelectedElement] = useState<string>("ALL");
  const [activeLoreModal, setActiveLoreModal] = useState<BestiarySpeciesSummary | null>(null);

  const rarities: BeastRarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "HOLOGRAPHIC"];
  const elements: BeastElement[] = ["FIRE", "FROST", "VOID", "CYBER", "NATURE", "HOLY", "STORM"];

  const filteredBeasts = useMemo(() => {
    return bestiary.filter((b) => {
      if (selectedRarity !== "ALL" && b.rarity !== selectedRarity) return false;
      if (selectedElement !== "ALL" && b.element !== selectedElement) return false;
      return true;
    });
  }, [bestiary, selectedRarity, selectedElement]);

  const handleEquipClick = async (b: BestiarySpeciesSummary) => {
    if (!b.isUnlocked || !b.beastInstanceId) return;
    if (b.isEquipped) {
      await equipBeast(characterId, null); // Unequip
    } else {
      await equipBeast(characterId, b.beastInstanceId);
    }
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case "HOLOGRAPHIC":
        return "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/60 shadow-[0_0_12px_rgba(217,70,239,0.4)]";
      case "LEGENDARY":
        return "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]";
      case "EPIC":
        return "bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
      case "RARE":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/60";
    }
  };

  const getElementBadgeStyle = (element: string) => {
    switch (element) {
      case "FIRE":
        return "text-red-400 bg-red-950/60 border-red-500/40";
      case "FROST":
        return "text-cyan-300 bg-cyan-950/60 border-cyan-500/40";
      case "VOID":
        return "text-purple-400 bg-purple-950/60 border-purple-500/40";
      case "CYBER":
        return "text-teal-300 bg-teal-950/60 border-teal-500/40";
      case "NATURE":
        return "text-emerald-400 bg-emerald-950/60 border-emerald-500/40";
      case "HOLY":
        return "text-amber-300 bg-amber-950/60 border-amber-500/40";
      case "STORM":
        return "text-yellow-400 bg-yellow-950/60 border-yellow-500/40";
      default:
        return "text-slate-400 bg-slate-900 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls & Discovery Meter */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/30 p-6 shadow-xl relative overflow-hidden backdrop-blur-2xl">
        <FloatingRuneField density="low" className="opacity-40" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                ASCENDANT BESTIARY CODEX
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide">
              Companion Collection
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Hatch eggs with daily steps to unlock dragons and activate passive resonance buffs.
            </p>
          </div>

          {/* Discovery Progress Meter */}
          <div className="w-full md:w-64 space-y-2 bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Bestiary Codex</span>
              <span className="text-cyan-300 font-black">
                {totalDiscovered} / {totalSpecies} Discovered
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-cyan-500/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                style={{ width: `${Math.min(100, Math.floor((totalDiscovered / totalSpecies) * 100))}%` }}
              />
            </div>
            <div className="text-[9.5px] font-mono text-slate-500 text-right">
              {Math.floor((totalDiscovered / totalSpecies) * 100)}% Codex Completion
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-5 border-t border-cyan-500/10 mt-5">
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setSelectedRarity("ALL");
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedRarity === "ALL"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            ALL TIERS
          </button>
          {rarities.map((r) => (
            <button
              key={r}
              onClick={() => {
                playUIMenuSFX("confirm");
                setSelectedRarity(r);
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedRarity === r
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 20-Beast Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeasts.map((beast) => {
          const isUnlocked = beast.isUnlocked;

          return (
            <div
              key={beast.speciesId}
              className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isUnlocked
                  ? beast.isEquipped
                    ? "bg-gradient-to-br from-[#0e2133] via-[#091524] to-[#040a12] border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-[1.02]"
                    : "bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-cyan-500/25 hover:border-cyan-500/50 shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  : "bg-[#050812]/90 border-slate-800/80 opacity-65"
              }`}
            >
              {/* Top Card Bar: Badges */}
              <div className="flex items-center justify-between gap-1.5 mb-2 relative z-10">
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  #{String(beast.speciesId).padStart(3, "0")}
                </span>
                <div className="flex items-center gap-1">
                  <Badge className={`${getRarityBadgeStyle(beast.rarity)} text-[9px] font-mono font-black uppercase px-2 py-0.5`}>
                    {beast.rarity}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold ${getElementBadgeStyle(beast.element)}`}>
                    {beast.element}
                  </span>
                </div>
              </div>

              {/* Center Sprite Stage */}
              <div
                onClick={() => isUnlocked && setActiveLoreModal(beast)}
                className={`relative flex flex-col items-center justify-center py-3 my-1 rounded-xl bg-black/30 border border-white/5 cursor-pointer ${
                  isUnlocked ? "hover:border-cyan-500/30" : ""
                }`}
              >
                {isUnlocked ? (
                  <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/20" />
                    <img
                      src={beast.spritePath}
                      alt={beast.name}
                      className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-float-slow select-none"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex flex-col items-center justify-center text-slate-700 select-none">
                    <Lock className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[9px] font-mono text-slate-600 font-bold">LOCKED</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Content */}
              <div className="space-y-2 pt-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black font-heading text-white tracking-wide truncate">
                      {isUnlocked ? beast.name : "Mystery Beast"}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {isUnlocked ? beast.species : "Unexplored Species"}
                    </span>
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={() => setActiveLoreModal(beast)}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300 flex items-center justify-center cursor-pointer transition-colors"
                      title="View Lore & Stats"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Passive Buff Pill */}
                {isUnlocked ? (
                  <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-slate-300 font-bold">
                      {beast.statBonusType.replace("_", " ")}:
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +{beast.statBonusValue}
                      {beast.statBonusType.includes("BOOST") ? "%" : " SP"}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] font-mono text-slate-500 text-center">
                    Incubate {beast.element.toLowerCase()} egg to unlock
                  </div>
                )}

                {/* Equip / Unequip Toggle */}
                {isUnlocked && (
                  <Button
                    size="sm"
                    onClick={() => handleEquipClick(beast)}
                    disabled={isEquipping}
                    className={`w-full h-8 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
                      beast.isEquipped
                        ? "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        : "bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {beast.isEquipped ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        ACTIVE COMPANION
                      </>
                    ) : (
                      "EQUIP COMPANION"
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Beast Lore & Stats Modal */}
      {activeLoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#0F172E] via-[#091024] to-[#040815] border-2 border-cyan-500/40 p-6 shadow-2xl overflow-hidden text-slate-100 space-y-4">
            <button
              onClick={() => setActiveLoreModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-cyan-500/20 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-cyan-500/40 flex items-center justify-center p-2">
                <img
                  src={activeLoreModal.spritePath}
                  alt={activeLoreModal.name}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Badge className={`${getRarityBadgeStyle(activeLoreModal.rarity)} text-[9px] font-mono font-black uppercase px-2 py-0.5`}>
                    {activeLoreModal.rarity}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold ${getElementBadgeStyle(activeLoreModal.element)}`}>
                    {activeLoreModal.element}
                  </span>
                </div>
                <h3 className="text-lg font-black font-heading text-white mt-1">
                  {activeLoreModal.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono block">
                  {activeLoreModal.species}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Tactical Description
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                  {activeLoreModal.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block mb-1">
                  Codex Lore
                </span>
                <p className="text-xs text-slate-300 font-sans italic bg-black/30 p-3 rounded-xl border border-white/5 leading-relaxed">
                  "{activeLoreModal.lore}"
                </p>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Passive Stat Resonance
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {activeLoreModal.statBonusType.replace("_", " ")}
                  </span>
                </div>
                <span className="text-sm font-mono font-black text-emerald-400">
                  +{activeLoreModal.statBonusValue}
                  {activeLoreModal.statBonusType.includes("BOOST") ? "%" : " SP"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  handleEquipClick(activeLoreModal);
                  setActiveLoreModal(null);
                }}
                className={`w-full h-11 font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer ${
                  activeLoreModal.isEquipped
                    ? "bg-red-950/80 border border-red-500/40 text-red-300 hover:bg-red-900"
                    : "bg-gradient-to-r from-cyan-600 to-indigo-600 text-slate-950 hover:from-cyan-500 hover:to-indigo-500"
                }`}
              >
                {activeLoreModal.isEquipped ? "UNEQUIP COMPANION" : "EQUIP AS ACTIVE COMPANION"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
