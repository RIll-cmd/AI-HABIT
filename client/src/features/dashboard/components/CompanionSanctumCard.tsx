"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";
import { PixelLightningIcon, PixelFootprintsIcon } from "@/components/ui/pixel/PixelIcons";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import { PixelProgress } from "@/components/ui/pixel/PixelProgress";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";

export function CompanionSanctumCard() {
  const { character } = useCharacterStore();
  const {
    collection,
    syncSteps,
    upgradeBeast,
    hatchEgg,
    isSyncingSteps,
    isUpgrading,
    isHatching,
  } = useBeastStore();

  const equippedBeast = collection?.equippedBeast;
  const activeEgg = collection?.activeEgg;
  const charId = character?.id || "char-id-123";

  const dailySteps = collection?.dailySteps ?? character?.dailySteps ?? 0;
  const dailyStepGoal = collection?.dailyStepGoal ?? character?.dailyStepGoal ?? 10000;
  const dailyProgress = Math.min(100, Math.round((dailySteps / dailyStepGoal) * 100));

  // Calories & distance approximation
  const caloriesBurned = Math.round(dailySteps * 0.04);
  const distanceKm = (dailySteps * 0.00075).toFixed(2);

  // Quick step addition
  const handleQuickAddSteps = async (amount: number) => {
    playUIMenuSFX("confirm");
    await syncSteps(charId, amount, "DASHBOARD_QUICK_ADD");
  };

  // Beast level-up upgrade
  const handleUpgradeBeast = async () => {
    if (!equippedBeast || isUpgrading) return;
    await upgradeBeast(charId, equippedBeast.id);
  };

  // Hatch egg
  const handleHatchEgg = async () => {
    if (!activeEgg || isHatching) return;
    playBuffSFX("levelup");
    await hatchEgg(charId, activeEgg.id);
  };

  return (
    <PixelCard
      title="COMPANION & STEP MATRIX"
      titleBadge={
        <Link
          href="/beasts"
          className="font-pixel text-xs text-white/80 hover:text-white flex items-center gap-1 font-bold"
        >
          <span>Bestiary</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      }
      className="space-y-4"
    >
      {/* 1. COMPANION BIND / EQUIPPED CONTAINER */}
      <div className="p-3.5 bg-[#1A0D2E] border border-[#3b1861] shadow-[inset_2px_2px_0_0_#140a24]">
        {equippedBeast ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* 8-bit Companion Sprite */}
              <div className="w-14 h-14 bg-[#120824] border border-[#3b1861] flex items-center justify-center p-1 relative flex-shrink-0">
                <img
                  src={
                    equippedBeast.spritePath
                      ? equippedBeast.spritePath.replace(".png", ".gif")
                      : "/beasts/beast_1.gif"
                  }
                  alt={equippedBeast.name}
                  className="w-full h-full object-contain animate-pixel-bob"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-[#281545] border border-white text-xs font-pixel text-white font-bold">
                  LV.{equippedBeast.level || 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-pixel text-xs sm:text-sm font-bold text-white truncate">
                    {equippedBeast.name}
                  </h3>
                  <PixelBadge variant="purple" className="text-xs">
                    {equippedBeast.rarity}
                  </PixelBadge>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-pixel text-white font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>
                    +{equippedBeast.statBonusValue}%{" "}
                    {equippedBeast.statBonusType?.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Level up step bar */}
            {(() => {
              const bLevel = equippedBeast.level || 1;
              const bAccum = equippedBeast.accumulatedSteps || 0;
              const effectiveSteps = Math.max(bAccum, dailySteps);
              const bStepReq = equippedBeast.stepUpgradeReq || bLevel * 5000;
              const bGoldReq = equippedBeast.goldUpgradeReq || bLevel * 1000;
              const charGold = character?.gold || 0;

              const stepProgress = Math.min(
                100,
                Math.round((effectiveSteps / bStepReq) * 100)
              );
              const canUpgrade =
                effectiveSteps >= bStepReq && charGold >= bGoldReq && bLevel < 10;

              return (
                <div className="pt-2.5 border-t border-[#3b1861] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-pixel text-white font-bold">
                    <span>STEPS TO LEVEL UP</span>
                    <span>
                      {effectiveSteps.toLocaleString()} / {bStepReq.toLocaleString()}
                    </span>
                  </div>
                  <PixelProgress
                    value={stepProgress}
                    max={100}
                    variant="primary"
                    height="sm"
                  />
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="font-pixel text-xs text-white font-bold">
                      {bGoldReq.toLocaleString()} Gold
                    </span>
                    <PixelButton
                      size="sm"
                      variant={canUpgrade ? "warning" : "dark"}
                      onClick={handleUpgradeBeast}
                      disabled={!canUpgrade || isUpgrading}
                    >
                      {isUpgrading
                        ? "ASCENDING..."
                        : bLevel >= 10
                        ? "MAX LVL"
                        : `UPGRADE LV.${bLevel + 1}`}
                    </PixelButton>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="py-3 text-center space-y-2.5">
            <p className="font-pixel text-xs text-white">
              No Companion currently linked.
            </p>
            <Link href="/beasts">
              <PixelButton size="sm" variant="dark">
                <Plus className="w-3.5 h-3.5 mr-1" /> Bind Companion
              </PixelButton>
            </Link>
          </div>
        )}
      </div>

      {/* 2. DAILY STEPS TRACKER CONTAINER */}
      <div className="p-3.5 bg-[#1A0D2E] border border-[#3b1861] shadow-[inset_2px_2px_0_0_#140a24] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#120824] border border-[#3b1861] flex items-center justify-center text-white">
              <PixelFootprintsIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-pixel text-xs text-white/70 block uppercase">
                DAILY STEPS TRACKER
              </span>
              <span className="font-pixel text-xs sm:text-sm font-bold text-white">
                {dailySteps.toLocaleString()} / {dailyStepGoal.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-pixel text-xs text-white font-bold">
            <span className="px-2 py-0.5 bg-[#120824] border border-[#3b1861]">
              {distanceKm} km
            </span>
            <span className="px-2 py-0.5 bg-[#120824] border border-[#3b1861]">
              {caloriesBurned} kcal
            </span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <PixelProgress
          value={dailyProgress}
          max={100}
          variant="success"
          height="md"
        />

        <div className="flex items-center justify-between font-pixel text-xs text-white font-bold">
          <span>{dailyProgress}% OF DAILY TARGET</span>
          <span>
            {caloriesBurned} kcal • {distanceKm} km
          </span>
        </div>

        {/* Quick Add Step Buttons: [+500], [+1,000], [+2,500] */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <PixelButton
            size="sm"
            variant="dark"
            onClick={() => handleQuickAddSteps(500)}
            disabled={isSyncingSteps}
          >
            +500
          </PixelButton>
          <PixelButton
            size="sm"
            variant="dark"
            onClick={() => handleQuickAddSteps(1000)}
            disabled={isSyncingSteps}
          >
            +1,000
          </PixelButton>
          <PixelButton
            size="sm"
            variant="dark"
            onClick={() => handleQuickAddSteps(2500)}
            disabled={isSyncingSteps}
          >
            +2,500
          </PixelButton>
        </div>
      </div>

      {/* 3. INCUBATION CHAMBER */}
      <div className="p-3.5 bg-[#1A0D2E] border border-[#3b1861] shadow-[inset_2px_2px_0_0_#140a24]">
        {activeEgg ? (
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-between font-pixel text-xs text-white font-bold">
              <span>INCUBATING EGG</span>
              <span>{activeEgg.name}</span>
            </div>
            <PixelProgress
              value={activeEgg.currentSteps ?? activeEgg.current_steps ?? 0}
              max={activeEgg.targetSteps ?? activeEgg.target_steps ?? 5000}
              variant="warning"
              height="sm"
            />
            {((activeEgg.currentSteps ?? activeEgg.current_steps ?? 0) >=
              (activeEgg.targetSteps ?? activeEgg.target_steps ?? 5000) ||
              activeEgg.status === "READY_TO_HATCH") && (
              <PixelButton
                size="sm"
                variant="warning"
                onClick={handleHatchEgg}
                disabled={isHatching}
                className="w-full mt-2 flex items-center justify-center gap-1.5"
              >
                {isHatching ? (
                  "HATCHING..."
                ) : (
                  <>
                    <PixelLightningIcon className="w-3.5 h-3.5" />
                    <span>HATCH EGG</span>
                  </>
                )}
              </PixelButton>
            )}
          </div>
        ) : (
          <div className="py-2 text-center space-y-2">
            <p className="font-pixel text-xs text-white">
              Incubation chamber empty
            </p>
            <Link href="/beasts">
              <PixelButton size="sm" variant="dark">
                <Plus className="w-3.5 h-3.5 mr-1" /> Place Egg in Chamber
              </PixelButton>
            </Link>
          </div>
        )}
      </div>
    </PixelCard>
  );
}

export default CompanionSanctumCard;
