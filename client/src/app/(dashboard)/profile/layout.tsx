"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCharacterStore } from "@/store/useCharacterStore";
import { calculateLevelData } from "@/features/progression/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { CURRENCY_LORE } from "@/features/lore/loreData";
import { CHARACTER_AVATAR_SPRITE } from "@/utils/sprites";
import { playUIMenuSFX } from "@/utils/audio";
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
  Crown,
  Shield,
  Bot,
  Activity,
} from "lucide-react";

import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { character, gainExp } = useCharacterStore();
  const totalExp = character?.exp || 0;
  const levelData = calculateLevelData(totalExp);

  const name = character?.name || "Shadow Monarch";
  const rank = character?.rank || "E";
  const gold = character?.gold ?? 0;
  const gems = character?.gems ?? 0;
  const towerTokens = character?.towerTokens ?? 0;
  const power = character?.power || 50;

  const tabs = [
    {
      name: "Stat Matrix",
      href: "/profile/stats",
      icon: Sliders,
      activeColor: "border-cyan-500 text-cyan-300 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]",
    },
    {
      name: "Skill Tree",
      href: "/profile/skills",
      icon: TreePine,
      badgeText: character?.availableSP ? `${character.availableSP} SP` : character?.specialization?.name || undefined,
      badgeColor: character?.availableSP ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-purple-500/20 text-purple-300 border-purple-500/50",
      activeColor: "border-purple-500 text-purple-300 bg-purple-950/60 shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    },
    {
      name: "Customization",
      href: "/profile/customize",
      icon: Palette,
      activeColor: "border-indigo-500 text-indigo-300 bg-indigo-950/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]",
    },
    {
      name: "Chronicles",
      href: "/profile/history",
      icon: History,
      activeColor: "border-amber-500 text-amber-300 bg-amber-950/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    },
  ];

  return (
    <div suppressHydrationWarning className="space-y-6 pb-12 font-sans animate-in fade-in duration-300 relative">
      {/* Background Floating Runes & Particle Field */}
      <FloatingRuneField density="low" className="opacity-60" />

      {/* ========================================================= */}
      {/* HERO & CORE IDENTITY HUD HEADER */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1126]/95 via-[#070D1E]/95 to-[#040814]/98 border border-cyan-500/20 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Floating Runes & Ambient Particles inside Hero */}
        <FloatingRuneField density="high" />

        {/* Animated Cyber Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
        
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Subtle Runes & Grid Overlay */}
        <div className="absolute inset-0 bg-repeating-linear-gradient pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(6,182,212,0.02) 3px, rgba(6,182,212,0.02) 6px)' }} />
        <span className="rune-static text-cyan-400/15" style={{ top: '12%', right: '18%', fontSize: '14px' }}>ᚦ</span>
        <span className="rune-static text-purple-400/15" style={{ bottom: '15%', right: '35%', fontSize: '12px' }}>ᛗ</span>

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          {/* LEFT: AVATAR, IDENTITY & ATTRIBUTE SUMMARY */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
            
            {/* Holographic Avatar Frame */}
            <div className="relative shrink-0 group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#0f1738] to-[#080d22] border-2 border-cyan-500/40 flex items-center justify-center p-1.5 shadow-[0_0_30px_rgba(6,182,212,0.25)] group-hover:border-cyan-400/70 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-400 relative overflow-hidden">
                {/* Background Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/60 to-transparent pointer-events-none" />
                
                <img
                  src={character?.avatar || CHARACTER_AVATAR_SPRITE}
                  alt={name}
                  onError={(e) => {
                    e.currentTarget.src = CHARACTER_AVATAR_SPRITE;
                  }}
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-500"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              {/* LVL Stepper Badge */}
              <motion.div
                key={`lvl-${levelData.currentLevel}`}
                initial={{ scale: 1.25, color: "#67e8f9" }}
                animate={{ scale: 1, color: "#FFFFFF" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white text-[11px] font-mono font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.6)] whitespace-nowrap"
              >
                LVL {levelData.currentLevel}
              </motion.div>
            </div>

            {/* Identity & Rank Details */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] truncate">
                  {name}
                </h1>

                {/* Rank Badge */}
                <span className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/60 text-purple-300 font-mono text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  <span>{rank}-Rank Sovereign</span>
                </span>

                {/* Available Skill Points for Skill Tree */}
                {character?.availableSP && character.availableSP > 0 ? (
                  <Link href="/profile/skills">
                    <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 font-mono font-bold text-xs uppercase px-2.5 py-1 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5 hover:bg-amber-500/30 transition-all cursor-pointer">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{character.availableSP} SP READY FOR SKILL TREE</span>
                    </Badge>
                  </Link>
                ) : null}
              </div>

              {/* Title & Specialization Class */}
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold bg-purple-950/30 border border-purple-500/20 px-2.5 py-0.5 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 glow-purple" />
                  <span>{character?.title || "Shadow Seeker"}</span>
                </div>

                {character?.specialization ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Awakened Class: {character.specialization.name}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 font-mono text-[11px]">
                    Unawakened Novice
                  </span>
                )}
              </div>

              {/* Live Currencies & Power Score Hub */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
                {/* Gold */}
                <SystemTooltip
                  title={CURRENCY_LORE.gold.name}
                  category={CURRENCY_LORE.gold.category}
                  rarity={CURRENCY_LORE.gold.rarity}
                  description={CURRENCY_LORE.gold.description}
                  lore={CURRENCY_LORE.gold.lore}
                  mechanics={CURRENCY_LORE.gold.mechanics}
                  stats={[
                    { label: "Your Balance", value: `${gold.toLocaleString()} Gold`, color: "text-amber-400" },
                    { label: "Asset Type", value: "Primary Economy" }
                  ]}
                  tags={CURRENCY_LORE.gold.tags}
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/25 border border-amber-500/25 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-help">
                    <CurrencyIcon type="GOLD" size="xs" />
                    <span className="text-amber-300 font-bold">{gold.toLocaleString()}g</span>
                  </div>
                </SystemTooltip>

                {/* Gems */}
                <SystemTooltip
                  title={CURRENCY_LORE.gems.name}
                  category={CURRENCY_LORE.gems.category}
                  rarity={CURRENCY_LORE.gems.rarity}
                  description={CURRENCY_LORE.gems.description}
                  lore={CURRENCY_LORE.gems.lore}
                  mechanics={CURRENCY_LORE.gems.mechanics}
                  stats={[
                    { label: "Your Balance", value: `${gems.toLocaleString()} Gems`, color: "text-cyan-400" },
                    { label: "Asset Type", value: "Astral Premium" }
                  ]}
                  tags={CURRENCY_LORE.gems.tags}
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/25 border border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-help">
                    <CurrencyIcon type="GEMS" size="xs" />
                    <span className="text-cyan-300 font-bold">{gems.toLocaleString()}</span>
                  </div>
                </SystemTooltip>

                {/* Tower Tokens */}
                <SystemTooltip
                  title={CURRENCY_LORE.towerTokens.name}
                  category={CURRENCY_LORE.towerTokens.category}
                  rarity={CURRENCY_LORE.towerTokens.rarity}
                  description={CURRENCY_LORE.towerTokens.description}
                  lore={CURRENCY_LORE.towerTokens.lore}
                  mechanics={CURRENCY_LORE.towerTokens.mechanics}
                  stats={[
                    { label: "Your Balance", value: `${towerTokens.toLocaleString()} Tokens`, color: "text-indigo-400" },
                    { label: "Asset Type", value: "Dimensional Sigils" }
                  ]}
                  tags={CURRENCY_LORE.towerTokens.tags}
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/25 border border-indigo-500/25 hover:border-indigo-400/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all cursor-help">
                    <CurrencyIcon type="TOWER_TOKENS" size="xs" />
                    <span className="text-indigo-300 font-bold">{towerTokens.toLocaleString()}</span>
                  </div>
                </SystemTooltip>

                {/* Power Score */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider">POWER:</span>
                  <span className="text-cyan-200 font-bold font-mono animate-number-glow">{power.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: AIRA SYSTEM DIAGNOSTIC PANEL & QUICK ACTION */}
          <div className="w-full xl:w-auto flex flex-col sm:flex-row items-stretch xl:items-center gap-3">
            {/* AIRA Live Status Pill */}
            <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-br from-[#091024]/90 to-[#0c1636]/90 border border-cyan-500/25 flex items-center gap-3 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0 animate-energy-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">AIRA ARCHIVE LINK</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs text-slate-300 truncate max-w-[200px]">
                  All biometric & combat telemetry nominal.
                </div>
              </div>
            </div>

            {/* Quick Training Simulation Button */}
            <Button
              onClick={() => {
                gainExp(150, "Completed Training Simulation");
                playUIMenuSFX();
              }}
              variant="default"
              className="h-12 px-5 rounded-2xl font-bold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all active:scale-[0.97]"
            >
              <Zap className="w-4 h-4 mr-2 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Simulate (+150 EXP)</span>
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EXP PROGRESSION BAR WITH ANIMATED STAR ICON */}
        {/* ========================================================= */}
        <div className="mt-6 pt-5 border-t border-cyan-500/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <CurrencyIcon type="EXP" size="sm" />
              <span>Level {levelData.currentLevel} Progression</span>
            </span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <strong className="text-cyan-300 font-bold">{levelData.currentExpInLevel.toLocaleString()}</strong>
              <span>/</span>
              <span>{levelData.expToNextLevel.toLocaleString()} EXP</span>
              <span className="text-purple-300 font-bold ml-1">({levelData.progressPercentage}%)</span>
            </span>
          </div>

          <div className="w-full h-3 bg-[#080D20] rounded-full border border-cyan-500/20 p-0.5 relative overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] bar-shimmer"
              initial={false}
              animate={{ width: `${levelData.progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SUB-ROUTES NAVIGATION TABS */}
        {/* ========================================================= */}
        <div className="mt-6 pt-4 border-t border-cyan-500/10 flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = pathname === t.href || (pathname === "/profile" && t.href === "/profile/stats");
            return (
              <Link key={t.href} href={t.href} onClick={() => playUIMenuSFX()}>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${t.activeColor} border-2`
                      : "border border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-500"}`} />
                  <span>{t.name}</span>
                  {t.badgeText && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${t.badgeColor || "bg-slate-800 text-slate-300"}`}>
                      {t.badgeText}
                    </span>
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SUB-ROUTE CONTENT CONTAINER */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

