"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useCraftingStore } from "@/features/crafting/store/useCraftingStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { RecipeCard } from "@/features/crafting/components/RecipeCard";
import { CraftSuccessModal } from "@/features/crafting/components/CraftSuccessModal";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import {
  Hammer,
  Sparkles,
  Search,
  Flame,
  Shield,
  Sword,
  Gem,
  FlaskConical,
  Package,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type CategoryFilter = "ALL" | "WEAPONS" | "ARMOR" | "ACCESSORIES" | "ALCHEMY";

export default function CraftingPage() {
  const { character } = useCharacterStore();
  const { items, fetchInventory } = useInventoryStore();
  const {
    recipes,
    isLoading,
    isCrafting,
    fetchRecipes,
    craftRecipe,
    lastCraftedResult,
    clearLastCrafted,
  } = useCraftingStore();

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const charId = character?.id || "char-id-123";

  useEffect(() => {
    fetchRecipes(charId);
    fetchInventory(charId);
  }, [charId, fetchRecipes, fetchInventory]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (activeCategory !== "ALL" && r.category !== activeCategory) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchOutput = r.output.name.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        if (!matchTitle && !matchOutput && !matchDesc) return false;
      }
      return true;
    });
  }, [recipes, activeCategory, searchQuery]);

  const craftableCount = useMemo(() => {
    return recipes.filter((r) => r.canCraft).length;
  }, [recipes]);

  const materialItemsCount = useMemo(() => {
    return items.filter((i) => i.itemDefinition.type === "MATERIAL").length;
  }, [items]);

  const handleCraft = async (recipeId: string) => {
    await craftRecipe(charId, recipeId);
  };

  return (
    <div suppressHydrationWarning className="max-w-7xl mx-auto w-full space-y-6 text-slate-100 pb-16 animate-in fade-in duration-300">
      {/* Top Cyber Forge Hero Banner */}
      <div
        suppressHydrationWarning
        className="relative rounded-3xl bg-gradient-to-r from-[#070D1E] via-[#0E1630] to-[#0A1024] border border-cyan-500/30 p-6 md:p-8 shadow-2xl overflow-hidden shrink-0"
      >
        {/* Glow particles and forge background ambience */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Hammer className="w-5 h-5 text-cyan-300 animate-bounce" />
              </div>
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
                ANCIENT GATE WORKSHOP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading tracking-wider">
              CYBER FORGE & ALCHEMY
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Synthesize raw dungeon materials, gate cores, and dragon scales into high-tier
              armaments, sovereign relics, and powerful attribute elixirs.
            </p>
          </div>

          {/* Quick HUD Vault Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <CurrencyIcon type="GOLD" size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  Gold Vault
                </span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  {character?.gold?.toLocaleString() || "0"}
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  Materials
                </span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  {materialItemsCount} In Stock
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-500/40 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-purple-300 uppercase tracking-widest">
                  Ready to Forge
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {craftableCount} / {recipes.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#090E20] p-2.5 rounded-2xl border border-white/10 shadow-lg">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-xl">
          {[
            { id: "ALL", label: "All Recipes", icon: Layers },
            { id: "WEAPONS", label: "Weapons", icon: Sword },
            { id: "ARMOR", label: "Armor & Plate", icon: Shield },
            { id: "ACCESSORIES", label: "Relics & Rings", icon: Gem },
            { id: "ALCHEMY", label: "Alchemy & Potions", icon: FlaskConical },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-200" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search forge recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/15 text-white text-xs font-mono rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="flex-1">
        {isLoading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase text-cyan-300">
              Calibrating Forge Conduits...
            </span>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onCraft={handleCraft}
                isCrafting={isCrafting}
                playerGold={character?.gold || 0}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-[#070D1E]/60 rounded-3xl border border-white/10 p-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500">
              <Hammer className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Recipes Found</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              No crafting blueprints match your search criteria. Switch category tabs or clear your
              search query.
            </p>
          </div>
        )}
      </div>

      {/* Crafting Success Modal */}
      <CraftSuccessModal result={lastCraftedResult} onClose={clearLastCrafted} />
    </div>
  );
}
