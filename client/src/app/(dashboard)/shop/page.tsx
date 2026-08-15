"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/features/shop/store/useShopStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useDailyBonusStore } from "@/store/useDailyBonusStore";
import { ShopItemCard } from "@/features/shop/components/ShopItemCard";
import { CielShopCoaching } from "@/features/shop/components/CielShopCoaching";
import { Store, Loader2, RotateCw, Sparkles, Coins } from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { CURRENCY_LORE } from "@/features/lore/loreData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { playUIMenuSFX } from "@/utils/audio";

export default function ShopPage() {
  const { items, isLoading, isRefreshing, error, fetchShopItems, refreshShopItems } = useShopStore();
  const { character, loadCharacter } = useCharacterStore();
  const { shopRefreshCharges, maxShopRefreshCharges, checkAndResetDaily } = useDailyBonusStore();
  const [activeTab, setActiveTab] = useState("all");

  const REFRESH_GOLD_COST = 100;
  const hasFreeRefreshes = shopRefreshCharges > 0;

  useEffect(() => {
    checkAndResetDaily();
    // Ensuring character is loaded
    if (!character) {
      loadCharacter();
    } else {
      fetchShopItems(character.id);
    }
  }, [character?.id, fetchShopItems, loadCharacter, checkAndResetDaily]);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Derived filter logic
  const filteredItems = items.filter((item) => {
    if (activeTab === "equipment") {
      return ["WEAPON", "HELMET", "ARMOR", "GLOVES", "BOOTS", "RING", "NECKLACE"].includes(item.type);
    }
    if (activeTab === "consumables") {
      return item.type === "CONSUMABLE";
    }
    return true; // "all"
  });

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* RPG Header / Currency Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-indigo-500/20 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Store className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 tracking-tight">
                The Ascendant Exchange
              </h1>
              <p className="text-indigo-200/60 font-medium">Trade your hard-earned rewards for power.</p>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
            {/* Gold Tooltip & Card */}
            <SystemTooltip
              title={CURRENCY_LORE.gold.name}
              subtitle="Primary Ascend Currency"
              category={CURRENCY_LORE.gold.category}
              rarity={CURRENCY_LORE.gold.rarity}
              description={CURRENCY_LORE.gold.description}
              lore={CURRENCY_LORE.gold.lore}
              mechanics={CURRENCY_LORE.gold.mechanics}
              stats={[
                { label: "Your Balance", value: `${character.gold.toLocaleString()} Gold`, color: "text-amber-400" },
                { label: "Acquisition", value: "Tower, Missions, Habits, Bosses" }
              ]}
              tags={CURRENCY_LORE.gold.tags}
              delayMs={1000}
            >
              <Card className="bg-black/40 border-yellow-500/20 px-4 py-3 flex items-center gap-3 backdrop-blur-md cursor-help hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all">
                <CurrencyIcon type="GOLD" size="lg" />
                <div>
                  <p className="text-xs text-yellow-500/70 font-semibold uppercase tracking-wider">Gold</p>
                  <p className="text-xl font-bold text-yellow-400">{character.gold.toLocaleString()}</p>
                </div>
              </Card>
            </SystemTooltip>

            {/* Gems Tooltip & Card */}
            <SystemTooltip
              title={CURRENCY_LORE.gems.name}
              subtitle="Premium Astral Currency"
              category={CURRENCY_LORE.gems.category}
              rarity={CURRENCY_LORE.gems.rarity}
              description={CURRENCY_LORE.gems.description}
              lore={CURRENCY_LORE.gems.lore}
              mechanics={CURRENCY_LORE.gems.mechanics}
              stats={[
                { label: "Your Balance", value: `${(character.gems || 0).toLocaleString()} Gems`, color: "text-cyan-400" },
                { label: "Acquisition", value: "Boss Clears, PR Milestones, Elite Tiers" }
              ]}
              tags={CURRENCY_LORE.gems.tags}
              delayMs={1000}
            >
              <Card className="bg-black/40 border-cyan-500/20 px-4 py-3 flex items-center gap-3 backdrop-blur-md hidden sm:flex cursor-help hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                <CurrencyIcon type="GEMS" size="lg" />
                <div>
                  <p className="text-xs text-cyan-500/70 font-semibold uppercase tracking-wider">Gems</p>
                  <p className="text-xl font-bold text-cyan-400">{(character.gems || 0).toLocaleString()}</p>
                </div>
              </Card>
            </SystemTooltip>

            {/* Abyssal Tokens Tooltip & Card (3rd Currency) */}
            <SystemTooltip
              title={CURRENCY_LORE.towerTokens.name}
              subtitle="Ascension Sigil Currency"
              category={CURRENCY_LORE.towerTokens.category}
              rarity={CURRENCY_LORE.towerTokens.rarity}
              description={CURRENCY_LORE.towerTokens.description}
              lore={CURRENCY_LORE.towerTokens.lore}
              mechanics={CURRENCY_LORE.towerTokens.mechanics}
              stats={[
                { label: "Your Balance", value: `${(character.towerTokens || 0).toLocaleString()} Tokens`, color: "text-purple-400" },
                { label: "Acquisition", value: "Tower Floor Clears, Boss PRs, Consistency" }
              ]}
              tags={CURRENCY_LORE.towerTokens.tags}
              delayMs={1000}
            >
              <Card className="bg-black/40 border-purple-500/20 px-4 py-3 flex items-center gap-3 backdrop-blur-md hidden sm:flex cursor-help hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                <CurrencyIcon type="TOWER_TOKENS" size="lg" />
                <div>
                  <p className="text-xs text-purple-500/70 font-semibold uppercase tracking-wider">Abyssal Tokens</p>
                  <p className="text-xl font-bold text-purple-400">{(character.towerTokens || 0).toLocaleString()}</p>
                </div>
              </Card>
            </SystemTooltip>

            {/* Daily Free Reroll Charge Meter Tooltip & Card */}
            <SystemTooltip
              title="Daily Free Shop Refreshes"
              subtitle="System Perk Rotation"
              category="Daily Bonus"
              rarity="UNCOMMON"
              description="Re-roll the Armory and Consumables catalog without spending Imperial Gold."
              lore="System merchants rotate their stock once per day or upon receiving tactical credentials."
              mechanics="Grants 5 free rerolls every 24 hours. Once depleted, rerolls cost 100 Gold."
              stats={[
                { label: "Remaining Today", value: `${shopRefreshCharges} / ${maxShopRefreshCharges}`, color: "text-teal-300" }
              ]}
              tags={["Shop", "Reroll", "DailyBonus"]}
              delayMs={1000}
            >
              <Card className="bg-black/40 border-teal-500/30 px-4 py-3 flex items-center gap-3 backdrop-blur-md cursor-help hover:border-teal-500/60 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-all">
                <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.3)]">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-teal-400/80 font-mono font-bold uppercase tracking-wider">Free Rerolls</p>
                  <p className="text-lg font-mono font-black text-teal-300">
                    {shopRefreshCharges} / {maxShopRefreshCharges}
                  </p>
                </div>
              </Card>
            </SystemTooltip>
          </div>
        </div>
      </div>

      {/* Ciel AI Coaching Panel */}
      <CielShopCoaching />

      {/* Main Storefront Area */}
      <div className="space-y-6">
        <Tabs
          defaultValue="all"
          onValueChange={(val) => {
            setActiveTab(val);
            playUIMenuSFX("confirm");
          }}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="all" className="px-6">All Items</TabsTrigger>
              <TabsTrigger value="equipment" className="px-6">Equipment</TabsTrigger>
              <TabsTrigger value="consumables" className="px-6">Consumables</TabsTrigger>
            </TabsList>

            {/* Smart Refresh Button (Free vs Gold) */}
            <div className="flex items-center gap-2.5">
              {hasFreeRefreshes ? (
                <Button
                  type="button"
                  onClick={() => refreshShopItems(character.id, true)}
                  disabled={isRefreshing || isLoading}
                  className="bg-gradient-to-r from-teal-600/30 to-cyan-600/30 hover:from-teal-600/50 hover:to-cyan-600/50 border border-teal-500/40 text-teal-300 text-xs font-mono font-black uppercase tracking-wider gap-2 shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-all cursor-pointer h-10 px-4 rounded-xl"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-teal-400" : ""}`} />
                  <span>{isRefreshing ? "Rotating Stock..." : `Free Reroll (${shopRefreshCharges}/5 Left)`}</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => refreshShopItems(character.id, false, REFRESH_GOLD_COST)}
                  disabled={isRefreshing || isLoading || character.gold < REFRESH_GOLD_COST}
                  className={`text-xs font-mono font-black uppercase tracking-wider gap-2 shadow-sm transition-all h-10 px-4 rounded-xl cursor-pointer ${
                    character.gold >= REFRESH_GOLD_COST
                      ? "bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
                  <span>{isRefreshing ? "Rotating Stock..." : `Reroll Stock (${REFRESH_GOLD_COST} Gold)`}</span>
                </Button>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p>Summoning shop inventory...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-destructive">
              <p className="font-bold text-lg mb-2">Error connecting to the exchange</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <ShopItemCard key={item.id} item={item} />
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Store className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium text-lg">No items available in this category.</p>
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
