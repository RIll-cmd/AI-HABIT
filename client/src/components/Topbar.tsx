"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Settings,
  LogOut,
  User,
  Gem,
  CircleDollarSign,
  Hexagon,
  Sparkles,
  Shield,
  Palette,
  AlertTriangle
} from "lucide-react";
import { AiraAvatar, AiraMood } from "@/components/ui/AiraAvatar";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useAiraStore } from "@/features/aira/store";
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
import { CHARACTER_AVATAR_SPRITE } from "@/utils/sprites";
import { AccountSettingsModal } from "@/components/AccountSettingsModal";
import { playUIMenuSFX } from "@/utils/audio";
import { NotificationDrawer } from "@/components/NotificationDrawer";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { fetcher } from "@/lib/api";

export function Topbar() {
  const router = useRouter();
  const { character } = useCharacterStore();
  const { theme, setTheme } = useThemeStore();
  const {
    autoBriefingsEnabled,
    toggleAutoBriefings,
    currentMood
  } = useAiraStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const unreadCount = useNotificationStore(state => state.getUnreadCount());

  const name = character?.name || "Cyrill";
  const rank = character?.rank || "E";
  const levelData = calculateLevelData(character?.exp || 0);
  const gold = character?.gold || 0;
  const gems = character?.gems || 0;
  const towerTokens = character?.towerTokens || 0;
  const stats = character?.stats || { strength: 1, endurance: 1, discipline: 1, knowledge: 1, recovery: 1, focus: 1, consistency: 1 };
  const authUsername = useAuthStore(state => state.user?.username);
  const username = authUsername || name;

  const handleLogout = async () => {
    try {
      await fetcher("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed:", e);
    }
    useAuthStore.getState().logout();
    playUIMenuSFX();
    router.push("/login");
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    playUIMenuSFX();
  };

  return (
    <>
      <AccountSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        username={username} 
      />
      <header className="h-[72px] px-4 sm:px-6 border-b border-white/5 bg-[#0B1020]/95 backdrop-blur-md flex items-center justify-between shrink-0 select-none font-sans sticky top-0 z-40">
        
        {/* LEFT: CHARACTER PROFILE */}
        <div className="flex items-center gap-4 flex-1">
          
          {/* Mobile Logo Fallback */}
          <Link href="/dashboard" className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-[12px] bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </Link>

          {/* Interactive Profile Quick-Hub Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden md:flex items-center gap-3 p-1 pr-4 rounded-2xl border border-transparent cursor-pointer hover:border-cyan-500/50 hover:bg-white/5 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
                {/* Avatar Sprite */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#151C33] to-[#0B1020] border border-blue-500/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.15)] p-1">
                  <img
                    src={CHARACTER_AVATAR_SPRITE}
                    alt="Character Avatar"
                    className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ imageRendering: "pixelated" }}
                  />
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
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" className="bg-[#151C33]/95 backdrop-blur-xl border-white/10 text-slate-200 w-80 shadow-2xl shadow-black/50 p-4 rounded-2xl font-sans mt-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#151C33] to-[#0B1020] border border-blue-500/30 flex items-center justify-center p-1 shadow-inner">
                  <img src={CHARACTER_AVATAR_SPRITE} alt="Avatar" className="w-full h-full object-contain" style={{ imageRendering: "pixelated" }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white font-heading">{name}</h3>
                  <p className="text-xs text-slate-400 mb-1">@{username}</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/20">{rank}-Rank</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold border border-purple-500/20">Lv. {levelData.currentLevel}</span>
                  </div>
                </div>
              </div>
              
              {/* Mini Stat Matrix */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                  <span className="text-[9px] text-slate-400 font-bold">STR</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.strength}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                  <span className="text-[9px] text-slate-400 font-bold">END</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.endurance}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                  <span className="text-[9px] text-slate-400 font-bold">DIS</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.discipline}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                  <span className="text-[9px] text-slate-400 font-bold">KNO</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.knowledge}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                  <span className="text-[9px] text-slate-400 font-bold">REC</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.recovery}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]">
                  <span className="text-[9px] text-slate-400 font-bold">FOC</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.focus}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center py-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)] col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold">CNS</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.consistency}</span>
                </div>
              </div>

              <div className="space-y-1 mb-2">
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 py-2">
                  <Link href="/profile/stats" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">[ 👤 VIEW FULL PROFILE ]</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeToggle} className="cursor-pointer hover:bg-white/10 py-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">[ 🎨 TOGGLE SYSTEM HUD THEME ]</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 py-2">
                  <Link href="/profile/customize" className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold">[ 🛡️ EQUIP TITLE ]</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-white/10 my-2" />

              <div className="space-y-1">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-white/10 py-2">
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">[ 🚪 LOGOUT ]</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer bg-red-950/20 text-red-400 hover:bg-red-900/40 py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold">[ ⚠️ ACCOUNT SETTINGS / DANGER ZONE ]</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="text-xs font-mono text-cyan-200 font-bold">{gems.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 ml-1">+</span>
            </div>

            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Hexagon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-xs font-mono text-purple-200 font-bold">{towerTokens.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 ml-1">+</span>
            </div>

            {/* Streak Freeze Shield Badge */}
            <Link href="/calendar">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-950/50 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all">
                <span className="text-xs font-mono text-purple-300 font-bold">🛡️ {character?.streakFreezes || 0}</span>
              </div>
            </Link>

            {/* Active Buffs */}
            {character?.activeBuffs?.map(buff => (
              <div key={buff.id} className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {buff.buffType === "DOUBLE_EXP" ? "2x EXP" : "2x GOLD"}
                </span>
              </div>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10 hidden lg:block mx-1" />

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationDrawer>
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer rounded-xl transition-all">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </Button>
            </NotificationDrawer>

            {/* Settings Dropdown */}
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
                <DropdownMenuItem
                  onClick={toggleAutoBriefings}
                  className="cursor-pointer hover:bg-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <AiraAvatar mood={currentMood as AiraMood} className="w-4 h-4" />
                    <span>AIRA Briefings</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${autoBriefingsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {autoBriefingsEnabled ? "ON" : "OFF"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
