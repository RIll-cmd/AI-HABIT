"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Target, Flame, User, Menu } from "lucide-react";
import { playUISound } from "@/utils/audio";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Missions", href: "/missions", icon: Target },
    { name: "Tower", href: "/tower", icon: Flame },
    { name: "Profile", href: "/character", icon: User },
    { name: "Settings", href: "/settings", icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#030712]/95 backdrop-blur-2xl border-t border-cyan-500/10 flex items-center justify-around z-50 px-2 font-sans shadow-[0_-4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
      {/* Top energy line */}
      <div suppressHydrationWarning className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      {/* Rune accents */}
      <span suppressHydrationWarning className="rune-static text-cyan-400/10 absolute" style={{ top: '25%', left: '15%', fontSize: '8px', animationDelay: '0s' }}>ᚦ</span>
      <span suppressHydrationWarning className="rune-static text-purple-400/8 absolute" style={{ top: '30%', right: '20%', fontSize: '7px', animationDelay: '2s' }}>ᚲ</span>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => playUISound("/sounds/General/10_UI_Menu_SFX/001_Hover_01.wav")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-[12px] transition-all duration-300 relative ${
              isActive
                ? "text-cyan-400 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {/* Active glow halo */}
            {isActive && (
              <div suppressHydrationWarning className="absolute -top-1 w-8 h-8 bg-cyan-500/15 rounded-full blur-md animate-pulse pointer-events-none" />
            )}
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive 
                    ? "text-cyan-400 glow-cyan" 
                    : "text-slate-400"
                }`}
              />
            </motion.div>
            <span className="text-[10px] tracking-tight font-mono relative z-10">
              {item.name}
            </span>
            {/* Active dot indicator */}
            {isActive && (
              <div suppressHydrationWarning className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
