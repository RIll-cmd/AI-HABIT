"use client";

import React from "react";

/* =====================================================================
   AUTHENTIC 8-BIT RETRO PIXEL UI ICONS
   ===================================================================== */

/* 1. 8-Bit Pixel Crosshair / Target Icon (16x16) */
export function PixelCrosshairIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="6" y="1" width="4" height="1" />
      <rect x="6" y="14" width="4" height="1" />
      <rect x="1" y="6" width="1" height="4" />
      <rect x="14" y="6" width="1" height="4" />
      <rect x="4" y="2" width="2" height="1" />
      <rect x="10" y="2" width="2" height="1" />
      <rect x="2" y="4" width="1" height="2" />
      <rect x="13" y="4" width="1" height="2" />
      <rect x="2" y="10" width="1" height="2" />
      <rect x="13" y="10" width="1" height="2" />
      <rect x="4" y="13" width="2" height="1" />
      <rect x="10" y="13" width="2" height="1" />
      <rect x="3" y="3" width="1" height="1" />
      <rect x="12" y="3" width="1" height="1" />
      <rect x="3" y="12" width="1" height="1" />
      <rect x="12" y="12" width="1" height="1" />
      <rect x="7" y="3" width="2" height="3" />
      <rect x="7" y="10" width="2" height="3" />
      <rect x="3" y="7" width="3" height="2" />
      <rect x="10" y="7" width="3" height="2" />
      <rect x="7" y="7" width="2" height="2" />
    </svg>
  );
}

/* 2. 8-Bit Pixel Skull Icon (16x16) */
export function PixelSkullIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="1" width="6" height="1" />
      <rect x="3" y="2" width="10" height="2" />
      <rect x="2" y="4" width="12" height="2" />
      <rect x="2" y="6" width="12" height="1" />
      <rect x="2" y="7" width="2" height="3" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="12" y="7" width="2" height="3" />
      <rect x="3" y="10" width="4" height="1" />
      <rect x="9" y="10" width="4" height="1" />
      <rect x="4" y="11" width="8" height="1" />
      <rect x="4" y="12" width="2" height="2" />
      <rect x="7" y="12" width="2" height="2" />
      <rect x="10" y="12" width="2" height="2" />
      <rect x="5" y="14" width="6" height="1" />
    </svg>
  );
}

/* 3. 8-Bit Pixel Hamburger Menu Icon (16x16) */
export function PixelMenuIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="3" width="14" height="2" />
      <rect x="1" y="7" width="14" height="2" />
      <rect x="1" y="11" width="14" height="2" />
    </svg>
  );
}

/* 4. 8-Bit Pixel Close / X Icon (16x16) */
export function PixelCloseIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="12" y="12" width="2" height="2" />
    </svg>
  );
}

/* 5. 8-Bit Pixel Lightning Bolt Icon (16x16) */
export function PixelLightningIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="8" y="1" width="4" height="2" />
      <rect x="7" y="3" width="4" height="2" />
      <rect x="6" y="5" width="5" height="2" />
      <rect x="3" y="7" width="10" height="2" />
      <rect x="5" y="9" width="5" height="2" />
      <rect x="6" y="11" width="3" height="2" />
      <rect x="7" y="13" width="2" height="2" />
    </svg>
  );
}

/* 6. 8-Bit Pixel Footprints / Steps Icon (16x16) */
export function PixelFootprintsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="4" width="3" height="1" />
      <rect x="1" y="5" width="5" height="4" />
      <rect x="2" y="9" width="3" height="1" />
      <rect x="2" y="11" width="3" height="3" />
      <rect x="3" y="14" width="1" height="1" />
      <rect x="10" y="1" width="3" height="1" />
      <rect x="9" y="2" width="5" height="4" />
      <rect x="10" y="6" width="3" height="1" />
      <rect x="10" y="8" width="3" height="3" />
      <rect x="11" y="11" width="1" height="1" />
    </svg>
  );
}

/* 7. 8-Bit Pixel Activity / Bio-Recovery Pulse Icon (16x16) */
export function PixelActivityIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="8" width="4" height="2" />
      <rect x="5" y="5" width="2" height="3" />
      <rect x="6" y="2" width="2" height="3" />
      <rect x="8" y="5" width="2" height="4" />
      <rect x="9" y="9" width="2" height="5" />
      <rect x="11" y="6" width="2" height="4" />
      <rect x="13" y="8" width="3" height="2" />
    </svg>
  );
}

