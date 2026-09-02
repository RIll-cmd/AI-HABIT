"use client";

import React from "react";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full select-none">
      {/* Clockwork Steampunk Animated Sanctuary Video/GIF Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 scale-105 filter contrast-125 brightness-75 select-none pointer-events-none"
        >
          <source src="/clockwork.mp4" type="video/mp4" />
        </video>

        {/* Ambient Warm Obsidian & Copper Radial Vignette Overlay */}
        <div className="absolute inset-0 bg-[#0e0704]/65 bg-[radial-gradient(ellipse_at_center,_transparent_15%,_rgba(18,8,4,0.8)_70%,_rgba(10,4,2,0.95)_100%)]" />

        {/* Subtle Horizontal Machined Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />
      </div>

      {/* Main Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
