import React, { useEffect } from 'react';
import { PlayerItem } from '../types/inventory';
import Image from 'next/image';
import { X, Lock, Star, Shield, Sword, Sparkles, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { playUISound, playBuffSFX, playUIMenuSFX } from '@/utils/audio';
import { getItemIconPath } from '@/utils/itemIcons';
import { getItemUsageDetails } from '@/utils/itemUsageUtils';

interface ItemDetailModalProps {
  item: PlayerItem | null;
  onClose: () => void;
  onEquip: (id: string) => void;
  onUse?: (id: string) => void;
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

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onEquip,
  onUse,
  onToggleLock,
  onToggleFavorite
}) => {
  const [isConsuming, setIsConsuming] = React.useState(false);

  useEffect(() => {
    if (item) {
      playUISound("/sounds/System UI & Navigation/SYSTEM--OPEN.mp3");
    }
  }, [!!item]);

  if (!item) return null;

  const { itemDefinition } = item;
  const rarityStyle = RARITY_COLORS[itemDefinition.rarity] || RARITY_COLORS.COMMON;
  const usageDetails = getItemUsageDetails(itemDefinition);

  const canEquip = usageDetails.isEquipment;
  const isConsumable = itemDefinition.type === "CONSUMABLE" || usageDetails.categoryLabel === "Consumable";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-md bg-[#0B1020] border-2 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl ${rarityStyle}`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Header & Icon */}
        <div className="flex gap-4 items-start pr-8">
          <div className="relative w-20 h-20 rounded-2xl bg-black/50 border border-white/15 flex-shrink-0 p-2 flex items-center justify-center shadow-inner">
             <Image 
               src={getItemIconPath(itemDefinition.name)} 
               alt={itemDefinition.name} 
               fill 
               className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] p-1.5" 
             />
          </div>
          <div className="flex flex-col mt-0.5 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight font-heading truncate">{itemDefinition.name}</h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded border ${RARITY_COLORS[itemDefinition.rarity]?.split(' ')[0]} bg-white/5 border-white/10`}>
                {itemDefinition.rarity}
              </span>
              <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {itemDefinition.type}
              </span>
              {usageDetails.isEquipment && (
                <span className="text-[9.5px] text-emerald-400 font-mono uppercase tracking-wider bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Equippable
                </span>
              )}
              {isConsumable && (
                <span className="text-[9.5px] text-cyan-400 font-mono uppercase tracking-wider bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Usable
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs font-mono">
              <span className="text-amber-400">Sell Value: {itemDefinition.sellValue || 0}g</span>
              <span className="text-slate-400">Qty: <strong className="text-white">{item.quantity}</strong></span>
            </div>
          </div>
        </div>

        {/* Description, How to Use & Stats */}
        <div className="bg-[#151C33]/60 rounded-xl p-4 text-sm text-gray-300 border border-white/10 space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
          {/* Lore */}
          <p className="italic text-slate-300 text-xs leading-relaxed bg-[#050a18]/70 p-2.5 rounded-lg border border-white/5">
            &quot;{itemDefinition.description || "A mysterious item forged within system rift gates."}&quot;
          </p>
          
          {/* How to Use / Slot Guide */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#101830] to-[#080d1e] border border-indigo-500/30 text-[11px] leading-relaxed">
            <span className="text-[9.5px] font-mono font-bold text-indigo-300 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" />
              How to Use & Function:
            </span>
            <p className="text-slate-200 font-sans text-[11px]">{usageDetails.usageGuide}</p>
            <div className="mt-1 text-[9.5px] font-mono text-indigo-300">
              Slot: <strong className="text-white">{usageDetails.slotLabel}</strong>
            </div>
          </div>

          {/* Equipment Stat Bonuses */}
          {usageDetails.hasBonuses && (
            <div className="p-2.5 rounded-xl bg-[#0B1428] border border-cyan-500/25">
              <span className="text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Equipment Stat Attributes
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {usageDetails.statBonuses.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg ${s.bg} border ${s.borderColor}`}>
                      <span className="flex items-center gap-1.5 text-[10px] text-slate-300 font-mono tracking-wider">
                        <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                        {s.label}
                      </span>
                      <span className="font-bold text-white text-xs font-mono">
                        +{s.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {itemDefinition.passive && (
            <div className="border-t border-white/10 pt-2">
              <span className="text-yellow-400 font-bold block mb-1 text-xs uppercase tracking-widest">Passive Effect</span>
              <p className="text-xs text-slate-300">{itemDefinition.passive}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          {canEquip && (
            <button 
              onClick={() => {
                if (item.isEquipped) {
                  playUIMenuSFX("confirm");
                } else {
                  playBuffSFX("buff");
                  playUIMenuSFX("equip");
                }
                onEquip(item.id);
              }}
              className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 ${
                item.isEquipped 
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30" 
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
              }`}
            >
              <Sword className="w-4 h-4" />
              {item.isEquipped ? "Unequip Item" : "Equip Item"}
            </button>
          )}

          {isConsumable && (
            <button 
              disabled={isConsuming}
              onClick={async () => {
                if (!onUse) return;
                setIsConsuming(true);
                playBuffSFX("buff");
                playUISound("/sounds/Combat & Actions/SKILL--ACTIVATE.mp3");
                try {
                  await onUse(item.id);
                  onClose();
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsConsuming(false);
                }
              }}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/30"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              {isConsuming ? "Consuming..." : "Use Item Now"}
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