/* 8. 8-Bit Pixel Open Book / Lore Grimoire Icon (16x16) */
export function PixelBookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="3" width="5" height="1" />
      <rect x="9" y="3" width="5" height="1" />
      <rect x="1" y="4" width="6" height="8" />
      <rect x="9" y="4" width="6" height="8" />
      <rect x="7" y="4" width="2" height="9" />
      <rect x="2" y="12" width="5" height="2" />
      <rect x="9" y="12" width="5" height="2" />
      {/* Page lines */}
      <rect x="3" y="6" width="3" height="1" fillOpacity="0.4" />
      <rect x="3" y="8" width="3" height="1" fillOpacity="0.4" />
      <rect x="10" y="6" width="3" height="1" fillOpacity="0.4" />
      <rect x="10" y="8" width="3" height="1" fillOpacity="0.4" />
    </svg>
  );
}

/* 9. 8-Bit Pixel Info / Overview Icon (16x16) */
export function PixelInfoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="1" width="6" height="1" />
      <rect x="3" y="2" width="2" height="1" />
      <rect x="11" y="2" width="2" height="1" />
      <rect x="2" y="3" width="1" height="2" />
      <rect x="13" y="3" width="1" height="2" />
      <rect x="1" y="5" width="1" height="6" />
      <rect x="14" y="5" width="1" height="6" />
      <rect x="2" y="11" width="1" height="2" />
      <rect x="13" y="11" width="1" height="2" />
      <rect x="3" y="13" width="2" height="1" />
      <rect x="11" y="13" width="2" height="1" />
      <rect x="5" y="14" width="6" height="1" />
      {/* Dot */}
      <rect x="7" y="4" width="2" height="2" />
      {/* Stem */}
      <rect x="7" y="7" width="2" height="5" />
      <rect x="6" y="7" width="1" height="1" />
      <rect x="6" y="11" width="4" height="1" />
    </svg>
  );
}

/* 10. 8-Bit Pixel Dumbbell / Improve Icon (16x16) */
export function PixelDumbbellIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left Weight Plates */}
      <rect x="1" y="5" width="2" height="6" />
      <rect x="3" y="4" width="2" height="8" />
      {/* Bar */}
      <rect x="5" y="7" width="6" height="2" />
      {/* Right Weight Plates */}
      <rect x="11" y="4" width="2" height="8" />
      <rect x="13" y="5" width="2" height="6" />
    </svg>
  );
}

/* 11. 8-Bit Pixel Star Icon (16x16) */
export function PixelStarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="7" y="1" width="2" height="3" />
      <rect x="6" y="4" width="4" height="2" />
      <rect x="1" y="6" width="14" height="2" />
      <rect x="3" y="8" width="10" height="2" />
      <rect x="4" y="10" width="8" height="2" />
      <rect x="3" y="12" width="3" height="3" />
      <rect x="10" y="12" width="3" height="3" />
    </svg>
  );
}

/* 12. 8-Bit Pixel Left Chevron (16x16) */
export function PixelChevronLeftIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="10" y="2" width="2" height="2" />
      <rect x="8" y="4" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="6" y="8" width="2" height="2" />
      <rect x="8" y="10" width="2" height="2" />
      <rect x="10" y="12" width="2" height="2" />
    </svg>
  );
}

/* 13. 8-Bit Pixel Right Chevron (16x16) */
export function PixelChevronRightIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="2" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="10" y="7" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="6" y="10" width="2" height="2" />
      <rect x="4" y="12" width="2" height="2" />
    </svg>
  );
}

/* 14. 8-Bit Pixel Sword / Blade Icon (16x16) */
export function PixelSwordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="13" y="1" width="2" height="2" />
      <rect x="11" y="2" width="3" height="2" />
      <rect x="9" y="4" width="3" height="3" />
      <rect x="7" y="6" width="3" height="3" />
      <rect x="5" y="8" width="3" height="3" />
      <rect x="5" y="10" width="4" height="2" />
      <rect x="4" y="11" width="2" height="3" />
      <rect x="3" y="9" width="3" height="2" />
      <rect x="2" y="12" width="3" height="2" />
      <rect x="1" y="14" width="2" height="2" />
    </svg>
  );
}

/* 15. 8-Bit Pixel Shield Icon (16x16) */
export function PixelShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="12" height="2" />
      <rect x="1" y="4" width="14" height="4" />
      <rect x="2" y="8" width="12" height="3" />
      <rect x="4" y="11" width="8" height="2" />
      <rect x="6" y="13" width="4" height="2" />
      <rect x="7" y="15" width="2" height="1" />
      {/* Inner emblem */}
      <rect x="7" y="4" width="2" height="6" fillOpacity="0.4" />
      <rect x="5" y="6" width="6" height="2" fillOpacity="0.4" />
    </svg>
  );
}

