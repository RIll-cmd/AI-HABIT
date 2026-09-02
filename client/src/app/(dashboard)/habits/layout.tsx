"use client";

import React from "react";

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full select-none">
      {/* Mountain Monastery Animated Pixel Art Background (Habits & Subroutes Only) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/mountain_monastery_bg.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      >
        {/* Subtle Ambient Mist & Vignette Overlay */}
        <div className="absolute inset-0 bg-[#1f242b]/35 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(29,45,42,0.65)_100%)]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
