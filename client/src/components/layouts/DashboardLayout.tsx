"use client";

import { AppStaggeredMenu } from "@/components/AppStaggeredMenu";
import { Topbar } from "@/components/Topbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useAiraNotification } from "@/features/aira/useAiraNotification";
import { AiraPeriodicToast } from "@/features/aira/components/AiraPeriodicToast";
import { SleepDrawer } from "@/features/sleep/components/SleepDrawer";
import { LearningDrawer } from "@/features/learning/components/LearningDrawer";
import { PixelSunsetBackground } from "@/components/ui/pixel/PixelSunsetBackground";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useAiraNotification();

  return (
    <div
      suppressHydrationWarning
      className="flex h-screen h-[100dvh] min-h-screen w-full bg-[#1A0B2E] text-zinc-100 overflow-hidden font-sans relative"
    >
      {/* === 8-BIT AUTHENTIC DITHER SUNSET SKY (MOON, SHADED CLOUDS & STARS) === */}
      <PixelSunsetBackground />

      {/* === REACT BITS STAGGERED MENU AS THE MAIN NAVIGATION === */}
      <AppStaggeredMenu position="left" isFixed={true} />

      <div
        suppressHydrationWarning
        className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10"
      >
        <Topbar />
        <main
          suppressHydrationWarning
          className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 pb-20 md:pb-6 min-h-0"
        >
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

export default DashboardLayout;
