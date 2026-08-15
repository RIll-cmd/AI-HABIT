"use client";

import React from "react";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { CURRENCY_LORE } from "@/features/lore/loreData";

export type CurrencyType =
  | "GOLD"
  | "GEMS"
  | "EXP"
  | "THIRD"
  | "3RD_CURRENCY"
  | "TOWER_TOKENS"
  | "gold"
  | "gems"
  | "exp"
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
  EXP: { src: "/exp_icon/exp_icon.gif", alt: "EXP" },
  exp: { src: "/exp_icon/exp_icon.gif", alt: "EXP" },
  THIRD: { src: "/coin icons/3rd_currency.gif", alt: "Abyssal Tokens" },
  third: { src: "/coin icons/3rd_currency.gif", alt: "Abyssal Tokens" },
  "3RD_CURRENCY": { src: "/coin icons/3rd_currency.gif", alt: "Abyssal Tokens" },
  thirdCurrency: { src: "/coin icons/3rd_currency.gif", alt: "Abyssal Tokens" },
  TOWER_TOKENS: { src: "/coin icons/3rd_currency.gif", alt: "Abyssal Tokens" },
  towerTokens: { src: "/coin icons/3rd_currency.gif", alt: "Abyssal Tokens" },
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
  disableTooltip?: boolean;
}

export function CurrencyDisplay({
  type,
  amount,
  size = "sm",
  className = "",
  iconClassName = "",
  textClassName = "",
  showPlus = false,
  disableTooltip = false,
}: CurrencyDisplayProps) {
  const formattedAmount = typeof amount === "number" ? amount.toLocaleString() : amount;
  const normType = (type || "gold").toLowerCase();
  const loreKey = normType.includes("gem")
    ? "gems"
    : normType.includes("exp")
    ? "exp"
    : normType.includes("tower") || normType.includes("third") || normType === "3rd_currency"
    ? "towerTokens"
    : "gold";

  const lore = CURRENCY_LORE[loreKey];

  const content = (
    <div suppressHydrationWarning className={`inline-flex items-center gap-1.5 font-mono cursor-help ${className}`}>
      <CurrencyIcon type={type} size={size} className={iconClassName} />
      <span className={`font-bold ${textClassName}`}>{formattedAmount}</span>
      {showPlus && <span className="text-[10px] opacity-60">+</span>}
    </div>
  );

  if (disableTooltip || !lore) {
    return content;
  }

  return (
    <SystemTooltip
      title={lore.name}
      category={lore.category}
      rarity={lore.rarity}
      description={lore.description}
      lore={lore.lore}
      mechanics={lore.mechanics}
      stats={[
        { label: "Your Balance", value: formattedAmount, color: "text-amber-400" },
        { label: "Asset Type", value: lore.category }
      ]}
      tags={lore.tags}
    >
      {content}
    </SystemTooltip>
  );
}
