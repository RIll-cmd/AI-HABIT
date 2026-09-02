"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Activity,
  Flame,
  Dna,
  Zap,
  Terminal,
  Layers,
  Lock,
} from "lucide-react";
import { V2LoginForm } from "./V2LoginForm";
import { V2RegisterForm } from "./V2RegisterForm";
import { V2OtpForm } from "./V2OtpForm";
import { V2ForgotPassword } from "./V2ForgotPassword";
import { AuthFormMode } from "./V2AuthPreviewToolbar";
import { Galaxy } from "./Galaxy";

interface V2AuthContainerProps {
  externalMode?: AuthFormMode;
  onModeChange?: (mode: AuthFormMode) => void;
  forceLoading?: boolean;
  forceError?: string | null;
  forceSuccess?: boolean;
}

export function V2AuthContainer({
  externalMode = "login",
  onModeChange,
  forceLoading = false,
  forceError = null,
  forceSuccess = false,
}: V2AuthContainerProps) {
  const [internalMode, setInternalMode] = useState<AuthFormMode>("login");

  const mode = onModeChange ? externalMode : internalMode;
  const setMode = onModeChange ? onModeChange : setInternalMode;

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Interactive Cybernetic Galaxy Background from React Bits */}
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

      {/* Background Architectural Grid Accent */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,#27272a12_1px,transparent_1px),linear-gradient(to_bottom,#27272a12_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Responsive Split Panel */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 my-auto">
        
        {/* Left Side: Brand Showcase & Telemetry Hero */}
        <section
          aria-label="Ascend OS Platform Overview"
          className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col gap-8 pr-4"
        >
          {/* Brand Header */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYSTEM PROTOCOL V2.4 ONLINE</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Ascend Your Discipline.
              <span className="block text-zinc-400 font-medium text-3xl xl:text-4xl mt-1">
                Gamified Self-Actualization Engine.
              </span>
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              Ascend OS connects real-world habits, 16-muscle gym workout recovery, and walking steps directly to combat power ratings, raid boss encounters, and neural AI strategy.
            </p>
          </div>

          {/* Core Telemetry Cards */}
          <div className="grid grid-cols-2 gap-3.5 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-200">Neural Habit Deck</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Multi-tier completion thresholds (Bronze, Silver, Gold) with streak freeze shields.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-200">Kinetic Gym Terminal</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                16-group anatomical muscle recovery curves tracking 48-72h somatic freshness.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Dna className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-200">Mythic Bestiary</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Background pedometer stride sync converting daily steps into familiar pet evolutions.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-bold text-zinc-200">AIRA Neural Core</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Autonomous system administrator briefing you on habits, sleep debt, and boss raids.
              </p>
            </div>
          </div>

          {/* Security & System Commitments */}
          <div className="flex items-center gap-6 pt-2 text-xs text-zinc-500 border-t border-zinc-900">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Zero Knowledge Auth</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>Biometric Vault</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              <span>Optimistic Sync</span>
            </div>
          </div>
        </section>

        {/* Right Side: Auth Form Card */}
        <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center w-full">
          {/* Mobile Header Banner (Visible only on mobile/tablet) */}
          <div className="flex lg:hidden flex-col items-center text-center gap-1.5 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>ASCEND OS V2</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Command Deck Authentication
            </h1>
          </div>

          {/* Auth Card Container */}
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-xl flex flex-col relative">
            <AnimatePresence mode="wait">
              {mode === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <V2LoginForm
                    onSwitchToRegister={() => setMode("register")}
                    onSwitchToForgot={() => setMode("forgot")}
                    onGuestEntry={() => {
                      // Navigate or mock guest entry
                    }}
                    onSuccess={() => setMode("otp")}
                    forceLoading={forceLoading}
                    forceError={forceError}
                    forceSuccess={forceSuccess}
                  />
                </motion.div>
              )}

              {mode === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <V2RegisterForm
                    onSwitchToLogin={() => setMode("login")}
                    onGuestEntry={() => {
                      // Navigate or mock guest entry
                    }}
                    onSuccess={() => setMode("otp")}
                    forceLoading={forceLoading}
                    forceError={forceError}
                    forceSuccess={forceSuccess}
                  />
                </motion.div>
              )}

              {mode === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <V2OtpForm
                    email="hunter_ciel@ascend.io"
                    onBackToLogin={() => setMode("login")}
                    onSuccess={() => {
                      // Handled
                    }}
                    forceLoading={forceLoading}
                    forceError={forceError}
                    forceSuccess={forceSuccess}
                  />
                </motion.div>
              )}

              {mode === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <V2ForgotPassword
                    onBackToLogin={() => setMode("login")}
                    onSuccess={() => {
                      // Handled
                    }}
                    forceLoading={forceLoading}
                    forceError={forceError}
                    forceSuccess={forceSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </main>
  );
}
