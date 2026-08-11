"use client";

import React from "react";
import { ShopItem } from "../types/shop";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { getItemIconPath } from "@/utils/itemIcons";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import {
  Sword,
  Shield,
  Sparkles,
  Package,
  Zap,
  BookOpen,
  HeartPulse,
  Target,
  Activity,
  Dumbbell
} from "lucide-react";

interface ItemTooltipProps {
  item: ShopItem;
  children: React.ReactNode;
}

export function ItemTooltip({ item, children }: ItemTooltipProps) {
  // If item is locked (requirements not met), do not render preview tooltip
  if (!item.meetsRequirements) {
    return <>{children}</>;
  }

  const rarityColor = rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.COMMON;

  // Extract item definition stats from direct item properties or nested itemDefinition
  const def = (item as any).itemDefinition || {};
  const stats = [
    { label: "ATK", value: item.attack ?? def.attack, icon: Sword, color: "text-red-400" },
    { label: "DEF", value: item.defense ?? def.defense, icon: Shield, color: "text-blue-400" },
    { label: "STR", value: item.strength ?? def.strength, icon: Dumbbell, color: "text-orange-400" },
    { label: "KNO", value: item.knowledge ?? def.knowledge, icon: BookOpen, color: "text-cyan-400" },
    { label: "END", value: item.endurance ?? def.endurance, icon: Zap, color: "text-emerald-400" },
    { label: "REC", value: item.recovery ?? def.recovery, icon: HeartPulse, color: "text-pink-400" },
    { label: "FOC", value: item.focus ?? def.focus, icon: Target, color: "text-purple-400" },
    { label: "CNS", value: item.consistency ?? def.consistency, icon: Activity, color: "text-amber-400" },
  ].filter((s) => typeof s.value === "number" && s.value > 0);

  const CurrencyIconBadge = () => (
    <CurrencyIcon type={item.currencyType} size="xs" className="inline ml-1" />
  );

  return (
    <div suppressHydrationWarning className="relative group/tooltip focus-within:outline-none">
      {children}

      {/* FLOATING HOVER & FOCUS TOOLTIP POPUP */}
      <div
        suppressHydrationWarning
        tabIndex={-1}
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 rounded-2xl bg-[#0a1024]/98 border border-cyan-500/30 p-4 text-slate-100 shadow-2xl shadow-black/90 backdrop-blur-xl opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:pointer-events-auto transition-all duration-200 z-50 transform group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0 translate-y-2 scale-95 group-hover/tooltip:scale-100 group-focus-within/tooltip:scale-100"
      >
        {/* Glow Halo Header */}
        <div
          suppressHydrationWarning
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: rarityColor }}
        />

        {/* Item Name & Icon */}
        <div suppressHydrationWarning className="flex items-center gap-3 mb-2.5">
          <div
            suppressHydrationWarning
            className="w-11 h-11 rounded-lg bg-[#050a18] border flex-shrink-0 p-1 flex items-center justify-center relative shadow-inner"
            style={{ borderColor: `${rarityColor}60` }}
          >
            <img
              src={(item.icon && item.icon.includes('/icons/Icon')) ? item.icon : getItemIconPath(item.name, item.type)}
              alt={item.name}
              className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <div suppressHydrationWarning className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-white font-heading truncate">{item.name}</h4>
            <div suppressHydrationWarning className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border text-cyan-300" style={{ borderColor: `${rarityColor}60`, background: `${rarityColor}20` }}>
                {item.rarity}
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{item.type}</span>
            </div>
          </div>
        </div>

        {/* Full World Lore Text */}
        <div suppressHydrationWarning className="p-3 rounded-xl bg-[#050a18]/90 border border-white/10 text-xs text-slate-200 italic leading-relaxed mb-3 break-words max-h-40 overflow-y-auto custom-scrollbar">
          &quot;{item.description || "A mysterious artifact forged within system rift gates."}&quot;
        </div>

        {/* Stats Matrix (If item has stat bonuses) */}
        {stats.length > 0 && (
          <div suppressHydrationWarning className="mb-3">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Stat Attributes
            </span>
            <div suppressHydrationWarning className="grid grid-cols-2 gap-1.5">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    suppressHydrationWarning
                    className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] font-mono"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                      <span className="text-slate-300">{s.label}</span>
                    </div>
                    <span className="font-bold text-white">+{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock & Requirements Info Footer */}
        <div suppressHydrationWarning className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <div suppressHydrationWarning className="flex items-center gap-1 text-slate-300">
            <Package className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stock:</span>
            <span className={`font-bold ${item.inStock ? "text-cyan-300" : "text-red-400"}`}>
              {item.stock !== null ? item.stock : "Unlimited"}
            </span>
          </div>
          <div suppressHydrationWarning className="flex items-center gap-1 text-amber-300 font-bold">
            <span>{item.price.toLocaleString()}</span>
            <CurrencyIconBadge />
          </div>
        </div>

        {/* Pointer Arrow */}
        <div
          suppressHydrationWarning
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#0a1024]"
        />
      </div>
    </div>
  );
}

