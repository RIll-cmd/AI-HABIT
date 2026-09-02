"use client";

import React from "react";
import { AuthCard } from "@/components/v2/auth/AuthCard";
import { Galaxy } from "@/components/v2/auth/Galaxy";

export default function V2LoginPage() {
  return (
    <main className="w-full min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Galaxy Background from React Bits */}
      <div
        className="absolute inset-0 z-0 pointer-events-auto opacity-70"
        aria-hidden="true"
      >
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.2}
          glowIntensity={0.45}
          saturation={0.7}
          hueShift={195}
          starSpeed={0.35}
          speed={0.75}
          twinkleIntensity={0.4}
          transparent={true}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,#27272a12_1px,transparent_1px),linear-gradient(to_bottom,#27272a12_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"
        aria-hidden="true"
      />

      {/* Auth Card centered */}
      <div className="relative z-10 flex flex-col items-center gap-4 my-auto w-full max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>ASCEND OS V2 AUTH</span>
        </div>

        <AuthCard />
      </div>
    </main>
  );
}
