"use client";

import React from "react";
import {
  Shield,
  Swords,
  Crown,
  Shirt,
  Sparkles,
  Zap,
  Gem,
  Compass,
  Flame,
  MinusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EquipmentSlot, InventoryRecord } from "../types";
import { calculateTotalCombatStats } from "../utils/combatStatCalculator";
import dynamic from "next/dynamic";
import type { RadarDataPoint } from "@/components/ui/StatRadarChart";

const StatRadarChart = dynamic(
  () => import("@/components/ui/StatRadarChart").then((mod) => mod.StatRadarChart),
  { ssr: false }
);

interface EquipmentPanelProps {
  equippedItems: InventoryRecord[];
  onUnequip: (record: InventoryRecord) => void;
  characterStats?: Record<string, number>;
}

const SLOT_CONFIG: Array<{
  slot: EquipmentSlot;
  label: string;
  icon: React.ElementType;
}> = [
  { slot: "Helmet", label: "Helmet", icon: Crown },
  { slot: "Necklace", label: "Necklace", icon: Gem },
  { slot: "Armor", label: "Armor", icon: Shirt },
  { slot: "Weapon", label: "Weapon", icon: Swords },
  { slot: "Gloves", label: "Gloves", icon: Shield },
  { slot: "Ring", label: "Ring", icon: Gem },
  { slot: "Boots", label: "Boots", icon: Compass },
  { slot: "Artifact", label: "Artifact", icon: Sparkles },
  { slot: "Relic", label: "Relic", icon: Flame },
];

export function EquipmentPanel({
  equippedItems,
  onUnequip,
  characterStats = {},
}: EquipmentPanelProps) {
  // Map equipped items by slot
  const slotMap = new Map<EquipmentSlot, InventoryRecord>();
  equippedItems.forEach((rec) => {
    const slot = rec.item?.equipment?.slot;
    if (slot) slotMap.set(slot, rec);
  });

  // Calculate total combat stats
  const equipmentDetails = equippedItems
    .map((rec) => rec.item?.equipment)
    .filter(Boolean) as any[];

  const totalCombatStats = calculateTotalCombatStats(characterStats, equipmentDetails);

  return (
    <Card className="bg-[#151C33] border-slate-800 shadow-xl overflow-hidden">
      <CardHeader className="p-4 px-5 border-b border-slate-800 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <CardTitle className="text-base font-bold text-slate-100 font-heading">
            Equipped Gear Matrix
          </CardTitle>
        </div>

        <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/30 font-mono">
          {equippedItems.length} / 9 Equipped
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Total Equipment Stat Summary Banner & Radar Graph */}
        <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Total Combined Combat Stats
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30">
              GEAR BOOSTED
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="text-amber-400 font-bold">ATK: {totalCombatStats.attack}</div>
            <div className="text-blue-400 font-bold">DEF: {totalCombatStats.defense}</div>
            <div className="text-emerald-400 font-bold">HP: {totalCombatStats.hp}</div>
            <div className="text-slate-300">STR: {totalCombatStats.strength}</div>
            <div className="text-slate-300">KNO: {totalCombatStats.knowledge}</div>
            <div className="text-slate-300">REC: {totalCombatStats.recovery}</div>
            <div className="text-slate-300">FOC: {totalCombatStats.focus}</div>
            <div className="text-slate-300">DIS: {totalCombatStats.discipline}</div>
            <div className="text-slate-300">END: {totalCombatStats.endurance}</div>
          </div>

          {/* Interactive Stat Comparison Radar Chart */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 text-center mb-1">
              Base vs. Total Equipped Stat Breakdown
            </div>
            <StatRadarChart
              data={[
                { subject: "ATK", value: 10, secondaryValue: totalCombatStats.attack },
                { subject: "DEF", value: 10, secondaryValue: totalCombatStats.defense },
                { subject: "HP", value: Math.round((characterStats.endurance || 1) * 10), secondaryValue: Math.round(totalCombatStats.hp / 10) },
                { subject: "STR", value: characterStats.strength || 1, secondaryValue: totalCombatStats.strength },
                { subject: "KNO", value: characterStats.knowledge || 1, secondaryValue: totalCombatStats.knowledge },
                { subject: "REC", value: characterStats.recovery || 1, secondaryValue: totalCombatStats.recovery },
                { subject: "FOC", value: characterStats.focus || 1, secondaryValue: totalCombatStats.focus },
                { subject: "DIS", value: characterStats.discipline || 1, secondaryValue: totalCombatStats.discipline },
                { subject: "END", value: characterStats.endurance || 1, secondaryValue: totalCombatStats.endurance },
              ]}
              primaryName="Base Stat"
              secondaryName="Total Modified"
              primaryColor="#3B82F6"
              secondaryColor="#A855F7"
              height={260}
              showLegend={true}
            />
          </div>
        </div>

        {/* 9 Equipment Paper Doll Slots Grid */}
        <div className="grid grid-cols-3 gap-3">
          {SLOT_CONFIG.map(({ slot, label, icon: Icon }) => {
            const record = slotMap.get(slot);
            const item = record?.item;
            const equipment = item?.equipment;

            return (
              <div
                key={slot}
                className={`relative p-3 rounded-xl border transition-all min-h-[110px] flex flex-col justify-between ${
                  record
                    ? "bg-slate-900/80 border-blue-500/40 shadow-blue-950/20 shadow-md"
                    : "border-dashed border-slate-800 bg-slate-950/40 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 flex items-center gap-1">
                    <Icon className="w-3 h-3 text-slate-400" /> {label}
                  </span>

                  {record && (
                    <button
                      onClick={() => onUnequip(record)}
                      title="Unequip"
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {record ? (
                  <div className="mt-1 space-y-1">
                    <p className="text-xs font-bold text-slate-100 line-clamp-1">
                      {item?.name || "Equipped Item"}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                      {equipment?.attack ? (
                        <span className="text-amber-400">+{equipment.attack} ATK</span>
                      ) : equipment?.defense ? (
                        <span className="text-blue-400">+{equipment.defense} DEF</span>
                      ) : (
                        <span className="text-emerald-400">+{equipment?.hp || 0} HP</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center py-2">
                    <span className="text-[10px] text-slate-600 font-mono">Empty Slot</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
