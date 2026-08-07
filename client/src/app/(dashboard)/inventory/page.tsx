"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useInventoryStore } from '@/features/inventory/store/useInventoryStore';
import { ItemCard } from '@/features/inventory/components/ItemCard';
import { ItemDetailModal } from '@/features/inventory/components/ItemDetailModal';
import { PlayerItem } from '@/features/inventory/types/inventory';
import { Search, Filter, Backpack } from 'lucide-react';

type FilterTab = 'All' | 'Equipment' | 'Consumables' | 'Materials';

export default function InventoryPage() {
  const { items, isLoading, fetchInventory, equipItem, toggleLock, toggleFavorite } = useInventoryStore();
  
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<PlayerItem | null>(null);

  useEffect(() => {
    // Standard char ID across the app during this prototype phase
    fetchInventory("char-id-123");
  }, [fetchInventory]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Tab Filtering
      if (activeTab === 'Equipment') {
        if (["MATERIAL", "CONSUMABLE"].includes(item.itemDefinition.type)) return false;
      }
      if (activeTab === 'Consumables') {
        if (item.itemDefinition.type !== 'CONSUMABLE') return false;
      }
      if (activeTab === 'Materials') {
        if (item.itemDefinition.type !== 'MATERIAL') return false;
      }

      // Search Filtering
      if (searchQuery) {
        if (!item.itemDefinition.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading uppercase tracking-wider flex items-center gap-3">
            <Backpack className="text-purple-500 w-7 h-7" />
            Inventory
          </h1>
          <p className="text-slate-400 text-xs font-mono mt-1">Manage your equipment, consumables, and materials.</p>
        </div>

        {/* Capacity & Quick Stats */}
        <div className="bg-[#0B1020] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-6 shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Capacity</span>
            <span className="text-sm font-bold text-white font-mono">{items.length} / 500</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Equipment</span>
            <span className="text-sm font-bold text-purple-400 font-mono">
              {items.filter(i => !["MATERIAL", "CONSUMABLE"].includes(i.itemDefinition.type)).length}
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0B1020] p-2 rounded-xl border border-white/5 shadow-lg">
        <div className="flex gap-1 w-full sm:w-auto p-1 bg-black/40 rounded-lg">
          {(['All', 'Equipment', 'Consumables', 'Materials'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 font-mono"
          />
        </div>
      </div>

      {/* Item Grid */}
      <div className="flex-1 rounded-[24px] bg-[#0B1020] border border-white/10 p-6 shadow-2xl min-h-[500px]">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase">Loading Inventory...</span>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onClick={() => setSelectedItem(item)} 
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
            <Filter className="w-12 h-12 text-slate-700" />
            <p className="text-sm font-mono uppercase tracking-widest">No items found.</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onEquip={(id) => equipItem(id)}
        onToggleFavorite={(id) => toggleFavorite(id)}
        onToggleLock={(id) => toggleLock(id)}
      />
    </div>
  );
}
