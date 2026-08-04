"use client";

import React, { useState } from "react";
import { Package, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryRecord, ItemCategory } from "../types";
import { ItemCard } from "./ItemCard";

interface InventoryGridProps {
  bagItems: InventoryRecord[];
  onEquip: (record: InventoryRecord) => void;
  isLoading?: boolean;
}

export function InventoryGrid({
  bagItems,
  onEquip,
  isLoading,
}: InventoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories: Array<string> = ["All", "Equipment", "Consumable", "Material", "Relic"];

  const filteredItems = bagItems.filter((record) => {
    const item = record.item;
    if (!item) return false;

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Card className="bg-[#151C33] border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      <CardHeader className="p-4 px-5 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-base font-bold text-slate-100 font-heading">
              Inventory Bag ({bagItems.length})
            </CardTitle>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[#0D1322] border-slate-800 text-slate-200"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] h-8 px-3 whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-1 overflow-y-auto min-h-[350px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
            <div className="h-32 bg-slate-900/60 rounded-xl" />
            <div className="h-32 bg-slate-900/60 rounded-xl" />
            <div className="h-32 bg-slate-900/60 rounded-xl" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 text-slate-500">
            <Package className="w-12 h-12 stroke-[1.5]" />
            <p className="text-sm font-semibold">No items found in your bag</p>
            <p className="text-xs text-slate-400">
              Clear floors in the Tower of Ascension to collect gear and loot drops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredItems.map((record) => (
              <ItemCard
                key={record.id}
                record={record}
                onEquip={() => onEquip(record)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