/* 16. 8-Bit Pixel Heart Icon (16x16) */
export function PixelHeartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="4" height="2" />
      <rect x="10" y="2" width="4" height="2" />
      <rect x="1" y="4" width="6" height="4" />
      <rect x="9" y="4" width="6" height="4" />
      <rect x="2" y="8" width="12" height="2" />
      <rect x="4" y="10" width="8" height="2" />
      <rect x="6" y="12" width="4" height="2" />
      <rect x="7" y="14" width="2" height="1" />
    </svg>
  );
}

/* 17. 8-Bit Pixel Crown Icon (16x16) */
export function PixelCrownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="4" width="2" height="2" />
      <rect x="7" y="2" width="2" height="2" />
      <rect x="13" y="4" width="2" height="2" />
      <rect x="1" y="6" width="3" height="6" />
      <rect x="12" y="6" width="3" height="6" />
      <rect x="4" y="8" width="8" height="4" />
      <rect x="6" y="4" width="4" height="4" />
      <rect x="2" y="12" width="12" height="2" />
    </svg>
  );
}

/* 18. 8-Bit Pixel Award / Medal Icon (16x16) */
export function PixelAwardIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="1" width="6" height="1" />
      <rect x="3" y="2" width="10" height="6" />
      <rect x="5" y="8" width="6" height="1" />
      <rect x="7" y="4" width="2" height="2" fillOpacity="0.4" />
      {/* Ribbons */}
      <rect x="4" y="9" width="3" height="5" />
      <rect x="9" y="9" width="3" height="5" />
      <rect x="3" y="14" width="2" height="1" />
      <rect x="11" y="14" width="2" height="1" />
    </svg>
  );
}

/* 19. 8-Bit Pixel Sliders / Stat Matrix Icon (16x16) */
export function PixelSlidersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Track 1 */}
      <rect x="2" y="2" width="2" height="12" />
      <rect x="1" y="5" width="4" height="3" />
      {/* Track 2 */}
      <rect x="7" y="2" width="2" height="12" />
      <rect x="6" y="9" width="4" height="3" />
      {/* Track 3 */}
      <rect x="12" y="2" width="2" height="12" />
      <rect x="11" y="3" width="4" height="3" />
    </svg>
  );
}

/* 20. 8-Bit Pixel Tree / Skill Tree Icon (16x16) */
export function PixelTreeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="7" y="1" width="2" height="2" />
      <rect x="5" y="3" width="6" height="2" />
      <rect x="3" y="5" width="10" height="2" />
      <rect x="2" y="7" width="12" height="3" />
      <rect x="4" y="10" width="8" height="2" />
      {/* Trunk */}
      <rect x="7" y="12" width="2" height="3" />
      <rect x="5" y="15" width="6" height="1" />
    </svg>
  );
}

/* 21. 8-Bit Pixel Palette / Customization Icon (16x16) */
export function PixelPaletteIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="1" width="8" height="1" />
      <rect x="2" y="2" width="12" height="2" />
      <rect x="1" y="4" width="14" height="7" />
      <rect x="2" y="11" width="12" height="2" />
      <rect x="4" y="13" width="8" height="2" />
      {/* Paint dots */}
      <rect x="4" y="4" width="2" height="2" fillOpacity="0.4" />
      <rect x="8" y="3" width="2" height="2" fillOpacity="0.4" />
      <rect x="11" y="5" width="2" height="2" fillOpacity="0.4" />
      <rect x="3" y="8" width="2" height="2" fillOpacity="0.4" />
      {/* Thumb hole */}
      <rect x="10" y="9" width="3" height="3" fill="#000" />
    </svg>
  );
}

/* 22. 8-Bit Pixel History / Chronicles Icon (16x16) */
export function PixelHistoryIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Clock outline */}
      <rect x="5" y="1" width="6" height="1" />
      <rect x="3" y="2" width="2" height="1" />
      <rect x="11" y="2" width="2" height="1" />
      <rect x="2" y="3" width="1" height="2" />
      <rect x="13" y="3" width="1" height="2" />
      <rect x="1" y="5" width="1" height="6" />
      <rect x="14" y="5" width="1" height="6" />
      <rect x="2" y="11" width="1" height="2" />
      <rect x="13" y="11" width="1" height="2" />
      <rect x="3" y="13" width="2" height="1" />
      <rect x="11" y="13" width="2" height="1" />
      <rect x="5" y="14" width="6" height="1" />
      {/* Clock Hands */}
      <rect x="7" y="4" width="2" height="4" />
      <rect x="7" y="7" width="4" height="2" />
    </svg>
  );
}

