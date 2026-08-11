"use client";

import React from "react";

export type CurrencyType =
  | "GOLD"
  | "GEMS"
  | "THIRD"
  | "3RD_CURRENCY"
  | "TOWER_TOKENS"
  | "gold"
  | "gems"
  | "third"
  | "thirdCurrency"
  | "towerTokens";

interface CurrencyIconProps {
  type: CurrencyType;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | number;
}

const CURRENCY_GIF_PATHS: Record<string, { src: string; alt: string }> = {
  GOLD: { src: "/coin icons/gold_icon.gif", alt: "Gold" },
  gold: { src: "/coin icons/gold_icon.gif", alt: "Gold" },
  GEMS: { src: "/coin icons/gem_icon.gif", alt: "Gems" },
  gems: { src: "/coin icons/gem_icon.gif", alt: "Gems" },
  THIRD: { src: "/coin icons/3rd_currency.gif", alt: "3rd Currency" },
  third: { src: "/coin icons/3rd_currency.gif", alt: "3rd Currency" },
  "3RD_CURRENCY": { src: "/coin icons/3rd_currency.gif", alt: "3rd Currency" },
  thirdCurrency: { src: "/coin icons/3rd_currency.gif", alt: "3rd Currency" },
  TOWER_TOKENS: { src: "/coin icons/3rd_currency.gif", alt: "3rd Currency" },
  towerTokens: { src: "/coin icons/3rd_currency.gif", alt: "3rd Currency" },
};

const SIZE_CLASSES: Record<string, string> = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function CurrencyIcon({ type, className = "", size = "sm" }: CurrencyIconProps) {
  const normType = type ? type.toUpperCase() : "GOLD";
  const info = CURRENCY_GIF_PATHS[normType] || CURRENCY_GIF_PATHS[type] || CURRENCY_GIF_PATHS.GOLD;

  const sizeClass = typeof size === "string" ? SIZE_CLASSES[size] || "w-4 h-4" : "";
  const inlineStyle = typeof size === "number" ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      suppressHydrationWarning
      className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${sizeClass} ${className}`}
      style={inlineStyle}
    >
      <img
        src={info.src}
        alt={info.alt}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

interface CurrencyDisplayProps {
  type: CurrencyType;
  amount: number | string;
  size?: "xs" | "sm" | "md" | "lg" | number;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showPlus?: boolean;
}

export function CurrencyDisplay({
  type,
  amount,
  size = "sm",
  className = "",
  iconClassName = "",
  textClassName = "",
  showPlus = false,
}: CurrencyDisplayProps) {
  const formattedAmount = typeof amount === "number" ? amount.toLocaleString() : amount;

  return (
    <div suppressHydrationWarning className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      <CurrencyIcon type={type} size={size} className={iconClassName} />
      <span className={`font-bold ${textClassName}`}>{formattedAmount}</span>
      {showPlus && <span className="text-[10px] opacity-60">+</span>}
    </div>
  );
}

