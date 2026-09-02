"use client";

import React from "react";
import Image from "next/image";
import { PlayerItem, ItemType } from "../types/inventory";
import { CHARACTER_AVATAR_PREVIEW } from "@/utils/sprites";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { EquippedBeastDisplay } from "@/features/beasts/components/EquippedBeastDisplay";
import { SystemTooltip, SystemTooltipStat } from "@/components/ui/SystemTooltip";

/* =====================================================================
   AUTHENTIC 8-BIT PIXEL EQUIPMENT ICONS
   ===================================================================== */

/* 1. Pixel Armor / Shirt Icon (16x16) */
export function PixelArmorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="2" width="2" height="1" />
      <rect x="9" y="2" width="2" height="1" />
      <rect x="7" y="3" width="2" height="1" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="2" y="5" width="2" height="3" />
      <rect x="12" y="5" width="2" height="3" />
      <rect x="4" y="4" width="8" height="2" />
      <rect x="4" y="6" width="8" height="6" />
      <rect x="3" y="12" width="10" height="1" />
    </svg>
  );
}

/* 2. Pixel Gem / Necklace Icon (16x16) */
export function PixelGemIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="3" width="6" height="1" />
      <rect x="3" y="4" width="2" height="2" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="5" y="4" width="6" height="2" />
      <rect x="2" y="6" width="12" height="1" />
      <rect x="3" y="7" width="10" height="2" />
      <rect x="4" y="9" width="8" height="2" />
      <rect x="6" y="11" width="4" height="2" />
      <rect x="7" y="13" width="2" height="1" />
    </svg>
  );
}

/* 3. Pixel Boots / Footwear Icon (16x16) */
export function PixelBootsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left Boot */}
      <rect x="2" y="3" width="4" height="6" />
      <rect x="1" y="9" width="6" height="3" />
      <rect x="0" y="12" width="7" height="2" />
      {/* Right Boot */}
      <rect x="10" y="3" width="4" height="6" />
      <rect x="9" y="9" width="6" height="3" />
      <rect x="9" y="12" width="7" height="2" />
    </svg>
  );
}

/* 4. Pixel Artifact / Hexagon Rune Icon (16x16) */
export function PixelArtifactIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="2" width="6" height="1" />
      <rect x="3" y="3" width="2" height="1" />
      <rect x="11" y="3" width="2" height="1" />
      <rect x="2" y="4" width="1" height="2" />
      <rect x="13" y="4" width="1" height="2" />
      <rect x="1" y="6" width="1" height="4" />
      <rect x="14" y="6" width="1" height="4" />
      <rect x="2" y="10" width="1" height="2" />
      <rect x="13" y="10" width="1" height="2" />
      <rect x="3" y="12" width="2" height="1" />
      <rect x="11" y="12" width="2" height="1" />
      <rect x="5" y="13" width="6" height="1" />
      <rect x="7" y="7" width="2" height="2" />
    </svg>
  );
}

/* 5. Pixel Helmet Icon (16x16) */
export function PixelHelmetIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="2" width="6" height="2" />
      <rect x="3" y="4" width="10" height="2" />
      <rect x="2" y="6" width="12" height="3" />
      <rect x="2" y="9" width="3" height="1" />
      <rect x="11" y="9" width="3" height="1" />
      <rect x="2" y="10" width="4" height="3" />
      <rect x="10" y="10" width="4" height="3" />
      <rect x="6" y="12" width="4" height="1" />
    </svg>
  );
}

/* 6. Pixel Sword Icon (16x16) */
export function PixelSwordIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="13" y="1" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="10" y="4" width="3" height="3" />
      <rect x="8" y="6" width="3" height="3" />
      <rect x="6" y="8" width="3" height="3" />
      <rect x="4" y="9" width="2" height="2" />
      <rect x="9" y="4" width="2" height="2" />
      <rect x="3" y="10" width="4" height="2" />
      <rect x="8" y="5" width="2" height="4" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="1" y="13" width="2" height="2" />
    </svg>
  );
}

/* 7. Pixel Shield Icon (16x16) */
export function PixelShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="12" height="2" />
      <rect x="2" y="4" width="12" height="4" />
      <rect x="3" y="8" width="10" height="3" />
      <rect x="5" y="11" width="6" height="2" />
      <rect x="7" y="13" width="2" height="2" />
    </svg>
  );
}

/* 8. Pixel Ring Icon (16x16) */
export function PixelRingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="4" height="1" />
      <rect x="4" y="4" width="8" height="2" />
      <rect x="3" y="6" width="3" height="4" />
      <rect x="10" y="6" width="3" height="4" />
      <rect x="4" y="10" width="8" height="2" />
      <rect x="5" y="12" width="6" height="2" />
    </svg>
  );
}

/* 9. Pixel Relic / Hammer Icon (16x16) */
export function PixelRelicIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="12" height="5" />
      <rect x="1" y="3" width="1" height="3" />
      <rect x="14" y="3" width="1" height="3" />
      <rect x="7" y="7" width="2" height="7" />
      <rect x="6" y="14" width="4" height="1" />
    </svg>
  );
}

interface PaperDollProps {
  equippedItems: PlayerItem[];
}

const SLOT_ICONS: Record<string, React.ElementType> = {
  WEAPON: PixelSwordIcon,
  HELMET: PixelHelmetIcon,
  ARMOR: PixelArmorIcon,
  GLOVES: PixelShieldIcon,
  BOOTS: PixelBootsIcon,
  RING: PixelRingIcon,
  NECKLACE: PixelGemIcon,
  ARTIFACT: PixelArtifactIcon,
  RELIC: PixelRelicIcon,
};

