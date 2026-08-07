import React from 'react';
import { PlayerItem } from '../types/inventory';
import Image from 'next/image';
import { X, Lock, Star, Shield, Sword } from 'lucide-react';

interface ItemDetailModalProps {
  item: PlayerItem | null;
  onClose: () => void;
  onEquip: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'text-gray-400 border-gray-500 shadow-gray-500/20',
  RARE: 'text-blue-400 border-blue-500 shadow-blue-500/40',
  EPIC: 'text-purple-400 border-purple-500 shadow-purple-500/40',
  LEGENDARY: 'text-orange-400 border-orange-500 shadow-orange-500/50',
  MYTHIC: 'text-red-500 border-red-500 shadow-red-500/60',
};

const STAT_LABELS = [
  'attack', 'defense', 'strength', 'knowledge', 'discipline', 'focus', 'endurance', 'recovery'
];

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onEquip,
  onToggleLock,
  onToggleFavorite
}) => {
  if (!item) return null;

  const { itemDefinition } = item;
  const rarityStyle = RARITY_COLORS[itemDefinition.rarity] || RARITY_COLORS.COMMON;

  // Collect non-zero stats
  const activeStats = STAT_LABELS.filter(stat => (itemDefinition as any)[stat] > 0);

  const canEquip = ["WEAPON", "HELMET", "ARMOR", "GLOVES", "BOOTS", "RING", "NECKLACE", "ARTIFACT", "RELIC"].includes(itemDefinition.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-sm bg-[#0B1020] border-2 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl ${rarityStyle}`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Header & Icon */}
        <div className="flex gap-4 items-start pr-8">
          <div className="relative w-24 h-24 rounded-xl bg-black/40 border border-white/10 flex-shrink-0 p-3 flex items-center justify-center">
             {itemDefinition.icon ? (
               <Image 
                 src={itemDefinition.icon.replace('client/public', '')} 
                 alt={itemDefinition.name} 
                 fill 
                 className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] p-2" 
               />
             ) : (
               <Shield className="w-12 h-12 text-white/30" />
             )}
          </div>
          <div className="flex flex-col mt-1">
            <h2 className="text-xl font-bold text-white leading-tight font-heading">{itemDefinition.name}</h2>
            <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 ${RARITY_COLORS[itemDefinition.rarity]?.split(' ')[0]}`}>
              {itemDefinition.rarity} {itemDefinition.type}
            </span>
            <span className="text-xs text-amber-400 font-mono mt-1 flex items-center gap-1">
              Value: {itemDefinition.sellValue}g
            </span>
          </div>
        </div>

        {/* Description & Stats */}
        <div className="bg-[#151C33]/50 rounded-xl p-4 text-sm text-gray-300 border border-white/5">
          <p className="italic text-slate-400 text-xs leading-relaxed mb-4">"{itemDefinition.description || "A mysterious item of unknown origin."}"</p>
          
          {activeStats.length > 0 && (
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-white/10 pt-4">
              {activeStats.map(stat => (
                <div key={stat} className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded">
                  <span className="capitalize text-[10px] text-slate-400 font-mono tracking-wider">{stat}</span>
                  <span className="font-bold text-white text-xs font-mono">
                    +{(itemDefinition as any)[stat]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {itemDefinition.passive && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <span className="text-yellow-400 font-bold block mb-1 text-xs uppercase tracking-widest">Passive Effect</span>
              <p className="text-xs text-slate-300">{itemDefinition.passive}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          {canEquip && (
            <button 
              onClick={() => onEquip(item.id)}
              className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-all text-xs flex items-center justify-center gap-2 ${
                item.isEquipped 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50" 
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400/50"
              }`}
            >
              <Sword className="w-4 h-4" />
              {item.isEquipped ? "Unequip Item" : "Equip Item"}
            </button>
          )}

          <div className="flex gap-2">
            <button 
              onClick={() => onToggleFavorite(item.id)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                item.isFavorite 
                  ? "border-yellow-400/50 text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20" 
                  : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-yellow-400' : ''}`} />
              Favorite
            </button>
            <button 
              onClick={() => onToggleLock(item.id)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                item.isLocked 
                  ? "border-slate-500 text-slate-300 bg-slate-500/20 hover:bg-slate-500/30" 
                  : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {item.isLocked ? "Unlock" : "Lock"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
