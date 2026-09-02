"use client";

import React from "react";
import { AuthCard, AuthTabState } from "@/components/v2/auth/AuthCard";
import { Galaxy } from "@/components/v2/auth/Galaxy";

interface AuthSectionProps {
  initialTab?: AuthTabState;
}

export function AuthSection({ initialTab = "login" }: AuthSectionProps) {
  return (
    <section
      id="auth-section"
      className="relative w-full shrink-0 py-20 md:py-28 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden z-20"
      aria-labelledby="auth-section-heading"
    >
      {/* Interactive Galaxy Background from React Bits */}
      <div
        className="absolute inset-0 z-0 pointer-events-auto opacity-60"
        aria-hidden="true"
      >
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1.1}
          glowIntensity={0.4}
          saturation={0.7}
          hueShift={195}
          starSpeed={0.35}
          speed={0.7}
          twinkleIntensity={0.4}
          transparent={true}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,#27272a12_1px,transparent_1px),linear-gradient(to_bottom,#27272a12_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"
        aria-hidden="true"
      />

      {/* Auth Card Container */}
      <div className="relative z-10 flex flex-col items-center gap-6 my-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>TERMINAL ACCESS GATEWAY</span>
          </div>

          <h2
            id="auth-section-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            Access Command Deck
          </h2>

          <p className="text-xs text-zinc-400 max-w-sm font-normal">
            Authenticate your operative license or explore instantly via Guest Sandbox.
          </p>
        </div>

        {/* Core Auth Card */}
        <AuthCard initialTab={initialTab} />
      </div>
    </section>
  );
}
