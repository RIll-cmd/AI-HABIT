"use client";

import React, { useState, useEffect } from "react";
import { useBeastStore } from "../store/useBeastStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Trophy,
  Shield,
  Flame,
  Star,
  ArrowRight,
  X,
} from "lucide-react";
import { playBattleSFX, playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

interface HatchCelebrationModalProps {
  characterId: string;
}

export const HatchCelebrationModal: React.FC<HatchCelebrationModalProps> = ({
  characterId,
}) => {
  const { celebrationModal, closeCelebrationModal, equipBeast, isEquipping } =
    useBeastStore();

  const [phase, setPhase] = useState<"VIBRATING" | "BURST" | "REVEAL">("VIBRATING");

  const isOpen = celebrationModal.isOpen;
  const data = celebrationModal.data;

  useEffect(() => {
    if (isOpen) {
      setPhase("VIBRATING");
      playBattleSFX("encounter");

      const timer1 = setTimeout(() => {
        setPhase("BURST");
        playBuffSFX("speed");
      }, 1200);

      const timer2 = setTimeout(() => {
        setPhase("REVEAL");
        playBuffSFX("levelup");
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const { beast, egg } = data;

  const handleEquipAndClose = async () => {
    playBuffSFX("levelup");
    await equipBeast(characterId, beast.id);
    closeCelebrationModal();
  };

  const getRarityTheme = (rarity: string) => {
    switch (rarity) {
      case "HOLOGRAPHIC":
        return {
          border: "border-fuchsia-400 shadow-[0_0_50px_rgba(217,70,239,0.5)]",
          bg: "from-fuchsia-950/90 via-[#180924]/95 to-[#08020d]/98",
          text: "text-fuchsia-300",
          badge: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,239,0.4)]",
          glow: "bg-fuchsia-500/20",
        };
      case "LEGENDARY":
        return {
          border: "border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.5)]",
          bg: "from-amber-950/90 via-[#1c1206]/95 to-[#0a0601]/98",
          text: "text-amber-300",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
          glow: "bg-amber-500/20",
        };
      case "EPIC":
        return {
          border: "border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.4)]",
          bg: "from-purple-950/90 via-[#130822]/95 to-[#06020c]/98",
          text: "text-purple-300",
          badge: "bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
          glow: "bg-purple-500/20",
        };
      case "RARE":
        return {
          border: "border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.4)]",
          bg: "from-cyan-950/90 via-[#07162c]/95 to-[#020914]/98",
          text: "text-cyan-300",
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
          glow: "bg-cyan-500/20",
        };
      default:
        return {
          border: "border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]",
          bg: "from-emerald-950/90 via-[#061812]/95 to-[#020a07]/98",
          text: "text-emerald-300",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/60",
          glow: "bg-emerald-500/20",
        };
    }
  };

  const theme = getRarityTheme(beast.rarity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Floating Particles and Runes Field */}
      <FloatingRuneField density="high" />

      {/* Main Celebration Modal Window */}
      <div
        className={`relative w-full max-w-lg rounded-[32px] bg-gradient-to-br ${theme.bg} border-2 ${theme.border} p-6 md:p-8 shadow-2xl overflow-hidden backdrop-blur-2xl text-slate-100 flex flex-col items-center text-center space-y-6 z-10 transition-all duration-700`}
      >
        {/* Cyber Header Bar & Close */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <button
          onClick={() => {
            playUIMenuSFX("confirm");
            closeCelebrationModal();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================= */}
        {/* PHASE 1 & 2: EGG VIBRATING AND BURSTING */}
        {/* ========================================================= */}
        {phase !== "REVEAL" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-90 duration-300">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full ${
                  phase === "BURST"
                    ? "bg-white scale-150 blur-2xl animate-ping"
                    : "bg-amber-500/30 blur-xl animate-pulse"
                }`}
              />

              <div
                className={`relative w-28 h-28 ${
                  phase === "VIBRATING" ? "animate-bounce" : "scale-125"
                }`}
              >
                <img
                  src={egg.sprite || "/eggs/egg_1.png"}
                  alt="Hatching Egg"
                  className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black font-heading text-white tracking-widest uppercase animate-pulse">
                {phase === "VIBRATING" ? "✦ SHELL FRACTURING... ✦" : "✦ RADIANT BURST! ✦"}
              </h3>
              <p className="text-xs font-mono text-cyan-300">
                Incubation energy reaching critical mass...
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 3: BEAST REVEAL & BESTIARY ENTRY */}
        {/* ========================================================= */}
        {phase === "REVEAL" && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-500">
            {/* Rarity & Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  NEW BEAST DISCOVERED
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {beast.name}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Badge className={`${theme.badge} text-[10px] font-black font-mono tracking-widest uppercase px-3 py-0.5`}>
                  {beast.rarity} COMPANION
                </Badge>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                  {beast.element} ELEMENT
                </span>
              </div>
            </div>

            {/* Glowing Beast Pedestal */}
            <div className="relative flex items-center justify-center my-2">
              <div className={`w-36 h-36 rounded-full ${theme.glow} blur-2xl animate-pulse pointer-events-none`} />
              <div className="relative w-32 h-32 flex items-center justify-center bg-black/40 rounded-3xl border border-white/10 p-3 shadow-2xl group">
                <img
                  src={beast.spritePath ? beast.spritePath.replace('.png', '.gif') : '/beasts/beast_1.gif'}
                  alt={beast.name}
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-float-slow select-none group-hover:scale-110 transition-transform"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>

            {/* Beast Lore & Passive Stat Bonus Banner */}
            <div className="w-full space-y-3">
              <p className="text-xs text-slate-300 font-sans italic bg-black/40 p-3 rounded-2xl border border-white/10 leading-relaxed max-w-md">
                "{beast.description}"
              </p>

              {/* Passive Stat Card */}
              {(() => {
                const buffType = beast.statBonusType || beast.passiveBuffType || "EXP_PERCENT";
                const buffVal = beast.statBonusValue ?? beast.passiveBuffValue ?? 5;
                const formattedType = buffType.replace("_PERCENT", "").replace("_BOOST", "").replace("_", " ");
                return (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0C152F] via-[#091024] to-[#060B18] border border-cyan-500/30 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Passive Stat Multiplier
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          {formattedType}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono font-black text-sm text-emerald-400">
                      +{buffVal.toFixed(1)}% Multiplier
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleEquipAndClose}
                disabled={isEquipping}
                className="flex-1 h-12 bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                EQUIP AS COMPANION NOW
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  playUIMenuSFX("confirm");
                  closeCelebrationModal();
                }}
                className="h-12 bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Send to Bestiary
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
