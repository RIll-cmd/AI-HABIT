"use client";

import { useEffect, useState } from "react";
import { useShopStore } from "@/features/shop/store/useShopStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { ShopItemCard } from "@/features/shop/components/ShopItemCard";
import { CielShopCoaching } from "@/features/shop/components/CielShopCoaching";
import { Coins, Diamond, Shield, Store, Loader2, RotateCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { playUIMenuSFX } from "@/utils/audio";

export default function ShopPage() {
  const { items, isLoading, isRefreshing, error, fetchShopItems, refreshShopItems } = useShopStore();
  const { character, loadCharacter } = useCharacterStore();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Ensuring character is loaded
    if (!character) {
      loadCharacter();
    } else {
      fetchShopItems(character.id);
    }
  }, [character?.id, fetchShopItems, loadCharacter]);

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
          
          <div className="flex gap-4">
            <Card className="bg-black/40 border-yellow-500/20 px-4 py-3 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-yellow-500/70 font-semibold uppercase tracking-wider">Gold</p>
                <p className="text-xl font-bold text-yellow-400">{character.gold.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-black/40 border-cyan-500/20 px-4 py-3 flex items-center gap-3 backdrop-blur-md hidden sm:flex">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Diamond className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-cyan-500/70 font-semibold uppercase tracking-wider">Gems</p>
                <p className="text-xl font-bold text-cyan-400">{(character.gems || 0).toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-black/40 border-purple-500/20 px-4 py-3 flex items-center gap-3 backdrop-blur-md hidden sm:flex">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-purple-500/70 font-semibold uppercase tracking-wider">Tower Tokens</p>
                <p className="text-xl font-bold text-purple-400">{(character.towerTokens || 0).toLocaleString()}</p>
              </div>
            </Card>
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

            <Button
              onClick={() => refreshShopItems(character.id)}
              disabled={isRefreshing || isLoading}
              className="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-wider gap-2 shadow-sm transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
              <span>{isRefreshing ? "Rotating Stock..." : "Rotate Stock"}</span>
            </Button>
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
