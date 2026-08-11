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
import { CurrencyIcon } from "@/components/CurrencyDisplay";
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
  const [isMounted, setIsMounted] = React.useState(false);
  const unreadCount = useNotificationStore(state => state.getUnreadCount());

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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
      <header suppressHydrationWarning className="h-[72px] px-4 sm:px-6 border-b border-cyan-500/10 bg-[#050a18]/90 backdrop-blur-xl flex items-center justify-between shrink-0 select-none font-sans sticky top-0 z-40 shadow-lg shadow-black/20">
        
        {/* LEFT: CHARACTER PROFILE */}
        <div suppressHydrationWarning className="flex items-center gap-4 flex-1">
          
          {/* Mobile Logo Fallback */}
          <Link href="/dashboard" className="md:hidden flex items-center gap-2">
            <div suppressHydrationWarning className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
          </Link>

          {/* Interactive Profile Quick-Hub Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div suppressHydrationWarning className="hidden md:flex items-center gap-3 p-1.5 pr-5 rounded-2xl border border-transparent cursor-pointer hover:border-cyan-500/40 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group">
                {/* Avatar Sprite */}
                <div suppressHydrationWarning className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a1024] to-[#0d1430] border border-cyan-500/20 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)] p-1 group-hover:border-cyan-400/40 transition-colors">
                  <img
                    src={CHARACTER_AVATAR_SPRITE}
                    alt="Character Avatar"
                    className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    style={{ imageRendering: "pixelated" }}
                  />
                  {/* Corner pulse dot */}
                  <div suppressHydrationWarning className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                </div>

                <div suppressHydrationWarning className="flex flex-col justify-center">
                  <div suppressHydrationWarning className="flex items-baseline gap-3">
                    <h2 className="text-sm font-bold text-white font-heading tracking-wide group-hover:text-cyan-200 transition-colors">
                      {name}
                    </h2>
                    <div suppressHydrationWarning className="flex items-center gap-2 text-xs font-mono font-bold">
                      <span className="text-cyan-400">Lv. {levelData.currentLevel}</span>
                    </div>
                  </div>
                  
                  <div suppressHydrationWarning className="text-[10px] text-slate-400 font-mono mb-1">
                    Rank: <span className="text-cyan-300 font-bold">{rank}-Rank</span>
                  </div>

                  {/* EXP Bar — upgraded with glow */}
                  <div suppressHydrationWarning className="flex items-center gap-2">
                    <div suppressHydrationWarning className="w-32 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                      <div 
                        suppressHydrationWarning
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500"
                        style={{ width: `${levelData.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-cyan-300/70 font-mono">
                      EXP {levelData.currentExpInLevel} / {levelData.expToNextLevel}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" className="bg-[#0a1024]/95 backdrop-blur-xl border-cyan-500/20 text-slate-200 w-80 shadow-2xl shadow-black/60 p-4 rounded-2xl font-sans mt-2">
              <div suppressHydrationWarning className="flex items-center gap-4 mb-4">
                <div suppressHydrationWarning className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0a1024] to-[#0d1430] border border-cyan-500/30 flex items-center justify-center p-1 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <img src={CHARACTER_AVATAR_SPRITE} alt="Avatar" className="w-full h-full object-contain" style={{ imageRendering: "pixelated" }} />
                </div>
                <div suppressHydrationWarning>
                  <h3 className="font-bold text-lg text-white font-heading">{name}</h3>
                  <p className="text-xs text-slate-400 mb-1">@{username}</p>
                  <div suppressHydrationWarning className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-400 text-[10px] font-bold border border-cyan-500/25">{rank}-Rank</span>
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-400 text-[10px] font-bold border border-indigo-500/25">Lv. {levelData.currentLevel}</span>
                  </div>
                </div>
              </div>
              
              {/* Mini Stat Matrix */}
              <div suppressHydrationWarning className="grid grid-cols-4 gap-2 mb-4">
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5">
                  <span className="text-[9px] text-cyan-400/60 font-bold">STR</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.strength}</span>
                </div>
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5">
                  <span className="text-[9px] text-cyan-400/60 font-bold">END</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.endurance}</span>
                </div>
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5">
                  <span className="text-[9px] text-cyan-400/60 font-bold">DIS</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.discipline}</span>
                </div>
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5">
                  <span className="text-[9px] text-cyan-400/60 font-bold">KNO</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.knowledge}</span>
                </div>
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5">
                  <span className="text-[9px] text-cyan-400/60 font-bold">REC</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.recovery}</span>
                </div>
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5">
                  <span className="text-[9px] text-cyan-400/60 font-bold">FOC</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.focus}</span>
                </div>
                <div suppressHydrationWarning className="bg-cyan-950/30 border border-cyan-500/10 rounded-lg flex flex-col items-center justify-center py-1.5 col-span-2">
                  <span className="text-[9px] text-cyan-400/60 font-bold">CNS</span>
                  <span className="text-xs font-mono text-white font-bold">{stats.consistency}</span>
                </div>
              </div>

              <div suppressHydrationWarning className="space-y-1 mb-2">
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-cyan-500/10 py-2 rounded-lg">
                  <Link href="/profile/stats" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400/60" />
                    <span className="text-xs font-bold">[ 👤 VIEW FULL PROFILE ]</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeToggle} className="cursor-pointer hover:bg-cyan-500/10 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400/60" />
                    <span className="text-xs font-bold">[ 🎨 TOGGLE SYSTEM HUD THEME ]</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-cyan-500/10 py-2 rounded-lg">
                  <Link href="/profile/customize" className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400/60" />
                    <span className="text-xs font-bold">[ 🛡️ EQUIP TITLE ]</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-white/5 my-2" />

              <div suppressHydrationWarning className="space-y-1">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-cyan-500/10 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">[ 🚪 LOGOUT ]</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer bg-red-950/20 text-red-400 hover:bg-red-900/30 py-2 rounded-lg">
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
        <div suppressHydrationWarning className="flex items-center gap-5">
          
          {/* Currencies — upgraded with glow badges */}
          <div suppressHydrationWarning className="hidden lg:flex items-center gap-4">
            <div suppressHydrationWarning className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-950/20 border border-amber-500/15 hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] transition-all duration-200 cursor-default">
              <CurrencyIcon type="GOLD" size="sm" />
              <span className="text-xs font-mono text-amber-200 font-bold">{gold.toLocaleString()}</span>
              <span className="text-[10px] text-amber-500/50 ml-0.5">+</span>
            </div>

            <div suppressHydrationWarning className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-cyan-950/20 border border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-200 cursor-default">
              <CurrencyIcon type="GEMS" size="sm" />
              <span className="text-xs font-mono text-cyan-200 font-bold">{gems.toLocaleString()}</span>
              <span className="text-[10px] text-cyan-500/50 ml-0.5">+</span>
            </div>

            <div suppressHydrationWarning className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-indigo-950/20 border border-indigo-500/15 hover:border-indigo-400/40 hover:shadow-[0_0_12px_rgba(99,102,241,0.15)] transition-all duration-200 cursor-default">
              <CurrencyIcon type="THIRD" size="sm" />
              <span className="text-xs font-mono text-indigo-200 font-bold">{towerTokens.toLocaleString()}</span>
              <span className="text-[10px] text-indigo-500/50 ml-0.5">+</span>
            </div>

            {/* Streak Freeze Shield Badge */}
            <Link href="/calendar">
              <div suppressHydrationWarning className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-400/40 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] cursor-pointer transition-all duration-200">
                <span className="text-xs font-mono text-purple-300 font-bold">🛡️ {character?.streakFreezes || 0}</span>
              </div>
            </Link>

            {/* Active Buffs */}
            {character?.activeBuffs?.map(buff => (
              <div key={buff.id} suppressHydrationWarning className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/30 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-pulse">
                <span className="text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {buff.buffType === "DOUBLE_EXP" ? "2x EXP" : "2x GOLD"}
                </span>
              </div>
            ))}
          </div>

          <div suppressHydrationWarning className="h-6 w-px bg-cyan-500/10 hidden lg:block mx-1" />

          {/* Action Icons */}
          <div suppressHydrationWarning className="flex items-center gap-1 sm:gap-2">
            <NotificationDrawer>
              <Button suppressHydrationWarning variant="ghost" size="icon" className="relative text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer rounded-xl transition-all duration-200">
                <Bell className="w-4 h-4" />
                {isMounted && unreadCount > 0 && (
                  <span suppressHydrationWarning className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </Button>
            </NotificationDrawer>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl transition-all duration-200">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0a1024]/95 backdrop-blur-xl border-cyan-500/20 text-slate-200 text-xs w-52 shadow-2xl shadow-black/60 rounded-2xl p-2">
                <DropdownMenuLabel className="font-sans px-3 py-2">
                  <div className="font-bold text-white text-sm">System Settings</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-cyan-500/10 rounded-lg px-3 py-2">
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-cyan-400/60" />
                    <span>Preferences</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-cyan-500/10 rounded-lg px-3 py-2">
                  <span className="ml-5">Dark Theme</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-cyan-500/10 rounded-lg px-3 py-2">
                  <span className="ml-5">Light Theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  onClick={toggleAutoBriefings}
                  className="cursor-pointer hover:bg-cyan-500/10 flex items-center justify-between rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <AiraAvatar mood={currentMood as AiraMood} className="w-4 h-4" />
                    <span>AIRA Briefings</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${autoBriefingsEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-white/10'}`}>
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
