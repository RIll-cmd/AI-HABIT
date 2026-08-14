"use client";

import React from "react";
import Image from "next/image";
import { CraftingRecipe } from "../types/crafting";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { getItemIconPath } from "@/utils/itemIcons";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { getItemUsageDetails } from "@/utils/itemUsageUtils";
import {
  Hammer,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lock,
  Flame,
  ShieldAlert,
} from "lucide-react";
import { SystemTooltip } from "@/components/ui/SystemTooltip";

interface RecipeCardProps {
  recipe: CraftingRecipe;
  onCraft: (recipeId: string) => void;
  isCrafting: boolean;
  playerGold: number;
}

export function RecipeCard({ recipe, onCraft, isCrafting, playerGold }: RecipeCardProps) {
  const { output, ingredients, goldCost, requiredLevel, canCraft, missingRequirements } = recipe;
  const rarityColor = rarityColors[output.rarity as keyof typeof rarityColors] || rarityColors.COMMON;
  const usageDetails = getItemUsageDetails(output);
  const hasEnoughGold = playerGold >= goldCost;

  return (
    <div
      suppressHydrationWarning
      className={`group relative rounded-2xl bg-[#0B1024]/95 border transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:z-30 ${
        canCraft
          ? "border-cyan-500/40 hover:border-cyan-400"
          : "border-white/10 opacity-90"
      }`}
    >
      {/* Background ambient gradient with overflow-hidden */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ background: rarityColor }}
        />
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ background: rarityColor }}
        />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        {/* Header: Item Icon & Titles with SystemTooltip */}
        <div>
          <SystemTooltip
            title={output.name}
            subtitle={`${output.rarity} ${output.type} • Required Level ${requiredLevel}`}
            category="Craftable Forge Blueprint"
            rarity={output.rarity as any}
            description={output.description || recipe.description || "Mastercrafted gear forged from refined essence and rare catalysts."}
            lore={`Forged in the dimensional smithy by infusing ${output.name} with ambient ether. A masterwork creation of the Ascendant Forge.`}
            mechanics={
              usageDetails.hasBonuses
                ? `Stat Enhancements: ${usageDetails.statBonuses.map((s) => `${s.label} +${s.value}`).join(" • ")}`
                : "Provides permanent attribute enhancements and combat power when equipped."
            }
            stats={
              usageDetails.hasBonuses
                ? usageDetails.statBonuses.map((s) => ({
                    label: s.label,
                    value: `+${s.value}`,
                    icon: s.icon,
                    color: "text-emerald-400",
                  }))
                : [
                    { label: "Item Type", value: output.type },
                    { label: "Rarity Tier", value: output.rarity },
                  ]
            }
            tags={["Forge", output.type, output.rarity]}
            className="w-full"
          >
            <div className="flex items-start gap-3.5 mb-3 w-full text-left cursor-help group/header">
              <div
                className="relative w-14 h-14 rounded-2xl bg-black/60 border flex-shrink-0 p-1.5 flex items-center justify-center shadow-inner group-hover/header:scale-105 transition-transform"
                style={{ borderColor: `${rarityColor}60` }}
              >
                <img
                  src={getItemIconPath(output.name, output.type)}
                  alt={output.name}
                  className="w-11 h-11 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-white font-heading truncate leading-tight group-hover/header:text-cyan-200 transition-colors">
                  {output.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span
                    className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border text-cyan-300"
                    style={{ borderColor: `${rarityColor}60`, background: `${rarityColor}20` }}
                  >
                    {output.rarity}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {output.type}
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    Lv.{requiredLevel} Req
                  </span>
                </div>
              </div>
            </div>
          </SystemTooltip>

          {/* Description & Lore Short Preview */}
          <p className="text-xs text-slate-300 italic leading-relaxed mb-3 bg-black/30 p-2.5 rounded-xl border border-white/5 line-clamp-2">
            &quot;{output.description || recipe.description}&quot;
          </p>

          {/* Output Stat Bonuses */}
          {usageDetails.hasBonuses && (
            <div className="mb-4 grid grid-cols-2 gap-1.5">
              {usageDetails.statBonuses.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
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
          )}

          {/* Required Materials Section */}
          <div className="mb-4 bg-[#070D1E]/95 p-3.5 rounded-xl border border-cyan-500/20">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Required Materials:
            </span>
            <div className="space-y-2">
              {ingredients.map((ing) => (
                <SystemTooltip
                  key={ing.name}
                  title={ing.name}
                  subtitle={`Crafting Material • Required: ${ing.quantity}x`}
                  category="Forge Ingredient"
                  rarity={ing.isSatisfied ? "UNCOMMON" : "COMMON"}
                  description={`Essential forging catalyst required to construct ${output.name}.`}
                  lore="Harvested from gate incursions, shop exchanges, and floor clear bounties."
                  mechanics={`Inventory Status: ${ing.ownedQuantity} in storage (${ing.isSatisfied ? "Requirement Met ✓" : "Insufficient Quantity ✕"})`}
                  stats={[
                    { label: "Required", value: `${ing.quantity}x`, color: "text-amber-400" },
                    { label: "You Own", value: `${ing.ownedQuantity}x`, color: ing.isSatisfied ? "text-emerald-400" : "text-red-400" }
                  ]}
                  tags={["Material", "Crafting", "Alchemy"]}
                  className="w-full"
                >
                  <div
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors w-full cursor-help ${
                      ing.isSatisfied
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                        : "bg-red-950/30 border-red-500/40 text-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-6 h-6 rounded-md bg-black/50 border border-white/10 flex items-center justify-center shrink-0 p-0.5">
                        <img
                          src={getItemIconPath(ing.name, "MATERIAL")}
                          alt={ing.name}
                          onError={(e) => {
                            e.currentTarget.src = "/icons/Icon280.png";
                          }}
                          className="w-full h-full object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <span className="font-sans font-medium text-slate-200 text-xs leading-tight text-left">
                        {ing.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold shrink-0 ml-1">
                      <span className="text-xs">
                        {ing.ownedQuantity} / {ing.quantity}
                      </span>
                      {ing.isSatisfied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                </SystemTooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Gold Cost & Craft Action */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Forging Fee:</span>
            <div
              className={`flex items-center gap-1 font-bold ${
                hasEnoughGold ? "text-amber-300" : "text-red-400"
              }`}
            >
              <span>{goldCost.toLocaleString()}</span>
              <CurrencyIcon type="GOLD" size="xs" />
            </div>
          </div>

          <button
            disabled={!canCraft || isCrafting}
            onClick={() => onCraft(recipe.id)}
            className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
              canCraft
                ? "bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-cyan-500/20 active:scale-[0.98]"
                : "bg-slate-900 border border-white/10 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isCrafting ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Forging Artifact...
              </div>
            ) : canCraft ? (
              <>
                <Hammer className="w-4 h-4 text-cyan-300 animate-bounce" />
                Forge {output.type === "CONSUMABLE" ? "Solution" : "Artifact"}
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Requirements Incomplete
              </>
            )}
          </button>

          {!canCraft && missingRequirements.length > 0 && (
            <p className="text-[10px] text-red-400/90 font-mono text-center truncate">
              {missingRequirements[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
