"use client";

import React from "react";
import { getEnemySpritePath } from "@/utils/sprites";

interface EnemySpriteIconProps {
  enemyName: string;
  floorOrLevel?: number;
  isBoss?: boolean;
  className?: string;
  size?: number; // Optional custom dimensions in pixels
  flipX?: boolean;
}

/**
 * Reusable Enemy & Boss Sprite Icon Component.
 * Ensures single-frame isolated cropping of enemy and boss sprites across
 * Tower floor cards, Boss widgets, and face-off battle previews.
 */
export const EnemySpriteIcon: React.FC<EnemySpriteIconProps> = ({
  enemyName,
  floorOrLevel = 1,
  isBoss = false,
  className = "w-full h-full",
  size,
  flipX = false,
}) => {
  const spritePath = getEnemySpritePath(enemyName, floorOrLevel, isBoss);

  const containerStyle: React.CSSProperties = {
    ...(size ? { width: `${size}px`, height: `${size}px` } : {}),
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={containerStyle}
    >
      <img
        src={spritePath}
        alt={enemyName || "Enemy"}
        className={`w-full h-full object-contain transition-transform duration-200 ${
          flipX ? "-scale-x-100" : ""
        }`}
      />
    </div>
  );
};
