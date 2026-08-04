"use client";

import React from "react";
import { Shield, Swords, Sparkles, Zap, Heart, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryRecord, ItemRarity } from "../types";

interface ItemCardProps {
  record: InventoryRecord;
  onEquip?: (record: InventoryRecord) => void;
  onUnequip?: (record: InventoryRecord) => void;
  isCompact?: boolean;
}

export const RARITY_STYLES: Record<
  ItemRarity,
  { cardBorder: string; badgeBg: string; text: string; glow: string }
> = {
  Common: {
    cardBorder: "border-slate-700/80 bg-slate-900/60",
    badgeBg: "bg-slate-800 text-slate-300 border-slate-700",
    text: "text-slate-200",
    glow: "",
  },
  Uncommon: {
    cardBorder: "border-emerald-500/40 bg-emerald-950/20",
    badgeBg: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
    text: "text-emerald-300",
    glow: "shadow-emerald-950/30",
  },
  Rare: {
    cardBorder: "border-blue-500/40 bg-blue-950/20",
    badgeBg: "bg-blue-950 text-blue-300 border-blue-500/40",
    text: "text-blue-300",
    glow: "shadow-blue-950/30",
  },
  Epic: {
    cardBorder: "border-purple-500/50 bg-purple-950/20",
    badgeBg: "bg-purple-950 text-purple-300 border-purple-500/50",
    text: "text-purple-300",
    glow: "shadow-purple-950/40",
  },
  Legendary: {
    cardBorder: "border-amber-500/50 bg-amber-950/20",
    badgeBg: "bg-amber-950 text-amber-300 border-amber-500/50",
    text: "text-amber-300",
    glow: "shadow-amber-950/40",
  },
  Mythic: {
    cardBorder: "border-rose-500/50 bg-rose-950/20",
    badgeBg: "bg-rose-950 text-rose-300 border-rose-500/50",
    text: "text-rose-300",
    glow: "shadow-rose-950/40",
  },
  Ancient: {
    cardBorder:
      "border-yellow-400/80 bg-gradient-to-r from-amber-950/40 via-yellow-950/40 to-amber-950/40",
    badgeBg: "bg-yellow-950 text-yellow-300 border-yellow-400/60 font-bold",
    text: "text-yellow-300 font-bold",
    glow: "shadow-yellow-500/20 shadow-md",
  },
};

export function ItemCard({
  record,
  onEquip,
  onUnequip,
  isCompact = false,
}: ItemCardProps) {
  const item = record.item;
  const equipment = item?.equipment;
  const style = RARITY_STYLES[item.rarity] || RARITY_STYLES.Common;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 shadow-md ${style.cardBorder} ${style.glow}`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header Metadata */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className={`text-sm font-bold font-heading ${style.text}`}>
              {item.name}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {item.category} {equipment ? `• ${equipment.slot}` : ""}
            </span>
          </div>

          <Badge variant="outline" className={`text-[10px] ${style.badgeBg}`}>
            {item.rarity}
          </Badge>
        </div>

        {/* Equipment Stat Callouts */}
        {equipment && (
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono text-slate-300">
            {equipment.attack > 0 && (
              <span className="text-amber-400">ATK +{equipment.attack}</span>
            )}
            {equipment.defense > 0 && (
              <span className="text-blue-400">DEF +{equipment.defense}</span>
            )}
            {equipment.hp > 0 && (
              <span className="text-emerald-400">HP +{equipment.hp}</span>
            )}
            {equipment.strength > 0 && <span>STR +{equipment.strength}</span>}
            {equipment.knowledge > 0 && <span>KNO +{equipment.knowledge}</span>}
            {equipment.recovery > 0 && <span>REC +{equipment.recovery}</span>}
            {equipment.focus > 0 && <span>FOC +{equipment.focus}</span>}
            {equipment.discipline > 0 && <span>DIS +{equipment.discipline}</span>}
            {equipment.endurance > 0 && <span>END +{equipment.endurance}</span>}
          </div>
        )}

        {!equipment && (
          <p className="text-[11px] text-slate-400 line-clamp-2 italic">
            {item.description}
          </p>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
          <span className="text-[10px] font-mono text-slate-400">
            Sell: {item.sellPrice}g
          </span>

          {record.isEquipped ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnequip?.(record)}
              className="text-[11px] h-7 px-3 text-rose-300 border-rose-500/40 hover:bg-rose-950/40"
            >
              Unequip
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onEquip?.(record)}
              className="text-[11px] h-7 px-3 bg-blue-600 hover:bg-blue-500 text-white"
            >
              Equip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
