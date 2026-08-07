import React from 'react';
import { PlayerItem } from '../types/inventory';
import Image from 'next/image';
import { Lock, Star, Shield } from 'lucide-react';

interface ItemCardProps {
  item: PlayerItem;
  onClick: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'border-gray-500 shadow-gray-500/20 text-gray-400',
  RARE: 'border-blue-500 shadow-blue-500/40 text-blue-400',
  EPIC: 'border-purple-500 shadow-purple-500/40 text-purple-400',
  LEGENDARY: 'border-orange-500 shadow-orange-500/50 text-orange-400',
  MYTHIC: 'border-red-500 shadow-red-500/60 text-red-500',
};

const RARITY_BG: Record<string, string> = {
  COMMON: 'bg-gray-500/10',
  RARE: 'bg-blue-500/10',
  EPIC: 'bg-purple-500/10',
  LEGENDARY: 'bg-orange-500/10',
  MYTHIC: 'bg-red-500/10',
};

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const { itemDefinition, isEquipped, isLocked, isFavorite, quantity } = item;
  
  const rarityStyle = RARITY_COLORS[itemDefinition.rarity] || RARITY_COLORS.COMMON;
  const bgStyle = RARITY_BG[itemDefinition.rarity] || RARITY_BG.COMMON;

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between min-h-[140px] text-center bg-[#151C33] ${rarityStyle} ${bgStyle}`}
    >
      {/* Top Indicators */}
      <div className="absolute top-2 left-2 flex gap-1 text-sm">
        {isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
        {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
      </div>
      
      {isEquipped && (
        <div className="absolute top-2 right-2 text-[10px] font-bold text-green-400 bg-green-400/20 px-1.5 py-0.5 rounded uppercase tracking-widest">
          EQP
        </div>
      )}

      {/* Icon */}
      <div className="relative w-16 h-16 mt-4">
        {itemDefinition.icon ? (
          <Image 
            src={itemDefinition.icon.replace('client/public', '')} // Ensure path works for next/image
            alt={itemDefinition.name} 
            fill
            className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          />
        ) : (
          <div className="w-full h-full bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
            <Shield className="w-8 h-8 text-white/30" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-2 w-full">
        <h4 className="text-xs font-bold text-white truncate px-1" title={itemDefinition.name}>
          {itemDefinition.name}
        </h4>
        <div className="flex justify-between items-center px-1 mt-1">
           <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">{itemDefinition.rarity}</span>
           {quantity > 1 && <span className="text-[10px] font-medium text-gray-300">x{quantity}</span>}
        </div>
      </div>
    </div>
  );
};
