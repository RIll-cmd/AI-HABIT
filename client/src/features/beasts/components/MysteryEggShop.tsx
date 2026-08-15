"use client";

import React, { useState } from "react";
import { Egg, EggShopItem } from "../types/beast";
import { useBeastStore, EGG_SHOP_ITEMS } from "../store/useBeastStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ShoppingBag,
  Footprints,
  Check,
  Zap,
  ArrowRight,
  Package,
  Layers,
  HelpCircle,
} from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { EGG_LORE } from "@/features/lore/loreData";

interface MysteryEggShopProps {
  characterId: string;
  ownedEggs: Egg[];
  activeEggId?: string;
}

export const MysteryEggShop: React.FC<MysteryEggShopProps> = ({
  characterId,
  ownedEggs,
  activeEggId,
}) => {
  const { buyEgg, incubateEgg, isBuying } = useBeastStore();
  const { character } = useCharacterStore();
  const [activeTab, setActiveTab] = useState<"SHOP" | "STORAGE">("SHOP");

  const unhatchedEggs = ownedEggs.filter((e) => e.status !== "HATCHED");

  const handleBuy = async (item: EggShopItem, currency: "GOLD" | "GEMS") => {
    playUIMenuSFX("confirm");
    await buyEgg(characterId, item.id, currency);
  };

  const handleIncubate = async (eggId: string) => {
    playBuffSFX("speed");
    await incubateEgg(characterId, eggId);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/30 p-6 shadow-xl relative overflow-hidden backdrop-blur-2xl space-y-6">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              SANCTUARY EGG VAULT
            </span>
          </div>
          <h3 className="text-xl font-black font-heading text-white tracking-wide mt-0.5">
            Egg Market & Storage
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setActiveTab("SHOP");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === "SHOP"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sanctuary Shop
          </button>
          <button
            onClick={() => {
              playUIMenuSFX("confirm");
              setActiveTab("STORAGE");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "STORAGE"
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Egg Storage ({unhatchedEggs.length})
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SANCTUARY SHOP SHELF */}
      {/* ========================================================= */}
      {activeTab === "SHOP" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EGG_SHOP_ITEMS.map((item) => {
            const canAffordGold = (character?.gold || 0) >= item.goldPrice;
            const canAffordGems = item.gemPrice > 0 && (character?.gems || 0) >= item.gemPrice;

            const eggLore = EGG_LORE[item.name] || {
              origin: "Harvested from deep dimensional rifts.",
              storyLore: item.description,
              incubationGuide: `Accumulate ${(item.targetEnergy ?? item.targetSteps).toLocaleString()} steps to hatch this egg.`,
              potentialBeasts: ["Mystic Dragon", "Celestial Beast"]
            };

            return (
              <SystemTooltip
                key={item.id}
                title={item.name}
                subtitle={`${item.eggType} Element • ${(item.targetEnergy ?? item.targetSteps).toLocaleString()} Steps Target`}
                category="Mystery Beast Egg"
                rarity={item.rarity as any}
                description={item.description}
                lore={eggLore.storyLore}
                mechanics={eggLore.incubationGuide}
                howToImprove={`Accumulate daily walking steps (${(item.targetEnergy ?? item.targetSteps).toLocaleString()} steps) to feed kinetic energy into the Incubator Chamber.`}
                stats={[
                  { label: "Step Target", value: `${(item.targetEnergy ?? item.targetSteps).toLocaleString()} Steps`, color: "text-cyan-300" },
                  { label: "Egg Element", value: item.eggType, color: "text-amber-300" }
                ]}
                tags={[item.eggType, item.rarity, "Incubation"]}
                delayMs={1000}
                className="w-full h-full"
              >
                <div
                  className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border border-cyan-500/25 p-4 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all shadow-lg group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                        {item.eggType} ELEMENT
                      </span>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 text-[9px] font-mono font-bold">
                        {item.rarity}
                      </Badge>
                    </div>

                    {/* Egg Sprite Display */}
                    <div className="py-3 flex items-center justify-center bg-black/40 rounded-xl border border-white/5 group-hover:scale-105 transition-transform">
                      <img
                        src={item.sprite}
                        alt={item.name}
                        className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-black font-heading text-white">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-300 bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/20">
                      <Footprints className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Requires {(item.targetEnergy ?? item.targetSteps).toLocaleString()} Steps</span>
                    </div>
                  </div>

                  {/* Purchase Buttons */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <Button
                      onClick={() => handleBuy(item, "GOLD")}
                      disabled={isBuying || !canAffordGold}
                      className={`w-full h-9 font-mono text-xs font-bold rounded-xl flex items-center justify-between px-3 cursor-pointer ${
                        canAffordGold
                          ? "bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 shadow-md"
                          : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <CurrencyIcon type="GOLD" size="sm" />
                        Buy with Gold
                      </span>
                      <span className="font-black">{item.goldPrice.toLocaleString()} G</span>
                    </Button>

                    {item.gemPrice > 0 && (
                      <Button
                        onClick={() => handleBuy(item, "GEMS")}
                        disabled={isBuying || !canAffordGems}
                        className={`w-full h-9 font-mono text-xs font-bold rounded-xl flex items-center justify-between px-3 cursor-pointer ${
                          canAffordGems
                            ? "bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 shadow-md"
                            : "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <CurrencyIcon type="GEMS" size="sm" />
                          Buy with Gems
                        </span>
                        <span className="font-black">{item.gemPrice} Gems</span>
                      </Button>
                    )}
                  </div>
                </div>
              </SystemTooltip>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: OWNED EGG STORAGE */}
      {/* ========================================================= */}
      {activeTab === "STORAGE" && (
        <div className="space-y-4">
          {unhatchedEggs.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <Package className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-mono">
                No eggs currently stored in your inventory vault. Purchase eggs in the Sanctuary Shop!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {unhatchedEggs.map((egg) => {
                const isActive = egg.id === activeEggId;
                const cSteps = egg.currentSteps ?? egg.currentEnergy ?? 0;
                const tSteps = egg.targetSteps ?? egg.targetEnergy ?? 5000;
                const eggLore = EGG_LORE[egg.name] || {
                  origin: "Harvested from gate rifts.",
                  storyLore: "A dormant mystery egg.",
                  incubationGuide: `Accumulate ${tSteps.toLocaleString()} steps to hatch.`
                };

                return (
                  <SystemTooltip
                    key={egg.id}
                    title={egg.name}
                    subtitle={`${egg.rarity} Mystery Egg • ${cSteps}/${tSteps} Steps`}
                    category="Incubating Relic"
                    rarity={egg.rarity as any}
                    description={`Current incubation energy: ${cSteps.toLocaleString()} / ${tSteps.toLocaleString()} steps.`}
                    lore={eggLore.storyLore}
                    mechanics={eggLore.incubationGuide}
                    howToImprove="Walk, jog, or perform cardio to generate kinetic incubation energy."
                    stats={[
                      { label: "Current Progress", value: `${Math.floor((cSteps / tSteps) * 100)}%`, color: "text-cyan-300" },
                      { label: "Steps Logged", value: `${cSteps} / ${tSteps}`, color: "text-amber-300" }
                    ]}
                    tags={[egg.rarity, "Incubation"]}
                    delayMs={1000}
                    className="w-full h-full"
                  >
                    <div
                      className={`w-full h-full rounded-2xl p-4 border flex flex-col justify-between space-y-3 ${
                        isActive
                          ? "bg-gradient-to-br from-[#0c2236] to-[#06121f] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          : "bg-slate-900/80 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[9px] font-mono">
                          {egg.rarity}
                        </Badge>
                        {isActive && (
                          <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            INCUBATING
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={egg.sprite}
                          alt={egg.name}
                          className="w-12 h-12 object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-white font-heading truncate">{egg.name}</h5>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {cSteps.toLocaleString()} / {tSteps.toLocaleString()} Steps
                          </span>
                        </div>
                      </div>

                      {!isActive && (
                        <Button
                          size="sm"
                          onClick={() => handleIncubate(egg.id)}
                          className="w-full h-8 font-mono text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl"
                        >
                          Slot into Incubator
                        </Button>
                      )}
                    </div>
                  </SystemTooltip>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
