"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { calculateLevelData } from "@/features/progression/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Swords,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  Sliders,
  TreePine,
  Palette,
  History,
  ShieldAlert,
} from "lucide-react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { character, gainExp } = useCharacterStore();
  const totalExp = character?.exp || 0;
  const levelData = calculateLevelData(totalExp);

  const tabs = [
    {
      name: "Stat Matrix",
      href: "/profile/stats",
      icon: Sliders,
      activeColor: "border-blue-500 text-blue-400 bg-blue-950/40",
    },
    {
      name: "Skill Tree",
      href: "/profile/skills",
      icon: TreePine,
      activeColor: "border-cyan-500 text-cyan-400 bg-cyan-950/40",
    },
    {
      name: "Customization",
      href: "/profile/customize",
      icon: Palette,
      activeColor: "border-purple-500 text-purple-400 bg-purple-950/40",
    },
    {
      name: "Chronicles",
      href: "/profile/history",
      icon: History,
      activeColor: "border-amber-500 text-amber-400 bg-amber-950/40",
    },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans animate-in fade-in duration-300">
      {/* HERO & CORE IDENTITY HUD HEADER */}
      <div className="relative rounded-[24px] bg-[#151C33] border border-white/10 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Character Info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-[22px] border-2 border-blue-500/40 shadow-xl shadow-blue-500/20">
                <AvatarImage
                  src={character?.avatar || "/Character_sprite_placeholder/walk_down.gif"}
                  alt={character?.name || "Shadow Monarch"}
                  className="object-contain p-1"
                />
                <AvatarFallback className="rounded-[22px] bg-gradient-to-br from-blue-600 to-indigo-900 text-white font-bold text-xl font-heading">
                  {character?.name ? character.name.substring(0, 2).toUpperCase() : "SM"}
                </AvatarFallback>
              </Avatar>

              <motion.div
                key={`lvl-${levelData.currentLevel}`}
                initial={{ scale: 1.35, color: "#60A5FA" }}
                animate={{ scale: 1, color: "#FFFFFF" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-[10px] bg-blue-600 text-white text-[10px] font-mono font-bold border border-blue-400 shadow-md"
              >
                LVL {levelData.currentLevel}
              </motion.div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
                  {character?.name || "Shadow Monarch"}
                </h1>

                <span className="px-3 py-1 rounded-[12px] bg-purple-950/80 border border-purple-500/60 text-purple-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  Rank {character?.rank || "F"}
                </span>

                {character?.availableSP ? (
                  <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                    ⚡ {character.availableSP} SP UNALLOCATED
                  </Badge>
                ) : null}
              </div>

              <p className="text-xs text-blue-400 font-medium font-sans flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {character?.title || "Hydration Monarch"}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>
                  Gold: <strong className="text-amber-400 font-bold">{character?.gold ?? 0}g</strong>
                </span>
                <span>•</span>
                <span>
                  Gems: <strong className="text-purple-400 font-bold">{character?.gems ?? 0}</strong>
                </span>
                <span>•</span>
                <span>
                  Power: <strong className="text-cyan-400 font-bold">⚡ {character?.power || 50}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Training Simulation Action */}
          <div className="w-full md:w-auto p-4 rounded-[20px] bg-[#0B1020]/90 border border-blue-500/30 flex items-center justify-between md:justify-end gap-4 shadow-inner">
            <Button
              onClick={() => gainExp(150, "Completed Training Simulation")}
              variant="default"
              size="sm"
              className="w-full font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/30"
            >
              <Zap className="w-4 h-4 mr-1.5 text-amber-300 fill-amber-300" />
              Simulate (+150 EXP)
            </Button>
          </div>
        </div>

        {/* EXP Progression Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Level {levelData.currentLevel} Progress
            </span>
            <span className="text-slate-400">
              <strong className="text-blue-400 font-bold">{levelData.currentExpInLevel}</strong> / {levelData.expToNextLevel} EXP ({levelData.progressPercentage}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#0B1020] rounded-full border border-white/10 p-0.5 relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              initial={false}
              animate={{ width: `${levelData.progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
            />
          </div>
        </div>

        {/* Sub-Routes Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = pathname === t.href || (pathname === "/profile" && t.href === "/profile/stats");
            return (
              <Link key={t.href} href={t.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`font-mono text-xs font-bold transition-all ${
                    isActive
                      ? `${t.activeColor} border-2 shadow-lg`
                      : "border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {t.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SUB-ROUTE CONTENT CONTAINER */}
      <div>{children}</div>
    </div>
  );
}
