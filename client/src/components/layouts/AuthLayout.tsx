"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowLeft, Shield, Zap, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  // Deterministic star positions for SSR hydration safety
  const stars = Array.from({ length: 60 }).map((_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    delay: (i * 0.3) % 5,
    duration: 2 + (i % 4),
    size: 1 + (i % 3),
  }));

  return (
    <div
      suppressHydrationWarning
      className="auth-layout-root min-h-screen w-full bg-[#050a18] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-white"
    >
      {/* ANIMATED STARFIELD / PARTICLE LAYER */}
      <div suppressHydrationWarning className="auth-starfield" aria-hidden="true">
        {stars.map((s, i) => (
          <div
            key={i}
            className="auth-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              width: `${s.size}px`,
              height: `${s.size}px`,
            }}
          />
        ))}
      </div>

      {/* FLOATING RUNE & GLYPH FIELD */}
      <FloatingRuneField density="medium" className="opacity-50" />

      {/* DEEP AMBIENT GLOW LAYERS */}
      <div suppressHydrationWarning className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none auth-glow-core" />
      <div suppressHydrationWarning className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none auth-glow-accent" />
      <div suppressHydrationWarning className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full pointer-events-none auth-glow-tertiary" />

      {/* CONCENTRIC ENERGY ORBITAL RINGS */}
      <div suppressHydrationWarning className="auth-orbital" aria-hidden="true">
        <div className="auth-orbital-ring auth-orbital-ring-1" />
        <div className="auth-orbital-ring auth-orbital-ring-2" />
        <div className="auth-orbital-ring auth-orbital-ring-3" />
      </div>

      {/* FLOATING RUNIC GLYPHS */}
      <div suppressHydrationWarning className="auth-runes" aria-hidden="true">
        <span className="auth-rune" style={{ top: '12%', left: '8%', animationDelay: '0s' }}>⟁</span>
        <span className="auth-rune" style={{ top: '22%', right: '10%', animationDelay: '1.5s' }}>◇</span>
        <span className="auth-rune" style={{ bottom: '18%', left: '12%', animationDelay: '3s' }}>⬡</span>
        <span className="auth-rune" style={{ bottom: '28%', right: '8%', animationDelay: '0.8s' }}>△</span>
        <span className="auth-rune" style={{ top: '48%', left: '4%', animationDelay: '2.2s' }}>⊕</span>
        <span className="auth-rune" style={{ top: '42%', right: '4%', animationDelay: '4s' }}>⟐</span>
      </div>

      {/* CYBERNETIC GRID OVERLAY */}
      <div suppressHydrationWarning className="auth-grid-overlay" aria-hidden="true" />

      {/* TOP HEADER BAR */}
      <header
        suppressHydrationWarning
        className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20"
      >
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/15 hover:border-cyan-500/30 rounded-xl transition-all duration-300 backdrop-blur-md px-3.5 h-9"
        >
          <Link href="/landing" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-wider">RETURN TO LANDING</span>
          </Link>
        </Button>

        <Link
          href="/landing"
          className="flex items-center gap-3 text-lg font-bold text-white font-heading group"
        >
          <div
            suppressHydrationWarning
            className="auth-logo-icon w-10 h-10 rounded-[14px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/60 transition-all duration-300 group-hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 font-heading font-black text-sm">
              ASCEND OS
            </span>
            <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest -mt-0.5">
              NEURAL GATEWAY v2.0
            </span>
          </div>
        </Link>
      </header>

      {/* MAIN CENTERED AUTH CONTENT CONTAINER */}
      <main
        suppressHydrationWarning
        className="relative z-10 w-full max-w-md my-auto pt-16 pb-8 auth-card-entrance"
      >
        {children}
      </main>

      {/* BOTTOM ATTRIBUTION */}
      <footer
        suppressHydrationWarning
        className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-[9.5px] font-mono text-slate-500 tracking-[0.2em] uppercase">
            ASCEND OS // SECURE QUANTUM ENCRYPTION ACTIVE
          </p>
        </div>
      </footer>

      {/* COMPONENT STYLES FOR CINEMATIC AUTH VISUALS */}
      <style jsx global>{`
        .auth-layout-root {
          background: radial-gradient(ellipse at 50% 0%, #0a1628 0%, #050a18 50%, #020510 100%);
        }

        /* Starfield particles */
        .auth-starfield {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .auth-star {
          position: absolute;
          background: #38bdf8;
          border-radius: 50%;
          opacity: 0;
          animation: auth-star-twinkle ease-in-out infinite;
        }
        @keyframes auth-star-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.6); }
          50% { opacity: 0.85; transform: scale(1.2); box-shadow: 0 0 8px rgba(56, 189, 248, 0.8); }
        }

        /* Ambient glow layers */
        .auth-glow-core {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
          animation: auth-glow-pulse 6s ease-in-out infinite;
        }
        .auth-glow-accent {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
          animation: auth-glow-pulse 8s ease-in-out infinite 2s;
        }
        .auth-glow-tertiary {
          background: radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, transparent 70%);
          animation: auth-glow-pulse 7s ease-in-out infinite 4s;
        }
        @keyframes auth-glow-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.08); }
        }

        /* Concentric orbital rings */
        .auth-orbital {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 2;
        }
        .auth-orbital-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .auth-orbital-ring-1 {
          width: 520px;
          height: 520px;
          border-color: rgba(6, 182, 212, 0.12);
          border-style: dashed;
          animation: auth-orbital-spin 40s linear infinite;
        }
        .auth-orbital-ring-2 {
          width: 720px;
          height: 720px;
          border-color: rgba(99, 102, 241, 0.08);
          animation: auth-orbital-spin 60s linear infinite reverse;
        }
        .auth-orbital-ring-3 {
          width: 900px;
          height: 900px;
          border-color: rgba(217, 70, 239, 0.05);
          border-style: dotted;
          animation: auth-orbital-spin 90s linear infinite;
        }
        @keyframes auth-orbital-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Floating runes */
        .auth-runes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .auth-rune {
          position: absolute;
          font-size: 20px;
          color: rgba(6, 182, 212, 0.18);
          text-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
          animation: auth-rune-float 7s ease-in-out infinite;
        }
        @keyframes auth-rune-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-20px) rotate(12deg); opacity: 0.4; }
        }

        /* Subtle grid overlay */
        .auth-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 1;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }

        /* Card entrance animation */
        .auth-card-entrance {
          animation: auth-card-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes auth-card-slide-up {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.97);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Logo pulse */
        .auth-logo-icon {
          animation: auth-logo-pulse 3.5s ease-in-out infinite;
        }
        @keyframes auth-logo-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.35); }
          50% { box-shadow: 0 0 28px rgba(6, 182, 212, 0.65), 0 0 50px rgba(99, 102, 241, 0.3); }
        }
      `}</style>
    </div>
  );
}