/* 23. 8-Bit Pixel Bot / AIRA Icon (16x16) */
export function PixelBotIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Antenna */}
      <rect x="7" y="1" width="2" height="1" />
      <rect x="7" y="2" width="2" height="2" />
      {/* Head */}
      <rect x="3" y="4" width="10" height="8" />
      {/* Eyes */}
      <rect x="5" y="6" width="2" height="2" fill="#000" />
      <rect x="9" y="6" width="2" height="2" fill="#000" />
      {/* Mouth */}
      <rect x="6" y="10" width="4" height="1" fill="#000" />
      {/* Ears */}
      <rect x="1" y="7" width="2" height="3" />
      <rect x="13" y="7" width="2" height="3" />
    </svg>
  );
}

/* 24. 8-Bit Pixel Lock Icon (16x16) */
export function PixelLockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Shackle */}
      <rect x="5" y="2" width="6" height="2" />
      <rect x="4" y="4" width="2" height="4" />
      <rect x="10" y="4" width="2" height="4" />
      {/* Lock Body */}
      <rect x="2" y="7" width="12" height="8" />
      {/* Keyhole */}
      <rect x="7" y="9" width="2" height="2" fill="#000" />
      <rect x="7" y="11" width="2" height="2" fill="#000" />
    </svg>
  );
}

/* 25. 8-Bit Pixel Sparkles Icon (16x16) */
export function PixelSparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Main Sparkle */}
      <rect x="7" y="1" width="2" height="10" />
      <rect x="3" y="5" width="10" height="2" />
      <rect x="6" y="4" width="4" height="4" />
      {/* Small Sparkle */}
      <rect x="12" y="10" width="2" height="5" />
      <rect x="10" y="12" width="6" height="1" />
      {/* Tiny spark */}
      <rect x="2" y="12" width="2" height="2" />
    </svg>
  );
}

/* 26. 8-Bit Pixel Plus Icon (16x16) */
export function PixelPlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="7" y="2" width="2" height="12" />
      <rect x="2" y="7" width="12" height="2" />
    </svg>
  );
}

/* 27. 8-Bit Pixel Checkmark Icon (16x16) */
export function PixelCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="12" y="3" width="2" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="8" y="7" width="2" height="2" />
      <rect x="6" y="9" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="2" y="5" width="2" height="2" />
    </svg>
  );
}

/* 28. 8-Bit Pixel Check Square Icon (16x16) */
export function PixelCheckSquareIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Border */}
      <rect x="1" y="1" width="14" height="2" />
      <rect x="1" y="13" width="14" height="2" />
      <rect x="1" y="3" width="2" height="10" />
      <rect x="13" y="3" width="2" height="10" />
      {/* Checkmark inside */}
      <rect x="10" y="4" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="6" y="8" width="2" height="2" />
      <rect x="4" y="6" width="2" height="2" />
    </svg>
  );
}

/* 29. 8-Bit Pixel Square Box Icon (16x16) */
export function PixelSquareIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="1" width="14" height="2" />
      <rect x="1" y="13" width="14" height="2" />
      <rect x="1" y="3" width="2" height="10" />
      <rect x="13" y="3" width="2" height="10" />
    </svg>
  );
}

/* 30. 8-Bit Pixel Trash / Delete Icon (16x16) */
export function PixelTrashIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="6" y="1" width="4" height="2" />
      <rect x="2" y="3" width="12" height="2" />
      <rect x="3" y="5" width="10" height="9" />
      <rect x="4" y="14" width="8" height="1" />
      {/* Slots */}
      <rect x="5" y="6" width="1" height="6" fill="#000" fillOpacity="0.4" />
      <rect x="8" y="6" width="1" height="6" fill="#000" fillOpacity="0.4" />
      <rect x="10" y="6" width="1" height="6" fill="#000" fillOpacity="0.4" />
    </svg>
  );
}

/* 31. 8-Bit Pixel Pencil / Edit Icon (16x16) */
export function PixelPencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="11" y="1" width="3" height="3" />
      <rect x="9" y="3" width="3" height="3" />
      <rect x="7" y="5" width="3" height="3" />
      <rect x="5" y="7" width="3" height="3" />
      <rect x="3" y="9" width="3" height="3" />
      <rect x="2" y="12" width="2" height="2" />
      <rect x="1" y="14" width="1" height="1" />
    </svg>
  );
}

