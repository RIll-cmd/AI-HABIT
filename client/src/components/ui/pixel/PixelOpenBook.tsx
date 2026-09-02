"use client";

import React from "react";

/**
 * 8-Bit Pixel Art Open Book Frame
 * Programmatically recreated vector pixel art matching the reference grimoire:
 * - Rich dark mahogany leather hardcover with bottom spine dip
 * - 4 Beveled Gold Corner Plates with specular highlights & deep shadows
 * - Two open parchment pages with center spine fold & stacked page thickness lines
 */
export function PixelOpenBookSvg({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 408 276"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated" }}
      preserveAspectRatio="none"
    >
      <defs>
        {/* Parchment subtle gradient */}
        <linearGradient id="leftPageGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E5D3A7" />
          <stop offset="12%" stopColor="#EFE3C3" />
          <stop offset="90%" stopColor="#EFE3C3" />
          <stop offset="100%" stopColor="#D4BE8D" />
        </linearGradient>

        <linearGradient id="rightPageGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4BE8D" />
          <stop offset="10%" stopColor="#EFE3C3" />
          <stop offset="88%" stopColor="#EFE3C3" />
          <stop offset="100%" stopColor="#E2CF9F" />
        </linearGradient>

        {/* Center Spine Crease Gradient */}
        <linearGradient id="spineShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B39968" />
          <stop offset="40%" stopColor="#6E4A28" />
          <stop offset="50%" stopColor="#4A2F17" />
          <stop offset="60%" stopColor="#6E4A28" />
          <stop offset="100%" stopColor="#B39968" />
        </linearGradient>
      </defs>

      {/* =========================================================
          1. OUTER LEATHER HARDCOVER (MAHOGANY / DARK BURGUNDY)
          ========================================================= */}
      {/* Outer Black Outline */}
      <rect x="0" y="0" width="408" height="268" rx="2" fill="#240E0E" />
      <rect x="180" y="266" width="48" height="10" rx="2" fill="#240E0E" />

      {/* Main Leather Cover Body */}
      <rect x="2" y="2" width="404" height="264" fill="#481F1E" />
      <rect x="182" y="264" width="44" height="10" fill="#481F1E" />

      {/* Leather Inner Bevel & Highlights */}
      <rect x="4" y="4" width="400" height="2" fill="#662F2E" />
      <rect x="4" y="4" width="2" height="260" fill="#662F2E" />
      <rect x="4" y="262" width="400" height="2" fill="#2C1212" />
      <rect x="402" y="4" width="2" height="260" fill="#2C1212" />
      <rect x="184" y="266" width="40" height="6" fill="#361515" />

      {/* =========================================================
          2. PARCHMENT PAGES BACKGROUND (LEFT & RIGHT PAGES)
          ========================================================= */}
      {/* Left Page Outer Edge Shadow & Page Underlay */}
      <rect x="14" y="12" width="186" height="246" fill="#D6C091" />
      {/* Left Page Main Parchment */}
      <rect x="16" y="14" width="182" height="242" fill="url(#leftPageGrad)" />
      {/* Left Page Top-Left Cutout & Turning Shadow */}
      <polygon points="16,14 56,14 16,54" fill="#E2CF9F" />
      <polygon points="16,30 112,14 16,170" fill="#E5D5AA" fillOpacity="0.4" />
      <polygon points="16,130 190,230 16,240" fill="#D9C496" fillOpacity="0.5" />

      {/* Center Spine Binding Crease */}
      <rect x="198" y="12" width="12" height="248" fill="url(#spineShadow)" />
      <line x1="204" y1="12" x2="204" y2="260" stroke="#382110" strokeWidth="1.5" />

      {/* Right Page Main Parchment */}
      <rect x="210" y="14" width="180" height="242" fill="url(#rightPageGrad)" />

      {/* Right Stacked Pages Edge Lines (Page Thickness) */}
      <rect x="388" y="16" width="6" height="238" fill="#D6C091" />
      <line x1="390" y1="18" x2="390" y2="252" stroke="#B89F70" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="392" y1="20" x2="392" y2="250" stroke="#A88E60" strokeWidth="1" strokeDasharray="6 3" />
      <line x1="394" y1="22" x2="394" y2="248" stroke="#8C7246" strokeWidth="1" />

      {/* Page Perimeter Inset Borders */}
      <rect x="17" y="15" width="180" height="240" fill="none" stroke="#B89F70" strokeWidth="1" strokeOpacity="0.35" />
      <rect x="211" y="15" width="176" height="240" fill="none" stroke="#B89F70" strokeWidth="1" strokeOpacity="0.35" />

      {/* Bottom Page Curve Trim Line */}
      <path
        d="M 16 256 Q 107 253 198 260 Q 289 253 390 256"
        fill="none"
        stroke="#4A2F17"
        strokeWidth="1.5"
      />

      {/* =========================================================
          3. 4 BEVELED GOLD PIXEL CORNER BRACKETS
          ========================================================= */}
      {/* TOP-LEFT GOLD CORNER */}
      <g>
        <polygon points="0,0 30,0 30,8 12,8 12,28 0,28" fill="#240E0E" />
        <polygon points="2,2 28,2 28,6 10,6 10,26 2,26" fill="#D9A834" />
        <polygon points="2,2 26,2 26,4 6,4 6,24 2,24" fill="#FDF0A6" />
        <rect x="4" y="4" width="4" height="4" fill="#FFFFFF" />
        <polygon points="8,6 28,6 28,8 10,8 10,26 8,26" fill="#9E6E1C" />
        <rect x="10" y="8" width="4" height="4" fill="#5E3F0A" />
      </g>

      {/* TOP-RIGHT GOLD CORNER */}
      <g>
        <polygon points="408,0 378,0 378,8 396,8 396,28 408,28" fill="#240E0E" />
        <polygon points="406,2 380,2 380,6 398,6 398,26 406,26" fill="#D9A834" />
        <polygon points="406,2 382,2 382,4 402,4 402,24 406,24" fill="#FDF0A6" />
        <rect x="400" y="4" width="4" height="4" fill="#FFFFFF" />
        <polygon points="400,6 380,6 380,8 398,8 398,26 400,26" fill="#9E6E1C" />
        <rect x="394" y="8" width="4" height="4" fill="#5E3F0A" />
      </g>

      {/* BOTTOM-LEFT GOLD CORNER */}
      <g>
        <polygon points="0,268 30,268 30,260 12,260 12,240 0,240" fill="#240E0E" />
        <polygon points="2,266 28,266 28,262 10,262 10,242 2,242" fill="#D9A834" />
        <polygon points="2,266 6,266 6,244 2,244" fill="#FDF0A6" />
        <rect x="4" y="260" width="4" height="4" fill="#FFFFFF" />
        <polygon points="6,266 28,266 28,262 10,262 10,242 8,242 8,264" fill="#9E6E1C" />
        <rect x="10" y="258" width="4" height="4" fill="#5E3F0A" />
      </g>

      {/* BOTTOM-RIGHT GOLD CORNER */}
      <g>
        <polygon points="408,268 378,268 378,260 396,260 396,240 408,240" fill="#240E0E" />
        <polygon points="406,266 380,266 380,262 398,262 398,242 406,242" fill="#D9A834" />
        <polygon points="402,266 406,266 406,244 402,244" fill="#FDF0A6" />
        <rect x="400" y="260" width="4" height="4" fill="#FFFFFF" />
        <polygon points="402,266 380,266 380,262 398,262 398,242 400,242 400,264" fill="#9E6E1C" />
        <rect x="394" y="258" width="4" height="4" fill="#5E3F0A" />
      </g>
    </svg>
  );
}

/**
 * 8-Bit Pixel Page Leaf Background for the Flipping Page
 */
export function PixelPageLeafSvg({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DFCB9C" />
          <stop offset="8%" stopColor="#EFE3C3" />
          <stop offset="92%" stopColor="#EFE3C3" />
          <stop offset="100%" stopColor="#E5D3A7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="190" height="250" fill="url(#leafGrad)" />
      <rect x="1" y="1" width="188" height="248" stroke="#B89F70" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="188" y1="4" x2="188" y2="246" stroke="#C2A976" strokeWidth="1.5" />
    </svg>
  );
}
