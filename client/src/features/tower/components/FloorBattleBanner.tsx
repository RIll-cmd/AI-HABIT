"use client";

import React from "react";
import { getEnemySpriteUrl } from "@/utils/spriteUtils";
import { CHARACTER_AVATAR_PREVIEW } from "@/utils/sprites";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { getEnemyLore } from "@/features/lore/loreData";

interface FloorBattleBannerProps {
  playerName?: string;
  playerPower?: number;
  enemyName: string;
  enemyLevel: number;
  floorNumber: number;
  isBoss?: boolean;
}

export function FloorBattleBanner({
  playerName = "Player",
  playerPower = 0,
  enemyName,
  enemyLevel,
  floorNumber,
  isBoss = false,
}: FloorBattleBannerProps) {
  const spriteUrl = getEnemySpriteUrl(enemyName, { floorOrLevel: floorNumber, isBoss });
  const enemyLore = getEnemyLore(enemyName, floorNumber, isBoss);

  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#151C33] to-red-950/60 border border-indigo-500/30 overflow-visible flex items-center justify-between shadow-inner min-h-[140px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-2xl" />

      {/* Player Side (Left) */}
      <div className="flex flex-col items-center gap-1 relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-indigo-950/60 border border-cyan-500/40 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] overflow-hidden">
          <img
            src={CHARACTER_AVATAR_PREVIEW}
            alt={playerName}
            onError={(e) => { e.currentTarget.src = CHARACTER_AVATAR_PREVIEW; }}
            className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
        <span className="text-xs font-bold text-cyan-300 font-mono mt-1">{playerName}</span>
        <span className="text-[10px] text-slate-400 font-mono">Pwr: <span className="text-amber-400 font-bold">{playerPower}</span></span>
      </div>

      {/* VS Center Badge */}
      <div className="flex flex-col items-center justify-center relative z-10 px-2">
        <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 font-black font-mono text-sm tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
          VS
        </div>
        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">FACE OFF</span>
      </div>

      {/* Enemy Side (Right) */}
      <div className="relative z-10">
        <SystemTooltip
          title={enemyLore.name}
          subtitle={`Floor ${floorNumber} • Level ${enemyLevel}`}
          category={enemyLore.category}
          rarity={enemyLore.rarity}
          description={enemyLore.description}
          lore={enemyLore.lore}
          mechanics={`⚡ Weakness & Tactics: ${enemyLore.weakness}`}
          stats={[
            { label: "Level", value: `Lv. ${enemyLevel}` },
            { label: "Threat Rating", value: enemyLore.threatLevel, color: isBoss ? "text-red-400" : "text-cyan-400" }
          ]}
          tags={["Tower", "Combat", isBoss ? "Boss" : "Enemy"]}
        >
          <div className="flex flex-col items-center gap-1 cursor-help group">
            <div className="w-20 h-20 rounded-2xl bg-slate-900/50 border border-red-500/30 group-hover:border-red-400/60 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)] overflow-hidden transition-colors">
              <img
                src={spriteUrl}
                alt={enemyName}
                onError={(e) => {
                  const fallbackStatic = `/sprites/static/${enemyName.toLowerCase().split(' ')[0]}.png`;
                  if (e.currentTarget.src !== fallbackStatic) {
                    e.currentTarget.src = fallbackStatic;
                  } else {
                    e.currentTarget.src = "/sprites/static/slime.png";
                  }
                }}
                className="w-16 h-16 object-contain transform -scale-x-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <span className="text-xs font-bold text-red-400 font-mono mt-1 text-center truncate max-w-[120px]">{enemyName}</span>
            <span className="text-[10px] text-slate-400 font-mono">Lv. <span className="text-red-300 font-bold">{enemyLevel}</span></span>
          </div>
        </SystemTooltip>
      </div>
    </div>
  );
}