/* 32. 8-Bit Pixel Filter Funnel Icon (16x16) */
export function PixelFilterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="1" y="2" width="14" height="2" />
      <rect x="3" y="4" width="10" height="2" />
      <rect x="5" y="6" width="6" height="3" />
      <rect x="7" y="9" width="2" height="5" />
    </svg>
  );
}

/* 33. 8-Bit Pixel Search / Magnifier Icon (16x16) */
export function PixelSearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="1" width="6" height="2" />
      <rect x="2" y="3" width="2" height="6" />
      <rect x="10" y="3" width="2" height="6" />
      <rect x="4" y="9" width="6" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="13" y="13" width="2" height="2" />
    </svg>
  );
}

/* 34. 8-Bit Pixel Tag / Hashtag Icon (16x16) */
export function PixelTagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="2" width="2" height="12" />
      <rect x="10" y="2" width="2" height="12" />
      <rect x="2" y="5" width="12" height="2" />
      <rect x="2" y="9" width="12" height="2" />
    </svg>
  );
}

/* 35. 8-Bit Pixel Gift Icon (16x16) */
export function PixelGiftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Ribbon Bow */}
      <rect x="4" y="1" width="3" height="2" />
      <rect x="9" y="1" width="3" height="2" />
      {/* Box Lid */}
      <rect x="2" y="3" width="12" height="3" />
      {/* Box Body */}
      <rect x="3" y="6" width="10" height="9" />
      {/* Ribbon Cross */}
      <rect x="7" y="3" width="2" height="12" fill="#000" fillOpacity="0.4" />
      <rect x="2" y="4" width="12" height="1" fill="#000" fillOpacity="0.4" />
    </svg>
  );
}

/* 36. 8-Bit Pixel Refresh / Rotate Icon (16x16) */
export function PixelRefreshIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="1" width="6" height="2" />
      <rect x="11" y="2" width="2" height="4" />
      <rect x="11" y="1" width="4" height="2" />
      <rect x="13" y="3" width="2" height="3" />
      <rect x="1" y="4" width="2" height="6" />
      <rect x="13" y="8" width="2" height="4" />
      <rect x="5" y="13" width="6" height="2" />
      <rect x="1" y="10" width="4" height="2" />
      <rect x="3" y="12" width="2" height="3" />
    </svg>
  );
}

/* 37. 8-Bit Pixel Flame Icon (16x16) */
export function PixelFlameIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="7" y="1" width="2" height="2" />
      <rect x="6" y="3" width="3" height="2" />
      <rect x="4" y="5" width="6" height="3" />
      <rect x="3" y="8" width="10" height="4" />
      <rect x="4" y="12" width="8" height="2" />
      <rect x="5" y="14" width="6" height="1" />
      {/* Inner flame */}
      <rect x="7" y="8" width="2" height="4" fillOpacity="0.4" />
    </svg>
  );
}

/* 38. 8-Bit Pixel Coins Icon (16x16) */
export function PixelCoinsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="1" width="8" height="2" />
      <rect x="2" y="3" width="12" height="3" />
      <rect x="2" y="6" width="12" height="2" />
      <rect x="2" y="9" width="12" height="2" />
      <rect x="4" y="11" width="8" height="2" />
      {/* Bottom coin stack */}
      <rect x="2" y="13" width="12" height="2" />
    </svg>
  );
}

/* 39. 8-Bit Pixel Layers Icon (16x16) */
export function PixelLayersIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Top Diamond */}
      <rect x="7" y="1" width="2" height="2" />
      <rect x="5" y="2" width="6" height="2" />
      <rect x="3" y="3" width="10" height="2" />
      <rect x="1" y="4" width="14" height="2" />
      {/* Mid Layer */}
      <rect x="1" y="8" width="14" height="2" />
      {/* Bottom Layer */}
      <rect x="1" y="12" width="14" height="2" />
    </svg>
  );
}

/* 40. 8-Bit Pixel Kanban Columns Icon (16x16) */
export function PixelKanbanIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Column 1 */}
      <rect x="1" y="1" width="3" height="14" />
      {/* Column 2 */}
      <rect x="6" y="1" width="3" height="10" />
      {/* Column 3 */}
      <rect x="11" y="1" width="3" height="12" />
    </svg>
  );
}

