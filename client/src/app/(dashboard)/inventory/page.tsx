"use client";

import React, { useEffect } from "react";
import { Package, Shield, Sparkles, Coins } from "lucide-react";
import { useInventoryStore } from "@/features/inventory/store";
import { EquipmentPanel, InventoryGrid } from "@/features/inventory/components";
import { useCharacterStore } from "@/store/useCharacterStore";

export default function InventoryPage() {
  const { character } = useCharacterStore();
  const { inventory, isLoading, loadInventory, equip, unequip } =
    useInventoryStore();

  const characterId = character?.id || "char-id-123";

  useEffect(() => {
    loadInventory(characterId);
  }, [characterId, loadInventory]);

  const equippedItems = inventory.filter((item) => item.isEquipped);
  const bagItems = inventory.filter((item) => !item.isEquipped);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#151C33] via-[#1A1836] to-[#151C33] p-6 rounded-2xl border border-blue-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-400" />
            <h1 className="text-2xl font-black font-heading text-slate-100 tracking-tight">
              Inventory & Equipment Vault
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage equipped gear slots, inspect items, and optimize your character's combat attributes for Tower floor challenges.
          </p>
        </div>

        {/* Economy Gold & Gear Count Overview */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-3 px-5 rounded-xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Vault Balance
            </span>
            <span className="text-base font-black font-mono text-amber-400">
              🪙 {character?.gold || 0} Gold
            </span>
          </div>

          <div className="text-right border-l border-slate-800 pl-4">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Equipped / Bag
            </span>
            <span className="text-sm font-bold text-blue-400 font-mono">
              {equippedItems.length} Eq • {bagItems.length} Bag
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Equipment Paper Doll Matrix (5 cols) */}
        <div className="lg:col-span-5">
          <EquipmentPanel
            equippedItems={equippedItems}
            onUnequip={(record) => unequip(characterId, record.id)}
            characterStats={character?.stats as any}
          />
        </div>

        {/* Right Column: Inventory Bag Grid (7 cols) */}
        <div className="lg:col-span-7">
          <InventoryGrid
            bagItems={bagItems}
            onEquip={(record) => equip(characterId, record.id)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
