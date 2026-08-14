"use client";

import React from "react";
import { ShopItem } from "../types/shop";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { getItemIconPath } from "@/utils/itemIcons";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { getItemUsageDetails } from "@/utils/itemUsageUtils";
import {
  Sparkles,
  Package,
  BookOpen,
  HelpCircle,
  ShieldCheck,
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
  const usageDetails = getItemUsageDetails(item);

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
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-84 rounded-2xl bg-[#0a1024]/98 border border-cyan-500/40 p-4 text-slate-100 shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-xl opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:pointer-events-auto transition-all duration-200 z-50 transform group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0 translate-y-2 scale-95 group-hover/tooltip:scale-100 group-focus-within/tooltip:scale-100"
      >
        {/* Glow Halo Header */}
        <div
          suppressHydrationWarning
          className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
          style={{ background: rarityColor }}
        />

        {/* Item Name & Icon */}
        <div suppressHydrationWarning className="flex items-center gap-3 mb-2.5">
          <div
            suppressHydrationWarning
            className="w-12 h-12 rounded-xl bg-[#050a18] border flex-shrink-0 p-1 flex items-center justify-center relative shadow-inner"
            style={{ borderColor: `${rarityColor}70` }}
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
            <div suppressHydrationWarning className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border text-cyan-300" style={{ borderColor: `${rarityColor}60`, background: `${rarityColor}20` }}>
                {item.rarity}
              </span>
              <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {item.type}
              </span>
              {usageDetails.isEquipment && (
                <span className="text-[9.5px] text-emerald-400 font-mono uppercase tracking-wider bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Equippable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Full World Lore Text */}
        <div suppressHydrationWarning className="p-2.5 rounded-xl bg-[#050a18]/90 border border-white/10 text-[11px] text-slate-300 italic leading-relaxed mb-2.5 break-words">
          &quot;{item.description || "A mysterious artifact forged within system rift gates."}&quot;
        </div>

        {/* Equipment Stat Attributes Matrix */}
        {usageDetails.hasBonuses && (
          <div suppressHydrationWarning className="mb-2.5 p-2 rounded-xl bg-[#0B1428] border border-cyan-500/25">
            <span className="text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Equipment Stat Attributes
            </span>
            <div suppressHydrationWarning className="grid grid-cols-2 gap-1.5">
              {usageDetails.statBonuses.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.shortLabel}
                    suppressHydrationWarning
                    className={`flex items-center justify-between px-2.5 py-1 rounded-lg ${s.bg} border ${s.borderColor} text-[11px] font-mono`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                      <span className="text-slate-300 font-medium">{s.shortLabel}</span>
                    </div>
                    <span className="font-bold text-white">+{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* How to Use / Usage Guide */}
        <div suppressHydrationWarning className="mb-3 p-2.5 rounded-xl bg-gradient-to-br from-[#101830] to-[#080d1e] border border-indigo-500/30 text-[11px] leading-relaxed">
          <span className="text-[9.5px] font-mono font-bold text-indigo-300 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            How to Use & Slot:
          </span>
          <p className="text-slate-200 font-sans text-[11px]">{usageDetails.usageGuide}</p>
          <div className="mt-1 text-[9.5px] font-mono text-indigo-300">
            Slot: <strong className="text-white">{usageDetails.slotLabel}</strong>
          </div>
        </div>

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

