"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAiraNotification } from "@/features/aira/useAiraNotification";
import { AiraPeriodicToast } from "@/features/aira/components/AiraPeriodicToast";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Initialize global AIRA 60-second periodic briefing hook
  useAiraNotification();

  return (
    <div suppressHydrationWarning className="flex h-screen w-full bg-[#050a18] text-slate-100 overflow-hidden font-sans relative">
      {/* Subtle ambient background glow for the entire shell */}
      <div suppressHydrationWarning className="absolute inset-0 pointer-events-none z-0">
        <div suppressHydrationWarning className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[150px]" />
        <div suppressHydrationWarning className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[140px]" />
      </div>

      <Sidebar />
      <div suppressHydrationWarning className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Topbar />
        <main suppressHydrationWarning className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <AiraPeriodicToast />
    </div>
  );
}
