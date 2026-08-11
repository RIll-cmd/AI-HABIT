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

      {/* INLINE STYLES FOR ANIMATIONS — keeps everything self-contained */}
      <style>{`
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
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: auth-star-twinkle ease-in-out infinite;
        }
        @keyframes auth-star-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.7; transform: scale(1); }
        }

        /* Ambient glow layers */
        .auth-glow-core {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
          animation: auth-glow-pulse 6s ease-in-out infinite;
        }
        .auth-glow-accent {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
          animation: auth-glow-pulse 8s ease-in-out infinite 2s;
        }
        .auth-glow-tertiary {
          background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
          animation: auth-glow-pulse 7s ease-in-out infinite 4s;
        }
        @keyframes auth-glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* Orbital rings */
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
        }
        .auth-orbital-ring-1 {
          width: 500px;
          height: 500px;
          top: -250px;
          left: -250px;
          border-color: rgba(6, 182, 212, 0.08);
          animation: auth-orbital-spin 30s linear infinite;
        }
        .auth-orbital-ring-2 {
          width: 650px;
          height: 650px;
          top: -325px;
          left: -325px;
          border-color: rgba(99, 102, 241, 0.06);
          animation: auth-orbital-spin 45s linear infinite reverse;
        }
        @keyframes auth-orbital-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          font-size: 18px;
          color: rgba(6, 182, 212, 0.12);
          animation: auth-rune-float 6s ease-in-out infinite;
        }
        @keyframes auth-rune-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-15px) rotate(10deg); opacity: 0.25; }
        }

        /* Subtle grid overlay */
        .auth-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 1;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
        }

        /* Card entrance animation */
        .auth-card-entrance {
          animation: auth-card-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes auth-card-slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Logo pulse */
        .auth-logo-icon {
          animation: auth-logo-pulse 3s ease-in-out infinite;
        }
        @keyframes auth-logo-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(6, 182, 212, 0.15); }
        }
      `}</style>
    </div>
  );
}