/* 41. 8-Bit Pixel Grip / Drag Handle Icon (16x16) */
export function PixelGripIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="5" y="2" width="2" height="2" />
      <rect x="9" y="2" width="2" height="2" />
      <rect x="5" y="6" width="2" height="2" />
      <rect x="9" y="6" width="2" height="2" />
      <rect x="5" y="10" width="2" height="2" />
      <rect x="9" y="10" width="2" height="2" />
      <rect x="5" y="14" width="2" height="2" />
      <rect x="9" y="14" width="2" height="2" />
    </svg>
  );
}

/* 42. 8-Bit Pixel Minimize Icon (16x16) */
export function PixelMinimizeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="7" width="12" height="2" />
    </svg>
  );
}

/* 43. 8-Bit Pixel Maximize Icon (16x16) */
export function PixelMaximizeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="12" height="2" />
      <rect x="2" y="12" width="12" height="2" />
      <rect x="2" y="4" width="2" height="8" />
      <rect x="12" y="4" width="2" height="8" />
    </svg>
  );
}

/* 44. 8-Bit Pixel X / Close Icon (16x16) */
export function PixelXIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="3" y="3" width="2" height="2" />
      <rect x="5" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
    </svg>
  );
}

/* 45. 8-Bit Pixel Save / Floppy Disk Icon (16x16) */
export function PixelSaveIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="2" width="10" height="12" />
      <rect x="12" y="4" width="2" height="10" />
      <rect x="4" y="2" width="6" height="4" fill="#000" />
      <rect x="4" y="8" width="8" height="5" fill="#000" />
      <rect x="5" y="9" width="6" height="3" fill="currentColor" />
    </svg>
  );
}

/* 46. 8-Bit Pixel Calendar Icon (16x16) */
export function PixelCalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="4" y="1" width="2" height="2" />
      <rect x="10" y="1" width="2" height="2" />
      <rect x="2" y="3" width="12" height="12" />
      <rect x="4" y="5" width="8" height="2" fill="#000" />
      <rect x="4" y="8" width="2" height="2" fill="#000" />
      <rect x="7" y="8" width="2" height="2" fill="#000" />
      <rect x="10" y="8" width="2" height="2" fill="#000" />
      <rect x="4" y="11" width="2" height="2" fill="#000" />
      <rect x="7" y="11" width="2" height="2" fill="#000" />
      <rect x="10" y="11" width="2" height="2" fill="#000" />
    </svg>
  );
}

/* 47. 8-Bit Pixel Target Icon (16x16) */
export function PixelTargetIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="6" y="1" width="4" height="2" />
      <rect x="6" y="13" width="4" height="2" />
      <rect x="1" y="6" width="2" height="4" />
      <rect x="13" y="6" width="2" height="4" />
      <rect x="3" y="3" width="3" height="2" />
      <rect x="10" y="3" width="3" height="2" />
      <rect x="3" y="11" width="3" height="2" />
      <rect x="10" y="11" width="3" height="2" />
      <rect x="7" y="7" width="2" height="2" />
    </svg>
  );
}

/* 48. 8-Bit Pixel Arrow Right Icon (16x16) */
export function PixelArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="2" y="7" width="8" height="2" />
      <rect x="8" y="5" width="2" height="2" />
      <rect x="10" y="6" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      <rect x="10" y="8" width="2" height="2" />
      <rect x="8" y="9" width="2" height="2" />
    </svg>
  );
}

/* 49. 8-Bit Pixel Arrow Left Icon (16x16) */
export function PixelArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      <rect x="6" y="7" width="8" height="2" />
      <rect x="6" y="5" width="2" height="2" />
      <rect x="4" y="6" width="2" height="2" />
      <rect x="2" y="7" width="2" height="2" />
      <rect x="4" y="8" width="2" height="2" />
      <rect x="6" y="9" width="2" height="2" />
    </svg>
  );
}

