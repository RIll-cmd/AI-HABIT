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
  RARE: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)]',
  EPIC: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)]',
  LEGENDARY: 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.35)]',
  MYTHIC: 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.45)]',
};

const SLOT_RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ'];

export const PaperDoll: React.FC<PaperDollProps> = ({ equippedItems }) => {
  const getItemForSlot = (slot: string) => {
    return equippedItems.find(item => item.itemDefinition.type === slot);
  };

  const renderSlot = (slotType: ItemType, label: string, floatDelay: number) => {
    const item = getItemForSlot(slotType);
    const Icon = SLOT_ICONS[slotType] || Circle;
    
    const borderColor = item 
      ? (RARITY_COLORS[item.itemDefinition.rarity] || RARITY_COLORS.COMMON) 
      : 'border-cyan-500/15 group-hover:border-cyan-500/40 animate-beacon';
      
    const bgOpacity = item ? 'bg-[#0a1024]/90' : 'bg-[#0a1024]/50';

    return (
      <div 
        key={slotType}
        className={`w-14 h-14 rounded-xl ${bgOpacity} border ${borderColor} flex flex-col items-center justify-center transition-all duration-300 group relative shadow-md animate-float-gentle hover:scale-110`}
        style={{ animationDelay: `${floatDelay}s` }}
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
          <Icon className="w-5 h-5 text-slate-600/60 group-hover:text-cyan-400/60 transition-colors" />
        )}
      </div>
    );
  };

  return (
    <div className="relative flex justify-center items-center h-[340px] w-full max-w-sm mx-auto mb-4">
      {/* Floating rune glyphs around the character */}
      <span suppressHydrationWarning className="rune-drift text-cyan-400/20 absolute" style={{ top: '5%', left: '25%', fontSize: '12px', animationDuration: '12s', animationDelay: '0s' }}>ᚠ</span>
      <span suppressHydrationWarning className="rune-drift text-purple-400/15 absolute" style={{ top: '15%', right: '20%', fontSize: '10px', animationDuration: '15s', animationDelay: '3s' }}>ᛞ</span>
      <span suppressHydrationWarning className="rune-drift text-cyan-400/15 absolute" style={{ bottom: '20%', left: '18%', fontSize: '11px', animationDuration: '14s', animationDelay: '6s' }}>ᛟ</span>

      {/* Left Slots */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2 z-10">
        {renderSlot('HELMET', 'Helmet', 0)}
        {renderSlot('WEAPON', 'Weapon', -0.8)}
        {renderSlot('GLOVES', 'Gloves', -1.6)}
        {renderSlot('RING', 'Ring', -2.4)}
      </div>

      {/* Center Portrait */}
      <div className="w-[190px] h-[310px] bg-gradient-to-t from-[#0a1024] via-[#0d1430] to-[#070b1a] border-2 border-cyan-500/25 rounded-[30px] flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden z-0 animate-border-glow group">
        <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay" />
        
        {/* Animated aura rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full border border-cyan-500/10 animate-pulse-glow-intense" />
          <div className="absolute w-48 h-48 rounded-full border border-purple-500/5" style={{ animation: 'pulse-glow-intense 3.5s ease-in-out infinite', animationDelay: '-1s' }} />
        </div>
        
        <img
          src={CHARACTER_AVATAR_PREVIEW}
          alt="Character Avatar"
          className="w-44 h-44 object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] z-10 group-hover:scale-105 transition-transform duration-500"
          style={{ imageRendering: "pixelated" }}
        />
        
        {/* Ground Magic Circle effect — enhanced */}
        <div className="absolute -bottom-8 w-56 h-20 border-2 border-cyan-500/30 rounded-[100%] transform rotate-x-60 pointer-events-none shadow-[0_0_40px_rgba(6,182,212,0.5)] animate-pulse" />
        <div className="absolute -bottom-6 w-48 h-16 border border-cyan-400/15 rounded-[100%] transform rotate-x-60 pointer-events-none" style={{ animation: 'pulse 2.5s ease-in-out infinite', animationDelay: '-1s' }} />
      </div>

      {/* Right Slots */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2 z-10">
        {renderSlot('ARMOR', 'Armor', -0.4)}
        {renderSlot('NECKLACE', 'Necklace', -1.2)}
        {renderSlot('BOOTS', 'Boots', -2.0)}
        {renderSlot('ARTIFACT', 'Artifact', -2.8)}
      </div>

      {/* Bottom Center Slot */}
      <div className="absolute -bottom-4 z-20">
        {renderSlot('RELIC', 'Relic', -3.5)}
      </div>
    </div>
  );
};
