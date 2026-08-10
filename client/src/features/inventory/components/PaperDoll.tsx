import React from 'react';
import Image from 'next/image';
import { PlayerItem } from '../types/inventory';
import { ItemType } from '../types/inventory';
import { 
  Sword, 
  Shield, 
  Circle, 
  Shirt, 
  Footprints, 
  Gem, 
  Target, 
  Axe, 
  Hexagon,
} from 'lucide-react';
import { CHARACTER_AVATAR_PREVIEW } from '@/utils/sprites';

interface PaperDollProps {
  equippedItems: PlayerItem[];
}

const SLOT_ICONS: Record<string, React.ElementType> = {
  WEAPON: Sword,
  HELMET: Target,
  ARMOR: Shirt,
  GLOVES: Shield,
  BOOTS: Footprints,
  RING: Circle,
  NECKLACE: Gem,
  ARTIFACT: Hexagon,
  RELIC: Axe,
};

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'border-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.15)]',
  RARE: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  EPIC: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  LEGENDARY: 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
  MYTHIC: 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
};

export const PaperDoll: React.FC<PaperDollProps> = ({ equippedItems }) => {
  const getItemForSlot = (slot: string) => {
    return equippedItems.find(item => item.itemDefinition.type === slot);
  };

  const renderSlot = (slotType: ItemType, label: string) => {
    const item = getItemForSlot(slotType);
    const Icon = SLOT_ICONS[slotType] || Circle;
    
    const borderColor = item 
      ? (RARITY_COLORS[item.itemDefinition.rarity] || RARITY_COLORS.COMMON) 
      : 'border-purple-500/20';
      
    const bgOpacity = item ? 'bg-[#151C33]/90' : 'bg-[#151C33]/40';

    return (
      <div 
        key={slotType}
        className={`w-14 h-14 rounded-xl ${bgOpacity} border ${borderColor} flex flex-col items-center justify-center transition-all group relative`}
        title={item ? item.itemDefinition.name : `Empty ${label} Slot`}
      >
        {item && item.itemDefinition.icon ? (
          <Image 
            src={item.itemDefinition.icon.replace('client/public', '')} 
            alt={item.itemDefinition.name} 
            fill
            className="object-contain p-1.5 drop-shadow-md"
          />
        ) : (
          <Icon className="w-5 h-5 text-slate-600/60" />
        )}
      </div>
    );
  };

  return (
    <div className="relative flex justify-center items-center h-[340px] w-full max-w-sm mx-auto mb-4">
      {/* Left Slots */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2 z-10">
        {renderSlot('HELMET', 'Helmet')}
        {renderSlot('WEAPON', 'Weapon')}
        {renderSlot('GLOVES', 'Gloves')}
        {renderSlot('RING', 'Ring')}
      </div>

      {/* Center Portrait */}
      <div className="w-[190px] h-[310px] bg-gradient-to-t from-[#151C33] to-[#0B1020] border-2 border-purple-900/50 rounded-[30px] flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
        <img
          src={CHARACTER_AVATAR_PREVIEW}
          alt="Character Avatar"
          className="w-44 h-44 object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.4)] z-10"
          style={{ imageRendering: "pixelated" }}
        />
        
        {/* Ground Magic Circle effect */}
        <div className="absolute -bottom-8 w-56 h-20 border-2 border-purple-500/20 rounded-[100%] transform rotate-x-60 animate-pulse pointer-events-none shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
      </div>

      {/* Right Slots */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2 z-10">
        {renderSlot('ARMOR', 'Armor')}
        {renderSlot('NECKLACE', 'Necklace')}
        {renderSlot('BOOTS', 'Boots')}
        {renderSlot('ARTIFACT', 'Artifact')}
      </div>

      {/* Bottom Center Slot */}
      <div className="absolute -bottom-4 z-20">
        {renderSlot('RELIC', 'Relic')}
      </div>
    </div>
  );
};
