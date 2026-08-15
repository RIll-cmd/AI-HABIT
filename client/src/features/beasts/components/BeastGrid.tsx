"use client";

import React, { useState, useMemo } from "react";
import { BestiarySpeciesSummary, BeastRarity, BeastElement } from "../types/beast";
import { useBeastStore } from "../store/useBeastStore";
import { useCharacterStore } from "@/store/useCharacterStore";
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
  BookOpen,
  HeartPulse,
  Award,
  Footprints,
  Coins,
  ArrowUpCircle,
} from "lucide-react";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { SystemTooltip, SystemTooltipStat } from "@/components/ui/SystemTooltip";
import { DRAGON_LORE } from "@/features/lore/loreData";

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
  const { equipBeast, upgradeBeast, isEquipping, isUpgrading } = useBeastStore();
  const { character } = useCharacterStore();
  // Default filter is strictly "OWNED" per user directive
  const [ownershipFilter, setOwnershipFilter] = useState<"OWNED" | "ALL">("OWNED");
  const [selectedRarity, setSelectedRarity] = useState<string>("ALL");
  const [selectedElement, setSelectedElement] = useState<string>("ALL");
  const [activeLoreModal, setActiveLoreModal] = useState<BestiarySpeciesSummary | null>(null);

  const rarities: BeastRarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY", "HOLOGRAPHIC"];
  const elements: BeastElement[] = ["FIRE", "FROST", "VOID", "CYBER", "NATURE", "HOLY", "STORM"];

  const filteredBeasts = useMemo(() => {
    return bestiary.filter((b) => {
      // Default: only show owned / unlocked dragons
      if (ownershipFilter === "OWNED" && !b.isUnlocked) return false;
      if (selectedRarity !== "ALL" && b.rarity !== selectedRarity) return false;
      if (selectedElement !== "ALL" && b.element !== selectedElement) return false;
      return true;
    });
  }, [bestiary, ownershipFilter, selectedRarity, selectedElement]);

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

  const getFormattedStatLabel = (beast: BestiarySpeciesSummary) => {
    const loreEntry = DRAGON_LORE[beast.speciesId];
    if (loreEntry) {
      return `+${loreEntry.statBonusPercent.toFixed(1)}% ${beast.statBonusType.replace("_PERCENT", "").replace("_BOOST", "").replace("_", " ")}`;
    }
    return `+${beast.statBonusValue.toFixed(1)}% ${beast.statBonusType.replace("_", " ")}`;
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
                ASCENDANT DRAGON CODEX
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-wide">
              Dragon Companions & Mythic Lore
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Hatch eggs with daily steps to awaken dragons and activate percentage-based stat multipliers.
            </p>
          </div>

          {/* Discovery Progress Meter */}
          <div className="w-full md:w-64 space-y-2 bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Bestiary Codex</span>
              <span className="text-cyan-300 font-black">
                {totalDiscovered} / {totalSpecies} Awakened
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

        {/* Primary Filter Row: Owned vs All Switcher */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-cyan-500/10 mt-5">
          <div className="flex items-center gap-2 p-1 bg-black/60 border border-cyan-500/30 rounded-2xl max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                playUIMenuSFX("confirm");
                setOwnershipFilter("OWNED");
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                ownershipFilter === "OWNED"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              OWNED DRAGONS ({totalDiscovered})
            </button>

            <button
              type="button"
              onClick={() => {
                playUIMenuSFX("confirm");
                setOwnershipFilter("ALL");
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                ownershipFilter === "ALL"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] font-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              ALL CODEX ({totalSpecies})
            </button>
          </div>

          {/* Rarity & Element Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                playUIMenuSFX("confirm");
                setSelectedRarity("ALL");
                setSelectedElement("ALL");
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                selectedRarity === "ALL" && selectedElement === "ALL"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                  : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              RESET FILTERS
            </button>

            {rarities.map((r) => (
              <button
                key={r}
                onClick={() => {
                  playUIMenuSFX("confirm");
                  setSelectedRarity(selectedRarity === r ? "ALL" : r);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  selectedRarity === r
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State for Owned Filter */}
      {filteredBeasts.length === 0 && (
        <div className="rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border border-cyan-500/30 p-8 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-black font-heading text-white">
              {ownershipFilter === "OWNED"
                ? "No Awakened Dragons In Sanctuary Yet"
                : "No Dragons Match Filter Criteria"}
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {ownershipFilter === "OWNED"
                ? "Accumulate real-world walking steps in the Incubator Chamber to hatch Mystery Eggs, or toggle to 'All Codex' to browse the complete bestiary."
                : "Try resetting your rarity or elemental filters to view matching dragons."}
            </p>
          </div>
          {ownershipFilter === "OWNED" && (
            <div className="pt-2">
              <Button
                onClick={() => {
                  playUIMenuSFX("confirm");
                  setOwnershipFilter("ALL");
                }}
                className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-mono font-black text-xs uppercase tracking-wider h-10 px-6 rounded-xl cursor-pointer hover:from-cyan-400 hover:to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Layers className="w-4 h-4 mr-1.5" />
                BROWSE ALL 20 CODEX DRAGONS
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 20-Beast Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeasts.map((beast) => {
          const isUnlocked = beast.isUnlocked;
          const loreEntry = DRAGON_LORE[beast.speciesId];
          const formattedStat = getFormattedStatLabel(beast);

          return (
            <SystemTooltip
              key={beast.speciesId}
              title={isUnlocked ? beast.name : `??? (Undiscovered ${beast.element} Dragon)`}
              subtitle={`${isUnlocked ? beast.species : "Uncharted Species"} • ${beast.element} Affinity`}
              category="Dragon Companion"
              rarity={beast.rarity as any}
              description={isUnlocked ? (loreEntry?.storyLore || beast.description) : "This mythical companion has not yet been awakened in your bestiary."}
              lore={isUnlocked ? (loreEntry?.biologicalResonance || beast.lore) : `Incubate and hatch ${beast.element.toLowerCase()} eggs by accumulating daily walking steps to discover this dragon.`}
              mechanics={`Equipping grants a passive ${formattedStat} percentage multiplier to your actual character progression.`}
              howToImprove="Accumulate daily walking steps and workout sessions in the Incubator Chamber to hatch Mystery Eggs."
              stats={isUnlocked ? [{ label: "Passive Multiplier", value: formattedStat, color: "text-amber-300" }] : []}
              tags={[beast.element, beast.rarity, "Dragon Companion"]}
              delayMs={1000}
              className="w-full h-full"
            >
              <div
                className={`w-full h-full relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  isUnlocked
                    ? beast.isEquipped
                      ? "bg-gradient-to-br from-[#0e2133] via-[#091524] to-[#040a12] border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-cyan-500/25 hover:border-cyan-500/50 shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-[#050812]/90 border-slate-800/80 opacity-65"
                }`}
              >
                {/* Top Card Bar: Badges */}
                <div className="flex items-center justify-between gap-1.5 mb-2 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      #{String(beast.speciesId).padStart(3, "0")}
                    </span>
                    {isUnlocked && (
                      <span className="px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-500/40 text-[9px] font-mono font-bold text-cyan-300">
                        LV.{beast.level || 1}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`${getRarityBadgeStyle(beast.rarity)} text-[9px] font-mono font-black uppercase px-2 py-0.5`}>
                      {beast.rarity}
                    </Badge>
                    <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold ${getElementBadgeStyle(beast.element)}`}>
                      {beast.element}
                    </span>
                  </div>
                </div>

                {/* Animated Sprite Center Stage */}
                <div className="h-32 flex items-center justify-center relative my-2 z-10 select-none">
                  {isUnlocked ? (
                    <img
                      src={beast.spritePath}
                      alt={beast.name}
                      className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-110 transition-transform duration-300"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 space-y-1">
                      <Lock className="w-8 h-8 opacity-60 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        LOCKED
                      </span>
                    </div>
                  )}

                  {/* Equipped Ribbon Badge */}
                  {isUnlocked && beast.isEquipped && (
                    <div className="absolute top-0 right-0 bg-emerald-500/20 border border-emerald-400/60 px-2 py-0.5 rounded-md text-[9px] font-mono font-black text-emerald-300 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Name & Species */}
                <div className="space-y-1 my-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-black text-sm text-white tracking-wide truncate">
                      {isUnlocked ? beast.name : "???"}
                    </h4>
                    {isUnlocked && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playUIMenuSFX("confirm");
                          setActiveLoreModal(beast);
                        }}
                        className="text-slate-400 hover:text-cyan-300 p-1 rounded-md hover:bg-cyan-500/10 cursor-pointer transition-colors"
                        title="View Story Lore Chronicle"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-400 block truncate">
                    {isUnlocked ? beast.species : `Undiscovered ${beast.element} Dragon`}
                  </span>
                </div>

                {/* Passive Percentage Bonus Box */}
                <div className="mt-2 p-2 rounded-xl bg-black/40 border border-white/5 space-y-1 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      Passive Bonus
                    </span>
                    <span className="font-black text-emerald-400">
                      {isUnlocked ? formattedStat : "???"}
                    </span>
                  </div>
                </div>

                {/* Action Button: Equip / Unequip */}
                <div className="mt-3 relative z-10">
                  {isUnlocked ? (
                    <Button
                      type="button"
                      disabled={isEquipping}
                      onClick={() => handleEquipClick(beast)}
                      className={`w-full h-8 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
                        beast.isEquipped
                          ? "bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                          : "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      }`}
                    >
                      {beast.isEquipped ? "UNEQUIP" : "EQUIP COMPANION"}
                    </Button>
                  ) : (
                    <div className="w-full h-8 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-center justify-center text-[10px] font-mono text-slate-600 font-bold">
                      INCUBATE TO UNLOCK
                    </div>
                  )}
                </div>
              </div>
            </SystemTooltip>
          );
        })}
      </div>

      {/* Story Lore & Detail Modal */}
      {activeLoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#090E1D] border-2 border-cyan-500/40 p-6 shadow-2xl space-y-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                DRAGON CODEX CHRONICLE
              </span>
              <button
                onClick={() => setActiveLoreModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-black/50 border border-cyan-500/30 p-2 flex items-center justify-center shrink-0">
                <img
                  src={activeLoreModal.spritePath}
                  alt={activeLoreModal.name}
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
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
                <h3 className="text-xl font-black font-heading text-white mt-1">
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
                  Mythic Story Lore
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                  {DRAGON_LORE[activeLoreModal.speciesId]?.storyLore || activeLoreModal.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-1">
                  Biological & Kinetic Resonance
                </span>
                <p className="text-xs text-slate-300 font-sans italic bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                  "{DRAGON_LORE[activeLoreModal.speciesId]?.biologicalResonance || activeLoreModal.lore}"
                </p>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Passive Progression Multiplier
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {activeLoreModal.statBonusType.replace("_PERCENT", "").replace("_BOOST", "").replace("_", " ")}
                  </span>
                </div>
                <span className="text-base font-mono font-black text-emerald-400">
                  {getFormattedStatLabel(activeLoreModal)}
                </span>
              </div>

              {/* Level & Ascension Upgrade Module */}
              {activeLoreModal.isUnlocked && activeLoreModal.beastInstanceId && (
                <div className="p-3.5 bg-slate-950/70 border border-cyan-500/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Ascension Level {activeLoreModal.level || 1} / 10
                    </span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      {(activeLoreModal.goldUpgradeReq || (activeLoreModal.level || 1) * 1000).toLocaleString()} Gold
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3 h-3 text-cyan-400" />
                      Steps Required:
                    </span>
                    <span className="text-cyan-300 font-bold">
                      {(activeLoreModal.accumulatedSteps || 0).toLocaleString()} / {(activeLoreModal.stepUpgradeReq || (activeLoreModal.level || 1) * 5000).toLocaleString()} Steps
                    </span>
                  </div>

                  <Button
                    type="button"
                    disabled={isUpgrading || (activeLoreModal.level || 1) >= 10 || (character?.gold || 0) < (activeLoreModal.goldUpgradeReq || (activeLoreModal.level || 1) * 1000)}
                    onClick={async () => {
                      if (activeLoreModal.beastInstanceId) {
                        await upgradeBeast(characterId, activeLoreModal.beastInstanceId);
                        setActiveLoreModal(null);
                      }
                    }}
                    className="w-full h-8 bg-gradient-to-r from-amber-500 via-cyan-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-mono text-xs font-black uppercase rounded-lg disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    {isUpgrading ? "Ascending..." : (activeLoreModal.level || 1) >= 10 ? "Max Level Reached" : `⚡ Ascend to Level ${(activeLoreModal.level || 1) + 1}`}
                  </Button>
                </div>
              )}
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
