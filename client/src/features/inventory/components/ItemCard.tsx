import React from 'react';
import { PlayerItem } from '../types/inventory';
import Image from 'next/image';
import { Lock, Star, Shield, Sword, Sparkles, Heart } from 'lucide-react';
import { getItemIconPath } from '@/utils/itemIcons';
import { SystemTooltip, SystemTooltipStat } from '@/components/ui/SystemTooltip';

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

  // Build Tooltip Stats
  const tooltipStats: SystemTooltipStat[] = [];
  if (itemDefinition.attack && itemDefinition.attack > 0) {
    tooltipStats.push({ label: "Attack Power", value: `+${itemDefinition.attack} ATK`, color: "text-rose-400", icon: Sword });
  }
  if (itemDefinition.defense && itemDefinition.defense > 0) {
    tooltipStats.push({ label: "Defense Armor", value: `+${itemDefinition.defense} DEF`, color: "text-blue-400", icon: Shield });
  }
  if (itemDefinition.strength && itemDefinition.strength > 0) {
    tooltipStats.push({ label: "Strength Boost", value: `+${itemDefinition.strength}% (IRL Scaling)`, color: "text-rose-300" });
  }
  if (itemDefinition.knowledge && itemDefinition.knowledge > 0) {
    tooltipStats.push({ label: "Knowledge Boost", value: `+${itemDefinition.knowledge}% (IRL Scaling)`, color: "text-cyan-300" });
  }
  if (itemDefinition.discipline && itemDefinition.discipline > 0) {
    tooltipStats.push({ label: "Discipline Boost", value: `+${itemDefinition.discipline}% (IRL Scaling)`, color: "text-amber-300" });
  }
  if (itemDefinition.focus && itemDefinition.focus > 0) {
    tooltipStats.push({ label: "Focus Boost", value: `+${itemDefinition.focus}% (IRL Scaling)`, color: "text-purple-300" });
  }
  if (itemDefinition.endurance && itemDefinition.endurance > 0) {
    tooltipStats.push({ label: "Endurance Boost", value: `+${itemDefinition.endurance}% (IRL Scaling)`, color: "text-emerald-300" });
  }
  if (itemDefinition.recovery && itemDefinition.recovery > 0) {
    tooltipStats.push({ label: "Recovery Boost", value: `+${itemDefinition.recovery}% (IRL Scaling)`, color: "text-pink-300", icon: Heart });
  }

  return (
    <SystemTooltip
      title={itemDefinition.name}
      subtitle={`${itemDefinition.type} Tier • ${itemDefinition.rarity}`}
      category={itemDefinition.type}
      rarity={itemDefinition.rarity as any}
      description={itemDefinition.description || "A crafted armament forged from gate materials."}
      lore={itemDefinition.lore || `Forged in the ascension armory to amplify the hunter's kinetic prowess.`}
      mechanics="Attribute bonuses scale as percentage multipliers (% Multipliers) of your real-world base stats. Flat values provide raw attack and defense."
      stats={tooltipStats}
      tags={[itemDefinition.type, itemDefinition.rarity, "Gear"]}
      delayMs={1000}
      className="w-full h-full"
    >
      <div 
        onClick={onClick}
        className={`w-full relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between min-h-[140px] text-center bg-[#151C33] ${rarityStyle} ${bgStyle}`}
      >
        {/* Top Indicators */}
        <div className="absolute top-2 left-2 flex gap-1 text-sm z-10">
          {isFavorite && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
          {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
        </div>
        
        {isEquipped && (
          <div className="absolute top-2 right-2 text-[10px] font-bold text-green-400 bg-green-400/20 px-1.5 py-0.5 rounded uppercase tracking-widest z-10">
            EQP
          </div>
        )}

        {/* Icon */}
        <div className="relative w-16 h-16 mt-4 p-1">
          <Image 
            src={getItemIconPath(itemDefinition.name)} 
            alt={itemDefinition.name} 
            fill
            className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          />
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
    </SystemTooltip>
  );
};