/* 50. 8-Bit Pixel Pushpin / Tack Icon (16x16) */
export function PixelPushpinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Drop Shadow */}
      <rect x="9" y="11" width="3" height="2" fill="#000000" opacity="0.4" />
      <rect x="10" y="13" width="2" height="1" fill="#000000" opacity="0.3" />
      {/* Pin Needle */}
      <rect x="7" y="10" width="2" height="4" fill="#94a3b8" />
      <rect x="7" y="13" width="1" height="2" fill="#cbd5e1" />
      <rect x="8" y="14" width="1" height="1" fill="#475569" />
      {/* Pin Head Rim */}
      <rect x="4" y="8" width="8" height="2" fill="#991b1b" />
      <rect x="5" y="8" width="6" height="1" fill="#dc2626" />
      <rect x="3" y="9" width="10" height="1" fill="#7f1d1d" />
      {/* Pin Head Body */}
      <rect x="5" y="4" width="6" height="4" fill="#dc2626" />
      <rect x="6" y="3" width="4" height="2" fill="#ef4444" />
      <rect x="6" y="3" width="2" height="2" fill="#fca5a5" />
      <rect x="4" y="2" width="8" height="2" fill="#b91c1c" />
      <rect x="5" y="2" width="6" height="1" fill="#ef4444" />
      <rect x="6" y="1" width="4" height="1" fill="#fca5a5" />
      {/* Dark Pixel Outline */}
      <rect x="5" y="0" width="6" height="1" fill="#450a0a" />
      <rect x="3" y="2" width="1" height="2" fill="#450a0a" />
      <rect x="12" y="2" width="1" height="2" fill="#450a0a" />
      <rect x="3" y="10" width="10" height="1" fill="#450a0a" />
      <rect x="9" y="10" width="1" height="4" fill="#334155" />
    </svg>
  );
}

/* 51. 8-Bit Pixel Tavern Hanging Lantern (24x36) */
export function PixelTavernLanternIcon({ className = "w-6 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 36"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Iron Chain Link */}
      <rect x="11" y="0" width="2" height="3" fill="#334155" />
      <rect x="10" y="2" width="4" height="2" fill="#1e293b" />
      <rect x="11" y="4" width="2" height="3" fill="#334155" />
      <rect x="10" y="6" width="4" height="2" fill="#1e293b" />
      <rect x="11" y="8" width="2" height="2" fill="#475569" />

      {/* Top Cap & Finial */}
      <rect x="11" y="9" width="2" height="2" fill="#0f172a" />
      <rect x="9" y="10" width="6" height="2" fill="#1e293b" />
      <rect x="7" y="11" width="10" height="2" fill="#334155" />
      <rect x="5" y="13" width="14" height="2" fill="#0f172a" />
      <rect x="6" y="13" width="12" height="1" fill="#64748b" />

      {/* Glowing Lantern Glass Core */}
      <rect x="6" y="15" width="12" height="13" fill="#f59e0b" />
      <rect x="8" y="17" width="8" height="9" fill="#fbbf24" />
      <rect x="10" y="19" width="4" height="5" fill="#fef08a" />
      <rect x="11" y="20" width="2" height="3" fill="#ffffff" />

      {/* Cast Iron Struts & Cross Grille */}
      <rect x="5" y="15" width="2" height="13" fill="#0f172a" />
      <rect x="17" y="15" width="2" height="13" fill="#0f172a" />
      <rect x="11" y="15" width="2" height="13" fill="#1e293b" />
      <rect x="6" y="20" width="12" height="2" fill="#0f172a" />

      {/* Bottom Base */}
      <rect x="5" y="28" width="14" height="2" fill="#0f172a" />
      <rect x="7" y="30" width="10" height="2" fill="#1e293b" />
      <rect x="10" y="32" width="4" height="2" fill="#0f172a" />
      <rect x="11" y="34" width="2" height="2" fill="#334155" />
    </svg>
  );
}

/* 52. 8-Bit Pixel Heart Crest Sigil (Image 1 Top-Left / Bottom-Right) */
export function PixelHeartCrestIcon({ className = "w-16 h-4 text-[#4a3560]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 12"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left dashes & diamond */}
      <rect x="4" y="5" width="2" height="2" opacity="0.6" />
      <rect x="8" y="5" width="4" height="2" opacity="0.8" />
      <rect x="14" y="4" width="2" height="4" opacity="0.9" />
      <rect x="16" y="5" width="4" height="2" opacity="0.8" />

      {/* Center Heart Crest */}
      <rect x="21" y="2" width="3" height="2" />
      <rect x="25" y="2" width="3" height="2" />
      <rect x="20" y="3" width="9" height="3" />
      <rect x="21" y="6" width="7" height="2" />
      <rect x="22" y="8" width="5" height="2" />
      <rect x="23" y="10" width="3" height="1" />
      <rect x="24" y="11" width="1" height="1" />

      {/* Right dashes & diamond */}
      <rect x="29" y="5" width="4" height="2" opacity="0.8" />
      <rect x="33" y="4" width="2" height="4" opacity="0.9" />
      <rect x="37" y="5" width="4" height="2" opacity="0.8" />
      <rect x="43" y="5" width="2" height="2" opacity="0.6" />
    </svg>
  );
}

