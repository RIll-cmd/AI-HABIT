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
  Calendar
} from "lucide-react";

import { playSystemOpen } from "@/features/audio/useSystemAudio";
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
    <aside className="w-64 flex flex-col border-r border-white/5 bg-[#0B1020] shrink-0 select-none font-sans hidden md:flex">
      {/* LOGO */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[12px] bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-md group-hover:bg-purple-600/30 transition-colors">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold tracking-wider text-base font-heading text-white">
              ASCEND OS
            </h1>
            <p className="text-[10px] text-purple-400 font-mono">
              v1.0.0
            </p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI SYSTEM ADMIN CARD */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-[#151C33] to-[#0B1020] border border-blue-500/20 shadow-lg relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-500/40 flex items-center justify-center overflow-hidden">
                {/* Fallback Ciel avatar */}
                <Bot className="w-5 h-5 text-blue-300" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-white font-heading tracking-wide">Ciel</h4>
               <p className="text-[9px] text-blue-400 font-mono tracking-wider">SYSTEM ADMINISTRATOR</p>
             </div>
          </div>
          <p className="text-[10px] text-slate-300 mb-3 leading-relaxed">
            Good morning, Ascendant. Your mind and body are in perfect sync today.
          </p>
          <Link
            href="/aira"
            onClick={() => playSystemOpen()}
            className="w-full py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-300 hover:text-white flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Ciel</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
