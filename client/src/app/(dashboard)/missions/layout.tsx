"use client";

import React from "react";

export default function MissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full select-none">
      {/* Tavern Pixel Animated Background (Missions only) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/tavern_background.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      >
        {/* Ambient Warm Tavern Glow Overlay */}
        <div className="absolute inset-0 bg-[#120602]/30 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(18,6,2,0.65)_100%)]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