/* 53. 8-Bit Pixel Clover / Triad Crest Sigil (Image 1 Top-Right) */
export function PixelCloverCrestIcon({ className = "w-16 h-4 text-[#4a3560]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 12"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left arrows */}
      <rect x="4" y="5" width="2" height="2" opacity="0.5" />
      <rect x="8" y="4" width="2" height="4" opacity="0.8" />
      <rect x="12" y="3" width="2" height="6" opacity="0.9" />
      <rect x="15" y="5" width="4" height="2" opacity="0.8" />

      {/* Center 3-Leaf / Triad Crest */}
      <rect x="23" y="1" width="3" height="3" />
      <rect x="19" y="5" width="4" height="3" />
      <rect x="26" y="5" width="4" height="3" />
      <rect x="22" y="4" width="5" height="5" />
      <rect x="23" y="9" width="3" height="3" />

      {/* Right arrows */}
      <rect x="30" y="5" width="4" height="2" opacity="0.8" />
      <rect x="35" y="3" width="2" height="6" opacity="0.9" />
      <rect x="39" y="4" width="2" height="4" opacity="0.8" />
      <rect x="43" y="5" width="2" height="2" opacity="0.5" />
    </svg>
  );
}

/* 54. 8-Bit Pixel Crossed Axes / X Crest Sigil (Image 1 Bottom-Left) */
export function PixelAxesCrestIcon({ className = "w-16 h-4 text-[#4a3560]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 12"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left side flourish */}
      <rect x="5" y="5" width="2" height="2" opacity="0.5" />
      <rect x="9" y="3" width="4" height="6" opacity="0.8" />
      <rect x="10" y="2" width="2" height="8" opacity="0.8" />
      <rect x="15" y="5" width="3" height="2" opacity="0.7" />

      {/* Center Cross / X Axes */}
      <rect x="20" y="2" width="3" height="3" />
      <rect x="26" y="2" width="3" height="3" />
      <rect x="22" y="4" width="5" height="4" />
      <rect x="20" y="7" width="3" height="3" />
      <rect x="26" y="7" width="3" height="3" />

      {/* Right side flourish */}
      <rect x="31" y="5" width="3" height="2" opacity="0.7" />
      <rect x="36" y="3" width="4" height="6" opacity="0.8" />
      <rect x="37" y="2" width="2" height="8" opacity="0.8" />
      <rect x="42" y="5" width="2" height="2" opacity="0.5" />
    </svg>
  );
}

/* 55. 8-Bit Pixel Winged / Royal Crest Sigil */
export function PixelWingedCrestIcon({ className = "w-16 h-4 text-[#4a3560]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 12"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left Wing */}
      <rect x="4" y="2" width="4" height="2" opacity="0.7" />
      <rect x="7" y="4" width="5" height="2" opacity="0.8" />
      <rect x="11" y="5" width="6" height="2" opacity="0.9" />
      <rect x="15" y="7" width="4" height="2" />

      {/* Center Crown / Gem */}
      <rect x="23" y="1" width="3" height="2" />
      <rect x="20" y="3" width="9" height="3" />
      <rect x="22" y="6" width="5" height="3" />
      <rect x="23" y="9" width="3" height="2" />

      {/* Right Wing */}
      <rect x="30" y="7" width="4" height="2" />
      <rect x="32" y="5" width="6" height="2" opacity="0.9" />
      <rect x="37" y="4" width="5" height="2" opacity="0.8" />
      <rect x="41" y="2" width="4" height="2" opacity="0.7" />
    </svg>
  );
}

/* 56. 8-Bit Pixel Wax Seal Stamp Icon (20x20) */
export function PixelWaxSealIcon({ className = "w-6 h-6 text-red-600" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Irregular Wax Edges */}
      <rect x="6" y="1" width="8" height="2" />
      <rect x="4" y="3" width="12" height="2" />
      <rect x="2" y="5" width="16" height="10" />
      <rect x="1" y="7" width="18" height="6" />
      <rect x="4" y="15" width="12" height="2" />
      <rect x="6" y="17" width="8" height="2" />
      {/* Inner Stamp Recess */}
      <rect x="5" y="5" width="10" height="10" fill="#7f1d1d" opacity="0.5" />
      <rect x="7" y="7" width="6" height="6" fill="#fef08a" opacity="0.9" />
      <rect x="8" y="8" width="4" height="4" fill="#991b1b" />
    </svg>
  );
}



