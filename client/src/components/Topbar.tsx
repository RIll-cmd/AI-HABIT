"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { character } = useCharacterStore();
  const { theme, setTheme } = useThemeStore();

  const name = character?.name || "Cyrill";
  const title = character?.title || "Wanderer";

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-white/10 bg-[#0B1020]/95 backdrop-blur-md flex items-center justify-between shrink-0 select-none font-sans sticky top-0 z-40">
      {/* LEFT: BRANDING & SEARCH */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-[12px] bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </Link>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <Input
            type="text"
            placeholder="Search quests, stats, items... (Ctrl+K)"
            className="pl-9 h-9 bg-[#151C33]/80 border-white/10 text-xs w-full focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* RIGHT: NOTIFICATIONS, THEME SWITCHER, PROFILE DROPDOWN */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* NOTIFICATIONS BELL */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:text-white hover:bg-white/5"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </Button>

        {/* THEME SWITCHER DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/5"
            >
              {theme === "light" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : theme === "dark" ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Monitor className="w-4 h-4 text-slate-400" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#151C33] border-white/10 text-slate-200 text-xs w-36"
          >
            <DropdownMenuLabel className="text-[10px] text-slate-400 font-mono">
              SELECT THEME
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="cursor-pointer hover:bg-white/10"
            >
              <Moon className="w-3.5 h-3.5 mr-2 text-blue-400" />
              <span>Dark Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="cursor-pointer hover:bg-white/10"
            >
              <Sun className="w-3.5 h-3.5 mr-2 text-amber-400" />
              <span>Light Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="cursor-pointer hover:bg-white/10"
            >
              <Monitor className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* PROFILE AVATAR DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-1 rounded-[14px] hover:bg-white/5 transition-colors cursor-pointer text-left">
              <div className="w-8 h-8 rounded-[12px] bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white font-heading leading-tight">
                  {name}
                </div>
                <div className="text-[10px] text-blue-400 font-mono leading-none">
                  {title}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#151C33] border-white/10 text-slate-200 text-xs w-48"
          >
            <DropdownMenuLabel className="font-sans">
              <div className="font-bold text-white">{name}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {title} • Level 1
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-white/10"
            >
              <Link href="/profile" className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Character Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-white/10"
            >
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer text-red-400 hover:bg-red-950/40"
            >
              <Link href="/landing" className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
