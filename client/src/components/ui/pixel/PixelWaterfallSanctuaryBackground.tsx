"use client";

import React, { useEffect, useRef, useState } from "react";

/* 4-Point 8-Bit Cross Sparkle Star */
function PixelSparkle({
  x,
  y,
  size = 1,
  delay = 0,
}: {
  x: number;
  y: number;
  size?: number;
  delay?: number;
}) {
  return (
    <div
      className="absolute select-none pointer-events-none animate-pixel-star z-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        transform: `translate(-50%, -50%) scale(${size})`,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ imageRendering: "pixelated" }}>
        <rect x="6" y="6" width="3" height="3" fill="#FFFFFF" />
        <rect x="6" y="3" width="3" height="3" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="6" y="9" width="3" height="3" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="3" y="6" width="3" height="3" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="9" y="6" width="3" height="3" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="7" y="0" width="1" height="3" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="7" y="12" width="1" height="3" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="0" y="7" width="3" height="1" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="12" y="7" width="3" height="1" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    </div>
  );
}

export function PixelWaterfallSanctuaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animated mist & lantern ember particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle types: 'mist' (lavender/cyan mist in gorge) and 'ember' (warm golden pagoda lantern glow)
    interface Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      maxAlpha: number;
      color: string;
      life: number;
      maxLife: number;
      type: "mist" | "ember" | "waterspray";
    }

    const particles: Particle[] = [];
    const maxParticles = 55;

    const spawnParticle = (): Particle => {
      const isEmber = Math.random() < 0.35;
      const isSpray = Math.random() < 0.25;

      if (isEmber) {
        // Spawn near pagoda chalet region (left/mid-left)
        return {
          x: width * (0.15 + Math.random() * 0.3),
          y: height * (0.25 + Math.random() * 0.4),
          size: Math.random() < 0.7 ? 2 : 3,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(0.3 + Math.random() * 0.6),
          alpha: 0.1,
          maxAlpha: 0.7 + Math.random() * 0.3,
          color: Math.random() < 0.6 ? "#fbbf24" : "#f59e0b",
          life: 0,
          maxLife: 180 + Math.random() * 120,
          type: "ember",
        };
      } else if (isSpray) {
        // Falling water spray in the waterfall ravine
        return {
          x: width * (0.2 + Math.random() * 0.6),
          y: height * (0.4 + Math.random() * 0.5),
          size: Math.random() < 0.8 ? 2 : 4,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 1.2 + Math.random() * 1.5,
          alpha: 0.1,
          maxAlpha: 0.5 + Math.random() * 0.3,
          color: Math.random() < 0.5 ? "#c7d8f8" : "#89a6d8",
          life: 0,
          maxLife: 100 + Math.random() * 80,
          type: "waterspray",
        };
      } else {
        // Rising misty foam in the lower gorge
        return {
          x: width * Math.random(),
          y: height * (0.65 + Math.random() * 0.35),
          size: 3 + Math.floor(Math.random() * 4) * 2, // Stepped pixel squares
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(0.2 + Math.random() * 0.4),
          alpha: 0.05,
          maxAlpha: 0.35 + Math.random() * 0.25,
          color: Math.random() < 0.5 ? "#a5b4fc" : "#93c5fd",
          life: 0,
          maxLife: 220 + Math.random() * 140,
          type: "mist",
        };
      }
    };

    // Initial batch
    for (let i = 0; i < maxParticles; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife; // Stagger lifecycle
      particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Disable anti-aliasing for crisp 8-bit retro pixel rendering
      ctx.imageSmoothingEnabled = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in and out
        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else if (progress > 0.8) {
          p.alpha = ((1 - progress) / 0.2) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        if (p.life >= p.maxLife) {
          particles[i] = spawnParticle();
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        // Draw crisp pixel square
        const pixelSize = p.size;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), pixelSize, pixelSize);
      }

      ctx.globalAlpha = 1.0;
      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      suppressHydrationWarning
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. AUTHENTIC 8-BIT NOCTURNAL WATERFALL SANCTUARY PIXEL ARTWORK */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/sanctuary_waterfalls_pixel.jpg')",
          imageRendering: "pixelated",
          filter: "contrast(1.06) brightness(0.92)",
        }}
      />

      {/* 2. ATMOSPHERIC TWILIGHT INDIGO & PURPLE VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#140826]/75 via-[#0b0517]/80 to-[#07030e]/92 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(24,10,42,0.25)_0%,_rgba(6,2,12,0.85)_100%)]" />

      {/* 3. PAGODA LANTERN EMBER GLOW AURAS */}
      <div className="absolute top-[18%] left-[12%] sm:left-[16%] w-72 h-72 bg-gradient-radial from-amber-400/25 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-lantern-flicker" />
      <div className="absolute top-[32%] left-[22%] sm:left-[26%] w-60 h-60 bg-gradient-radial from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-2xl pointer-events-none animate-lantern-flicker" style={{ animationDelay: "1.2s" }} />

      {/* 4. WATERFALL RAVINE MIST GLOWS */}
      <div className="absolute bottom-[5%] left-[25%] w-[450px] h-[320px] bg-gradient-radial from-indigo-500/15 via-purple-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-[15%] w-[400px] h-[280px] bg-gradient-radial from-cyan-600/10 via-indigo-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 5. CANVAS RENDERED 8-BIT MIST & LANTERN PARTICLES */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 6. NIGHT SKY CROSS SPARKLE STARS */}
      {mounted && (
        <>
          <PixelSparkle x={68} y={8} size={1.3} delay={0.2} />
          <PixelSparkle x={82} y={12} size={0.9} delay={1.4} />
          <PixelSparkle x={92} y={6} size={1.1} delay={0.8} />
          <PixelSparkle x={54} y={14} size={0.8} delay={2.1} />
          <PixelSparkle x={42} y={9} size={1.0} delay={1.7} />
          <PixelSparkle x={88} y={22} size={0.85} delay={0.5} />
          <PixelSparkle x={60} y={20} size={1.15} delay={1.2} />
          
          {/* Subtle twinkle pixel squares */}
          {[
            { x: 48, y: 6 },
            { x: 58, y: 11 },
            { x: 74, y: 16 },
            { x: 80, y: 7 },
            { x: 96, y: 14 },
            { x: 64, y: 5 },
          ].map((dot, i) => (
            <div
              key={`sky-star-${i}`}
              className="absolute w-1 h-1 bg-white shadow-[1px_1px_0_0_#000] animate-pixel-star pointer-events-none"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                animationDelay: `${(i * 0.4) % 3}s`,
                opacity: 0.85,
              }}
            />
          ))}
        </>
      )}

      {/* 7. CRT ARCADE SCANLINE & RASTER GRID OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 255, 0, 0.03))",
          backgroundSize: "100% 3px, 4px 100%",
        }}
      />

      {/* 8. CRT VIGNETTE BEVEL EDGES */}
      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />
    </div>
  );
}

export default PixelWaterfallSanctuaryBackground;