const RARITY_BORDERS: Record<string, string> = {
  COMMON: "border-[#4a2673] bg-[#1a0e2e]",
  RARE: "border-[#0ea5e9] bg-[#0c2338]",
  EPIC: "border-[#a855f7] bg-[#290d45]",
  LEGENDARY: "border-[#f59e0b] bg-[#361f06]",
  MYTHIC: "border-[#ef4444] bg-[#3b0811]",
};

export const PaperDoll: React.FC<PaperDollProps> = ({ equippedItems = [] }) => {
  const { collection } = useBeastStore();
  const equippedBeast = collection?.equippedBeast || null;

  const getItemForSlot = (slot: string) => {
    return (equippedItems || []).find((item) => item?.itemDefinition?.type === slot);
  };

  const renderSlot = (slotType: ItemType, label: string) => {
    const item = getItemForSlot(slotType);
    const Icon = SLOT_ICONS[slotType] || PixelArtifactIcon;

    const slotStyle = item
      ? RARITY_BORDERS[item.itemDefinition.rarity] || RARITY_BORDERS.COMMON
      : "border-[#3b1861] bg-[#180c2c] hover:border-[#22c55e]";

    const tooltipStats: SystemTooltipStat[] = [];
    if (item?.itemDefinition) {
      const def = item.itemDefinition;
      if (def.attack)
        tooltipStats.push({
          label: "Attack Power",
          value: `+${def.attack} ATK`,
          color: "text-rose-400",
        });
      if (def.defense)
        tooltipStats.push({
          label: "Defense Armor",
          value: `+${def.defense} DEF`,
          color: "text-blue-400",
        });
      if (def.strength)
        tooltipStats.push({
          label: "STR Multiplier",
          value: `+${def.strength}% (IRL Scaling)`,
        });
      if (def.knowledge)
        tooltipStats.push({
          label: "KNW Multiplier",
          value: `+${def.knowledge}% (IRL Scaling)`,
        });
      if (def.discipline)
        tooltipStats.push({
          label: "DIS Multiplier",
          value: `+${def.discipline}% (IRL Scaling)`,
        });
      if (def.focus)
        tooltipStats.push({
          label: "FOC Multiplier",
          value: `+${def.focus}% (IRL Scaling)`,
        });
      if (def.endurance)
        tooltipStats.push({
          label: "END Multiplier",
          value: `+${def.endurance}% (IRL Scaling)`,
        });
      if (def.recovery)
        tooltipStats.push({
          label: "REC Multiplier",
          value: `+${def.recovery}% (IRL Scaling)`,
        });
    }

    return (
      <SystemTooltip
        key={slotType}
        title={item ? item.itemDefinition.name : `${label} Slot`}
        subtitle={
          item
            ? `${item.itemDefinition.rarity} ${item.itemDefinition.type}`
            : "Empty Equipment Socket"
        }
        category={label}
        rarity={(item?.itemDefinition?.rarity as any) || "COMMON"}
        description={
          item
            ? item.itemDefinition.description || "Equipped armament."
            : `No armament currently equipped in your ${label} slot. Forge or acquire gear in the Shop and Tower.`
        }
        lore={
          item?.itemDefinition?.lore ||
          `Socketed armaments amplify your kinetic attributes into combat prowess.`
        }
        mechanics="Equipped items grant percentage amplifiers (% Multipliers) based on your real-world base stats."
        stats={tooltipStats}
        delayMs={500}
      >
        <div
          className={`w-11 h-11 rounded-xl border-2 ${slotStyle} flex flex-col items-center justify-center transition-all duration-200 group relative shadow-[2px_2px_0_0_#000] cursor-pointer hover:scale-105`}
        >
          {item && item.itemDefinition.icon ? (
            <Image
              src={item.itemDefinition.icon.replace("client/public", "")}
              alt={item.itemDefinition.name}
              fill
              className="object-contain p-1.5"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <Icon className="w-5 h-5 text-purple-300/60 group-hover:text-white transition-colors" />
          )}
        </div>
      </SystemTooltip>
    );
  };

  return (
    <div className="relative flex justify-center items-center h-[290px] w-full max-w-xs mx-auto mb-2">
      {/* Left 4 Sockets */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2 z-10">
        {renderSlot("HELMET", "Helmet")}
        {renderSlot("WEAPON", "Weapon")}
        {renderSlot("GLOVES", "Gloves")}
        {renderSlot("RING", "Ring")}
      </div>

      {/* Center 8-Bit Capsule Viewport */}
      <div className="w-[170px] h-[270px] bg-[#2B1848]/90 border-4 border-[#3B1C63] rounded-[28px] flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.6),0_4px_0_0_#000] relative overflow-hidden z-0 group cursor-pointer">
        {/* Capsule reflection */}
        <div className="absolute top-2 left-3 w-8 h-12 bg-white/10 rounded-full blur-[2px] pointer-events-none transform -rotate-12" />

        {/* 8-bit Character Avatar (animates only on hover) */}
        <img
          src={CHARACTER_AVATAR_PREVIEW}
          alt="Character Avatar"
          className="w-36 h-36 object-contain z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:animate-pixel-bob transition-transform"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Floating Equipped Companion in Corner if Active */}
        {equippedBeast && (
          <div className="absolute top-2 right-2 z-20">
            <EquippedBeastDisplay beast={equippedBeast} size="sm" />
          </div>
        )}
      </div>

      {/* Right 4 Sockets */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2 z-10">
        {renderSlot("ARMOR", "Armor")}
        {renderSlot("NECKLACE", "Necklace")}
        {renderSlot("BOOTS", "Boots")}
        {renderSlot("ARTIFACT", "Artifact")}
      </div>

      {/* Bottom Center Socket (Relic) */}
      <div className="absolute -bottom-3 z-20">
        {renderSlot("RELIC", "Relic")}
      </div>
    </div>
  );
};

export default PaperDoll;
