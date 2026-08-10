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
    <div className="flex h-screen w-full bg-[#0B1020] text-slate-100 overflow-hidden font-sans relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <AiraPeriodicToast />
    </div>
  );
}
