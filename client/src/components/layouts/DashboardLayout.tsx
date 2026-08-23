"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAiraNotification } from "@/features/aira/useAiraNotification";
import { AiraPeriodicToast } from "@/features/aira/components/AiraPeriodicToast";
import { SleepDrawer } from "@/features/sleep/components/SleepDrawer";
import { LearningDrawer } from "@/features/learning/components/LearningDrawer";

/* Arcane rune glyphs for the floating rune system */
const RUNE_GLYPHS = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛈ", "ᛇ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛗ", "ᛚ", "ᛞ", "ᛟ"];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Initialize global AIRA 60-second periodic briefing hook
  useAiraNotification();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div suppressHydrationWarning className="flex h-screen h-[100dvh] min-h-screen w-full bg-[#030712] text-slate-100 overflow-hidden font-sans relative scan-lines">
      
      {/* === CINEMATIC AMBIENT BACKGROUND SYSTEM === */}
      <div suppressHydrationWarning className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Energy Grid Pattern */}
        <div suppressHydrationWarning className="absolute inset-0 energy-grid opacity-40" />
        
        {/* Animated Glow Orbs — slow drifting ambient light */}
        <div suppressHydrationWarning className="absolute top-[-10%] left-[20%] w-[700px] h-[500px] bg-cyan-500/[0.035] rounded-full blur-[180px] animate-float-slow pointer-events-none" />
        <div suppressHydrationWarning className="absolute bottom-[-5%] right-[15%] w-[600px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[160px] animate-float-slow pointer-events-none" style={{ animationDelay: '-3s' }} />
        <div suppressHydrationWarning className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-purple-500/[0.025] rounded-full blur-[140px] animate-float-slow pointer-events-none" style={{ animationDelay: '-5s' }} />
        <div suppressHydrationWarning className="absolute top-[70%] left-[10%] w-[350px] h-[350px] bg-cyan-400/[0.02] rounded-full blur-[120px] animate-float-slow pointer-events-none" style={{ animationDelay: '-7s' }} />
        
        {/* Floating Particles — small energy dots */}
        {mounted && [...Array(12)].map((_, i) => (
          <div 
            key={`particle-${i}`}
            suppressHydrationWarning
            className="absolute w-1 h-1 rounded-full bg-cyan-400/40 pointer-events-none"
            style={{
              left: `${8 + (i * 7.5) % 85}%`,
              bottom: `${-5}%`,
              animation: `particle-float ${12 + (i * 2.3)}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
        
        {/* Floating Rune Glyphs — arcane symbols drifting upward */}
        {mounted && RUNE_GLYPHS.slice(0, 10).map((rune, i) => (
          <span
            key={`rune-bg-${i}`}
            suppressHydrationWarning
            className="rune text-cyan-400/30 pointer-events-none"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              bottom: `${5 + (i * 12) % 40}%`,
              fontSize: `${10 + (i % 4) * 3}px`,
              animationDuration: `${10 + (i * 1.7)}s`,
              animationDelay: `${i * 2.2}s`,
            }}
          >
            {rune}
          </span>
        ))}
        
        {/* Additional drifting runes with purple tint */}
        {mounted && RUNE_GLYPHS.slice(10, 16).map((rune, i) => (
          <span
            key={`rune-drift-${i}`}
            suppressHydrationWarning
            className="rune-drift text-purple-400/25 pointer-events-none"
            style={{
              left: `${15 + (i * 14) % 70}%`,
              bottom: `${20 + (i * 18) % 50}%`,
              animationDuration: `${13 + (i * 2)}s`,
              animationDelay: `${i * 3.5}s`,
            }}
          >
            {rune}
          </span>
        ))}
      </div>

      <Sidebar />
      <div suppressHydrationWarning className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Topbar />
        <main suppressHydrationWarning className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 min-h-0">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <AiraPeriodicToast />
      <SleepDrawer />
      <LearningDrawer />
    </div>
  );
}
