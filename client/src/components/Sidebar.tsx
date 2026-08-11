"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  CheckCircle2,
  Dumbbell,
  Flame,
  Package,
  Zap,
  Skull,
  ShoppingBag,
  Bot,
  Sparkles,
  MessageSquare,
  Trophy,
  Crown,
  Swords,
  Calendar,
  Radio
} from "lucide-react";

import { playSystemOpen } from "@/features/audio/useSystemAudio";
import { AiraAvatar } from "@/components/ui/AiraAvatar";
import { playMovementSFX } from "@/utils/audio";

export function Sidebar() {
  const pathname = usePathname();

  const sidebarNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Missions", href: "/missions", icon: Target },
    { name: "Habits", href: "/habits", icon: CheckCircle2 },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Workouts", href: "/workouts", icon: Dumbbell },
    { name: "Boss PR", href: "/workouts/boss-pr", icon: Swords },
    { name: "Tower", href: "/tower", icon: Flame },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Skills", href: "/skills", icon: Zap },
    { name: "Bosses", href: "/bosses", icon: Skull },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Season Pass", href: "/season-pass", icon: Crown },
    { name: "AI System", href: "/aira", icon: Bot },
  ];

  return (
    <aside suppressHydrationWarning className="w-64 flex flex-col border-r border-cyan-500/10 bg-[#050a18] shrink-0 select-none font-sans hidden md:flex relative z-30 shadow-2xl shadow-black/50">
      {/* BACKGROUND GLOW ACCENT */}
      <div suppressHydrationWarning className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

      {/* LOGO HEADER */}
      <div suppressHydrationWarning className="p-5 flex items-center justify-between border-b border-cyan-500/10 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div suppressHydrationWarning className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div suppressHydrationWarning>
            <div suppressHydrationWarning className="flex items-center gap-2">
              <h1 className="font-bold tracking-[0.12em] text-base font-heading text-white group-hover:text-cyan-300 transition-colors">
                ASCEND OS
              </h1>
            </div>
            <div suppressHydrationWarning className="flex items-center gap-1.5 -mt-0.5">
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold tracking-wider">
                v2.0 HUD
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav suppressHydrationWarning className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-cyan-500/10 scrollbar-track-transparent">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                playSystemOpen();
                playMovementSFX("teleport");
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "text-slate-400 hover:text-cyan-200 hover:bg-cyan-500/5 hover:border-cyan-500/10 border border-transparent"
              }`}
            >
              {/* Active left indicator glow bar */}
              {isActive && (
                <div suppressHydrationWarning className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
              
              <Icon
                className={`w-4 h-4 transition-all duration-200 ${
                  isActive 
                    ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" 
                    : "text-slate-500 group-hover:text-cyan-400"
                }`}
              />
              <span className="tracking-wide">{item.name}</span>
              {isActive && (
                <div suppressHydrationWarning className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI SYSTEM ADMIN CARD */}
      <div suppressHydrationWarning className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#0a1024] to-[#0d1430] border border-cyan-500/20 shadow-xl shadow-black/40 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 z-10">
        {/* Pulsing Glow backdrop */}
        <div suppressHydrationWarning className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
        <div suppressHydrationWarning className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div suppressHydrationWarning className="relative z-10">
          <div suppressHydrationWarning className="flex items-center gap-3 mb-3">
             <div suppressHydrationWarning className="w-10 h-10 rounded-xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] relative">
                <AiraAvatar mood="NEUTRAL" className="w-10 h-10 border-none shadow-none rounded-none" />
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
             </div>
             <div suppressHydrationWarning>
               <div suppressHydrationWarning className="flex items-center gap-1.5">
                 <h4 className="text-sm font-bold text-white font-heading tracking-wide">AIRA</h4>
                 <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">ONLINE</span>
               </div>
               <p className="text-[9px] text-cyan-400/80 font-mono tracking-wider font-bold uppercase mt-0.5">SYSTEM ADMINISTRATOR</p>
             </div>
          </div>
          <p className="text-[10px] text-slate-300 mb-3 leading-relaxed font-sans">
            Good morning, Ascendant. Your mind and body are in perfect sync today.
          </p>
          <Link
            href="/aira"
            onClick={() => playSystemOpen()}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:text-white flex items-center justify-center gap-2 transition-all font-mono shadow-md shadow-cyan-950/40 active:scale-[0.98]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chat with AIRA</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
