"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CraftResponse } from "../types/crafting";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { getItemIconPath } from "@/utils/itemIcons";
import { getItemUsageDetails } from "@/utils/itemUsageUtils";
import { playBuffSFX, playUISound } from "@/utils/audio";
import { Sparkles, Check, X, ShieldCheck, Hammer } from "lucide-react";

interface CraftSuccessModalProps {
  result: CraftResponse | null;
  onClose: () => void;
}

export function CraftSuccessModal({ result, onClose }: CraftSuccessModalProps) {
  useEffect(() => {
    if (result) {
      playBuffSFX("buff");
      playUISound("/sounds/Combat & Actions/SKILL--ACTIVATE.mp3");
    }
  }, [result]);

  if (!result) return null;

  const { craftedItem } = result;
  const rarityColor = rarityColors[craftedItem.rarity as keyof typeof rarityColors] || rarityColors.COMMON;
  const usageDetails = getItemUsageDetails(craftedItem);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop with particle blur */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Radiant glow spotlight behind modal */}
      <div
        className="absolute w-96 h-96 rounded-full blur-[100px] opacity-30 pointer-events-none animate-pulse"
        style={{ background: rarityColor }}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md bg-[#090E20] border-2 rounded-3xl p-6 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center text-center animate-scale-up"
        style={{ borderColor: `${rarityColor}80` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Forge Icon Emblem */}
        <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Hammer className="w-5 h-5 text-cyan-300 animate-bounce" />
        </div>

        <span className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
          ✦ Item Forged Successfully ✦
        </span>

        {/* Big Crafted Item Icon & Glowing Halo */}
        <div className="relative my-4">
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-60"
            style={{ background: rarityColor }}
          />
          <div
            className="relative w-24 h-24 rounded-2xl bg-black/80 border-2 p-3 flex items-center justify-center shadow-2xl"
            style={{ borderColor: rarityColor }}
          >
            <img
              src={getItemIconPath(craftedItem.name, craftedItem.type)}
              alt={craftedItem.name}
              className="w-18 h-18 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Item Name & Badges */}
        <h2 className="text-2xl font-bold text-white font-heading leading-tight">{craftedItem.name}</h2>
        <div className="flex items-center gap-2 mt-1.5 mb-3">
          <span
            className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded border text-cyan-300"
            style={{ borderColor: `${rarityColor}70`, background: `${rarityColor}20` }}
          >
            {craftedItem.rarity}
          </span>
          <span className="text-xs text-slate-300 font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {craftedItem.type}
          </span>
          {usageDetails.isEquipment && (
            <span className="text-xs text-emerald-400 font-mono uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Equippable
            </span>
          )}
        </div>

        {/* Item Lore */}
        <p className="text-xs text-slate-300 italic leading-relaxed bg-[#050A18]/80 p-3 rounded-xl border border-white/5 mb-4 text-left w-full">
          &quot;{craftedItem.description || "A masterfully forged artifact pulsing with system mana."}&quot;
        </p>

        {/* Stats Grid */}
        {usageDetails.hasBonuses && (
          <div className="w-full mb-4 p-2.5 rounded-xl bg-[#0B1428] border border-cyan-500/30">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Empowered Attributes
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {usageDetails.statBonuses.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className={`flex items-center justify-between px-2.5 py-1 rounded-lg ${s.bg} border ${s.borderColor} text-xs font-mono`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                      <span className="text-slate-300">{s.shortLabel}</span>
                    </div>
                    <span className="font-bold text-white">+{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/30 active:scale-95"
        >
          <Check className="w-4 h-4" />
          Collect to Inventory
        </button>
      </div>
    </div>
  );
}
