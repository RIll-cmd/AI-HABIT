"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Settings,
  LogOut,
  User,
  Gem,
  CircleDollarSign,
  Hexagon,
  Sparkles
} from "lucide-react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useThemeStore } from "@/store/useThemeStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateLevelData } from "@/features/progression/utils";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { character } = useCharacterStore();
  const { setTheme } = useThemeStore();

  const name = character?.name || "Cyrill";
  const rank = character?.rank || "E";
  const levelData = calculateLevelData(character?.exp || 0);
  const gold = character?.gold || 12450;
  const purpleCrystals = 1250;
  const blueCrystals = 85;

  return (
    <header className="h-[72px] px-4 sm:px-6 border-b border-white/5 bg-[#0B1020]/95 backdrop-blur-md flex items-center justify-between shrink-0 select-none font-sans sticky top-0 z-40">
      
      {/* LEFT: CHARACTER PROFILE (Replaces Search) */}
      <div className="flex items-center gap-4 flex-1">
        
        {/* Mobile Logo Fallback */}
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-[12px] bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </Link>

        {/* Character Info */}
        <div className="hidden md:flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#151C33] to-[#0B1020] border border-blue-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.15)]">
             <User className="w-6 h-6 text-blue-400/80" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-3">
              <h2 className="text-sm font-bold text-white font-heading tracking-wide">
                {name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-purple-400">Lv. {levelData.currentLevel}</span>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 font-mono mb-1">
              Rank: <span className="text-blue-400">{rank}-Rank</span>
            </div>

            {/* EXP Bar */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-1 bg-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full"
                  style={{ width: `${levelData.progressPercentage}%` }}
                />
              </div>
              <span className="text-[9px] text-purple-300 font-mono">
                EXP {levelData.currentExpInLevel} / {levelData.expToNextLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: CURRENCIES, NOTIFICATIONS, SETTINGS */}
      <div className="flex items-center gap-5">
        
        {/* Currencies */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <CircleDollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xs font-mono text-amber-100 font-bold">{gold.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 ml-1">+</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20 transform rotate-45">
              <Gem className="w-3 h-3 text-purple-400 -rotate-45" />
            </div>
            <span className="text-xs font-mono text-purple-200 font-bold">{purpleCrystals.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 ml-1">+</span>
          </div>

          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Hexagon className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-xs font-mono text-blue-200 font-bold">{blueCrystals.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 ml-1">+</span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden lg:block mx-1" />

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </Button>

          {/* Settings / Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#151C33] border-white/10 text-slate-200 text-xs w-48 shadow-xl shadow-black/50">
              <DropdownMenuLabel className="font-sans">
                <div className="font-bold text-white">System Settings</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10">
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferences</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-white/10">
                <span className="ml-5">Dark Theme</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-white/10">
                <span className="ml-5">Light Theme</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="cursor-pointer text-red-400 hover:bg-red-950/40">
                <Link href="/landing" className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit System</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
