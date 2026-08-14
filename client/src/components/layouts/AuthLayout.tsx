import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning className="auth-layout-root min-h-screen w-full bg-[#050a18] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* ANIMATED STARFIELD / PARTICLE LAYER */}
      <div suppressHydrationWarning className="auth-starfield" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="auth-star" style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDelay: `${(i * 0.3) % 5}s`,
            animationDuration: `${2 + (i % 4)}s`,
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
          }} />
        ))}
      </div>

      {/* DEEP AMBIENT GLOW LAYERS */}
      <div suppressHydrationWarning className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none auth-glow-core" />
      <div suppressHydrationWarning className="absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none auth-glow-accent" />
      <div suppressHydrationWarning className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full pointer-events-none auth-glow-tertiary" />

      {/* ENERGY RING / ORBITAL */}
      <div suppressHydrationWarning className="auth-orbital" aria-hidden="true">
        <div className="auth-orbital-ring auth-orbital-ring-1" />
        <div className="auth-orbital-ring auth-orbital-ring-2" />
      </div>

      {/* FLOATING RUNE GLYPHS */}
      <div suppressHydrationWarning className="auth-runes" aria-hidden="true">
        <span className="auth-rune" style={{ top: '12%', left: '8%', animationDelay: '0s' }}>⟁</span>
        <span className="auth-rune" style={{ top: '25%', right: '12%', animationDelay: '1.5s' }}>◇</span>
        <span className="auth-rune" style={{ bottom: '20%', left: '15%', animationDelay: '3s' }}>⬡</span>
        <span className="auth-rune" style={{ bottom: '30%', right: '8%', animationDelay: '0.8s' }}>△</span>
        <span className="auth-rune" style={{ top: '50%', left: '5%', animationDelay: '2.2s' }}>⊕</span>
        <span className="auth-rune" style={{ top: '40%', right: '5%', animationDelay: '4s' }}>⟐</span>
      </div>

      {/* GRID OVERLAY */}
      <div suppressHydrationWarning className="auth-grid-overlay" aria-hidden="true" />

      {/* TOP BAR / BACK TO LANDING */}
      <header suppressHydrationWarning className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-500 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all duration-300 backdrop-blur-sm"
        >
          <Link href="/landing" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <Link
          href="/landing"
          className="flex items-center gap-2 text-lg font-bold text-white font-heading group"
        >
          <div suppressHydrationWarning className="auth-logo-icon w-9 h-9 rounded-[12px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 font-heading">ASCEND OS</span>
        </Link>
      </header>

      {/* MAIN CENTERED AUTH CONTENT CONTAINER */}
      <main suppressHydrationWarning className="relative z-10 w-full max-w-md my-auto pt-16 pb-8 auth-card-entrance">
        {children}
      </main>

      {/* BOTTOM ATTRIBUTION */}
      <footer suppressHydrationWarning className="absolute bottom-5 left-0 right-0 text-center z-20">
        <p className="text-[10px] font-mono text-slate-600 tracking-[0.2em] uppercase">
          System v2.0 · Ascendant Protocol Active
        </p>
      </footer>
    </div>
  );
}
