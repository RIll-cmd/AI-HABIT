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

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border border-cyan-500/25 p-4 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all shadow-lg group"
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
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-300 bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/20">
                    <Footprints className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Requires {item.targetEnergy.toLocaleString()} Steps</span>
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
            <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300 font-heading">
                No Eggs in Storage
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Purchase mystery eggs in the Sanctuary Shop tab or acquire them through daily missions!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {unhatchedEggs.map((egg) => {
                const isCurrentlyActive = egg.id === activeEggId;
                const progress = Math.min(100, Math.floor((egg.currentEnergy / egg.targetEnergy) * 100));

                return (
                  <div
                    key={egg.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                      isCurrentlyActive
                        ? "bg-gradient-to-br from-[#0c1c30] to-[#060e1a] border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        : "bg-black/40 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-1 shrink-0">
                        <img
                          src={egg.sprite}
                          alt={egg.name}
                          className="w-full h-full object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[9px] font-mono font-bold mb-1">
                          {egg.rarity}
                        </Badge>
                        <h4 className="text-xs font-black font-heading text-white truncate">
                          {egg.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {egg.currentEnergy.toLocaleString()} / {egg.targetEnergy.toLocaleString()} Energy ({progress}%)
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleIncubate(egg.id)}
                      disabled={isCurrentlyActive}
                      className={`w-full h-8 font-mono text-[10.5px] font-bold rounded-xl cursor-pointer ${
                        isCurrentlyActive
                          ? "bg-cyan-500 text-slate-950 font-black cursor-default"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
                      }`}
                    >
                      {isCurrentlyActive ? "IN INCUBATOR" : "PLACE IN INCUBATOR"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
