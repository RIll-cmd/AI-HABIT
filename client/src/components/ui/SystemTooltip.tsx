"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  BookOpen,
  Shield,
  Zap,
  Target,
  Flame,
  Info,
  Activity,
  Dumbbell,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export interface SystemTooltipStat {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SystemTooltipProps {
  title: string;
  subtitle?: string;
  category?: string;
  lore?: string;
  description?: string;
  mechanics?: string;
  stats?: SystemTooltipStat[];
  tags?: string[];
  rarity?: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  accentColor?: string;
  side?: "top" | "bottom" | "left" | "right";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  widthClass?: string;
  delayMs?: number;
}

const RARITY_GRADIENTS: Record<string, string> = {
  COMMON: "from-slate-500 to-slate-600",
  UNCOMMON: "from-emerald-500 to-teal-500",
  RARE: "from-cyan-500 to-blue-500",
  EPIC: "from-purple-500 to-indigo-500",
  LEGENDARY: "from-amber-400 to-orange-500",
  MYTHIC: "from-red-500 via-purple-500 to-cyan-400",
};

const RARITY_BORDERS: Record<string, string> = {
  COMMON: "border-slate-700/80 shadow-[0_0_30px_rgba(0,0,0,0.8)]",
  UNCOMMON: "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.25)]",
  RARE: "border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]",
  EPIC: "border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.35)]",
  LEGENDARY: "border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.4)]",
  MYTHIC: "border-red-500/70 shadow-[0_0_45px_rgba(239,68,68,0.45)]",
};

interface TabSection {
  id: "overview" | "lore" | "mechanics" | "stats";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function SystemTooltip({
  title,
  subtitle,
  category,
  lore,
  description,
  mechanics,
  stats = [],
  tags = [],
  rarity = "RARE",
  accentColor,
  side = "top",
  icon,
  children,
  className = "",
  widthClass = "w-[340px] sm:w-[380px] max-w-[92vw]",
  delayMs = 800,
}: SystemTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const borderStyle = RARITY_BORDERS[rarity] || RARITY_BORDERS.RARE;
  const gradientHeader = RARITY_GRADIENTS[rarity] || RARITY_GRADIENTS.RARE;

  // Build list of active tabs dynamically
  const availableTabs: TabSection[] = [];
  if (description) {
    availableTabs.push({ id: "overview", label: "Overview", icon: Info });
  }
  if (lore) {
    availableTabs.push({ id: "lore", label: "Lore", icon: BookOpen });
  }
  if (mechanics) {
    availableTabs.push({ id: "mechanics", label: "Mechanics", icon: Zap });
  }
  if (stats && stats.length > 0) {
    availableTabs.push({ id: "stats", label: "Attributes", icon: Star });
  }

  // Ensure index is within bounds
  const currentTab = availableTabs[activeTabIndex] || availableTabs[0];

  const handleNextTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (availableTabs.length > 1) {
      setActiveTabIndex((prev) => (prev + 1) % availableTabs.length);
    }
  };

  const handlePrevTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (availableTabs.length > 1) {
      setActiveTabIndex((prev) => (prev - 1 + availableTabs.length) % availableTabs.length);
    }
  };

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    const tooltipWidth = tooltipEl?.offsetWidth || 360;
    const tooltipHeight = tooltipEl?.offsetHeight || 280;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const padding = 16;

    // Horizontal centering over the trigger
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenterX - tooltipWidth / 2;

    // Clamp horizontal position strictly within viewport
    if (left < padding) {
      left = padding;
    } else if (left + tooltipWidth > windowWidth - padding) {
      left = windowWidth - tooltipWidth - padding;
    }

    // Vertical positioning with smart auto-flip
    const spaceAbove = triggerRect.top;
    const spaceBelow = windowHeight - triggerRect.bottom;
    let top = 0;

    if (side === "bottom") {
      if (spaceBelow >= tooltipHeight + 12 || spaceBelow >= spaceAbove) {
        top = triggerRect.bottom + 8;
      } else {
        top = triggerRect.top - tooltipHeight - 8;
      }
    } else {
      // Default: side === "top"
      if (spaceAbove >= tooltipHeight + 12 || spaceAbove >= spaceBelow) {
        top = triggerRect.top - tooltipHeight - 8;
      } else {
        top = triggerRect.bottom + 8;
      }
    }

    // Clamp vertical position so it never overflows viewport
    if (top < padding) {
      top = padding;
    } else if (top + tooltipHeight > windowHeight - padding) {
      top = windowHeight - tooltipHeight - padding;
    }

    setPositionStyle({
      position: "fixed",
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      zIndex: 999999,
      maxHeight: `min(540px, ${windowHeight - padding * 2}px)`,
    });
  }, [side]);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!isOpen && !openTimerRef.current) {
      openTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        openTimerRef.current = null;
      }, delayMs);
    }
  };

  const handleMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (isOpen) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        closeTimerRef.current = null;
      }, 150);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 150);
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      const handleScrollOrResize = () => {
        calculatePosition();
      };
      window.addEventListener("scroll", handleScrollOrResize, { passive: true, capture: true });
      window.addEventListener("resize", handleScrollOrResize, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isOpen, calculatePosition]);

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex items-center focus-within:outline-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}

      {/* FLOATING HOVER CARD RENDERED VIA PORTAL OUTSIDE PARENT CONTAINER BOUNDS */}
      {mounted && isOpen && typeof document !== "undefined" && createPortal(
        <div
          ref={tooltipRef}
          tabIndex={-1}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          className={`pointer-events-auto ${widthClass} overflow-y-auto custom-scrollbar rounded-2xl bg-[#090E1F]/98 border ${borderStyle} p-4 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.95)] backdrop-blur-3xl font-sans select-none text-left flex flex-col gap-2.5 animate-in fade-in-0 zoom-in-95 duration-150`}
          style={{
            ...positionStyle,
            ...(accentColor ? { borderColor: `${accentColor}80` } : {})
          }}
        >
          {/* Glow Halo Top Accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${gradientHeader}`}
            style={accentColor ? { background: accentColor } : undefined}
          />

          {/* Top Header & Title */}
          <div className="flex items-start gap-3 pt-1">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/10 flex-shrink-0 flex items-center justify-center p-1.5 shadow-inner">
                {icon}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                {category && (
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded-md">
                    {category}
                  </span>
                )}
                {rarity && (
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-700/80 px-1.5 py-0.5 rounded-md">
                    {rarity}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-white font-heading tracking-tight leading-snug break-words">
                {title}
              </h4>

              {subtitle && (
                <p className="text-[11px] text-cyan-400/90 font-mono font-medium mt-0.5 break-words">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Section Tabs Header */}
          {availableTabs.length > 1 && (
            <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar flex-1">
                {availableTabs.map((tab, idx) => {
                  const IconComponent = tab.icon;
                  const isActive = idx === activeTabIndex;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setActiveTabIndex(idx);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        isActive
                          ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                      }`}
                    >
                      <IconComponent className={`w-3 h-3 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Page Stepper */}
              <div className="flex items-center gap-0.5 pl-1.5 border-l border-slate-800 flex-shrink-0">
                <button
                  type="button"
                  onClick={handlePrevTab}
                  className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
                  title="Previous section"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9.5px] font-mono text-slate-500 font-bold px-1">
                  {activeTabIndex + 1}/{availableTabs.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
                  title="Next section"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Active Tab Content */}
          <div className="animate-in fade-in zoom-in-95 duration-150">
            {currentTab?.id === "overview" && description && (
              <div className="text-xs text-slate-200/95 font-sans leading-relaxed whitespace-pre-line break-words bg-slate-900/60 p-3 rounded-xl border border-white/5 min-h-[72px]">
                {description}
              </div>
            )}

            {currentTab?.id === "lore" && lore && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#121936] to-[#0A0E1C] border border-purple-500/30 text-[11.5px] text-slate-200 italic leading-relaxed relative overflow-hidden shadow-inner whitespace-normal break-words min-h-[72px]">
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-purple-300 uppercase tracking-widest mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>SYSTEM ARCHIVE LORE</span>
                </div>
                &ldquo;{lore}&rdquo;
              </div>
            )}

            {currentTab?.id === "mechanics" && mechanics && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-200 font-mono leading-relaxed whitespace-normal break-words min-h-[72px]">
                <span className="text-amber-400 font-bold block text-[9.5px] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  SYSTEM MECHANICS & IMPACT:
                </span>
                {mechanics}
              </div>
            )}

            {currentTab?.id === "stats" && stats && stats.length > 0 && (
              <div className="p-3 rounded-xl bg-[#070D1E] border border-cyan-500/25 space-y-2 min-h-[72px]">
                <span className="text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  ATTRIBUTES & BREAKDOWN
                </span>
                <div className="flex flex-col gap-1.5">
                  {stats.map((s, idx) => {
                    const IconComponent = s.icon || Star;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono"
                      >
                        <span className="text-slate-400 flex items-center gap-1.5 flex-shrink-0">
                          <IconComponent className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span>{s.label}</span>
                        </span>
                        <span className={`font-bold text-right break-words ${s.color || "text-emerald-400"}`}>
                          {s.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Bottom Explorer Navigation */}
          {availableTabs.length > 1 && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span className="text-[9.5px] font-mono text-slate-500">
                Explore: {activeTabIndex + 1} of {availableTabs.length}
              </span>
              <button
                type="button"
                onClick={handleNextTab}
                className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/30 hover:border-cyan-400 transition-colors shadow-sm"
              >
                <span>Next: {availableTabs[(activeTabIndex + 1) % availableTabs.length]?.label}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Tags Footer */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/40">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[9px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

