"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Package,
} from "lucide-react";
import {
  PixelCrosshairIcon,
  PixelSkullIcon,
  PixelFootprintsIcon,
  PixelActivityIcon,
  PixelSwordIcon,
} from "@/components/ui/pixel/PixelIcons";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useHabitStore } from "@/features/habits/store/useHabitStore";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { useBossStore } from "@/features/bosses/store/useBossStore";
import { useBeastStore } from "@/features/beasts/store/useBeastStore";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { getEnemySpritePath } from "@/utils/sprites";
import { PaperDoll } from "@/features/inventory/components/PaperDoll";
import { MissionCard } from "@/features/habits/components/MissionCard";
import { DashboardQuestCard } from "@/features/habits/components/DashboardQuestCard";
import { CompanionSanctumCard } from "./CompanionSanctumCard";
import { PixelCard } from "@/components/ui/pixel/PixelCard";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import { PixelProgress } from "@/components/ui/pixel/PixelProgress";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useKanbanMissionStore } from "@/features/habits/store/useKanbanMissionStore";

// Radar Chart for Attributes in 8-Bit Wireframe
function RadarChart({
  data,
}: {
  data: { name: string; value: number; fullMark: number }[];
}) {
  const size = 150;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (Math.min(100, Math.max(10, d.value)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  });

  const polygonPoints = points.join(" ");

  return (
    <div className="relative flex items-center justify-center w-full h-[150px]">
      <svg
        width={size}
        height={size}
        className="overflow-visible"
      >
        {/* Hexagon Web Lines */}
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const webPoints = data
            .map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = radius * scale;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={scale}
              points={webPoints}
              fill="none"
              stroke="#4a2175"
              strokeWidth="1.5"
              strokeDasharray={scale === 1 ? "none" : "2,2"}
            />
          );
        })}

        {/* Axis Spokes */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#4a2175"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(255, 255, 255, 0.2)"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Data Vertices */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const r = (Math.min(100, Math.max(10, d.value)) / 100) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <rect
              key={i}
              x={x - 2}
              y={y - 2}
              width="4"
              height="4"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="1"
            />
          );
        })}

        {/* Attribute Labels */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 14;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white font-pixel text-[11px] font-bold"
            >
              {d.name.slice(0, 3).toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function DashboardOverview() {
  const router = useRouter();
  const { character } = useCharacterStore();
  const { items } = useInventoryStore();
  const { todayMissions, executeMissionCompletion, isLoading } =
    useHabitStore();
  const { floors } = useTowerStore();
  const { bosses, isLoading: isBossesLoading } = useBossStore();
  const { collection } = useBeastStore();
  const { quests } = useKanbanMissionStore();
  const { muscleRecovery } = useWorkoutStore();

  const [missionViewFilter, setMissionViewFilter] = useState<
    "all" | "habits" | "missions"
  >("all");

  const completedHabitsCount = todayMissions.filter(
    (m) => m.status === "COMPLETED"
  ).length;
  const totalHabitsCount = todayMissions.length;

  const completedQuestsCount = quests.filter(
    (q) => q.status === "Completed"
  ).length;
  const totalQuestsCount = quests.length;

  const combinedTotalCount = totalHabitsCount + totalQuestsCount;
  const combinedCompletedCount = completedHabitsCount + completedQuestsCount;

  const currentTotalCount =
    missionViewFilter === "all"
      ? combinedTotalCount
      : missionViewFilter === "habits"
      ? totalHabitsCount
      : totalQuestsCount;

  const currentCompletedCount =
    missionViewFilter === "all"
      ? combinedCompletedCount
      : missionViewFilter === "habits"
      ? completedHabitsCount
      : completedQuestsCount;

  const radarData = [
    {
      name: "STR",
      value: character?.stats?.strength || 18,
      fullMark: 100,
    },
    {
      name: "END",
      value: character?.stats?.endurance || 15,
      fullMark: 100,
    },
    {
      name: "DIS",
      value: character?.stats?.discipline || 22,
      fullMark: 100,
    },
    {
      name: "KNO",
      value: character?.stats?.knowledge || 14,
      fullMark: 100,
    },
    {
      name: "FOC",
      value: character?.stats?.focus || 16,
      fullMark: 100,
    },
    {
      name: "REC",
      value: character?.stats?.recovery || 20,
      fullMark: 100,
    },
  ];

  return (
    <div
      suppressHydrationWarning
      className="space-y-6 max-w-7xl mx-auto select-none"
    >
      <div
        suppressHydrationWarning
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start"
      >
        {/* ========================================================= */}
        {/* COLUMN 1: CHARACTER, ARMOR & ATTRIBUTES */}
        {/* ========================================================= */}
        <div suppressHydrationWarning className="space-y-5">
          <PixelCard title="CHARACTER" className="space-y-4">
            {/* Portrait & Symmetrical Item Slots Viewport */}
            <div className="mb-2">
              <PaperDoll equippedItems={items.filter((i) => i.isEquipped)} />
            </div>

            {/* Power Score Counter */}
            <div className="p-3.5 bg-[#1A0D2E] border border-[#3b1861] shadow-[inset_2px_2px_0_0_#140a24] flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center gap-2 font-pixel text-xs text-white uppercase tracking-wider">
                <PixelSwordIcon className="w-4 h-4 text-white" />
                <span>POWER</span>
              </div>
              <div className="text-4xl sm:text-5xl font-bold pixel-text-outlined text-white mt-1 text-center">
                <NumberTicker value={character?.power || 97} />
              </div>
            </div>

            {/* Title and Guild */}
            <div className="grid grid-cols-2 gap-2 font-pixel text-xs p-3 bg-[#1A0D2E] border border-[#3b1861]">
              <div>
                <span className="text-white/70 block text-xs uppercase">TITLE</span>
                <span className="text-white font-bold truncate block mt-0.5">
                  {character?.title || "Hydration Monarch"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-white/70 block text-xs uppercase">GUILD</span>
                <span className="text-white font-bold truncate block mt-0.5">
                  Lone Ascendants
                </span>
              </div>
            </div>

            {/* Familiar Link Section */}
            <div className="p-3 bg-[#1A0D2E] border border-[#3b1861] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-[#120824] border border-[#3b1861] flex items-center justify-center text-white flex-shrink-0">
                  <PixelFootprintsIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-pixel text-white/70 block uppercase tracking-wider">
                    FAMILIAR LINK
                  </span>
                  <span className="text-xs sm:text-sm font-pixel text-white font-bold truncate block">
                    {collection?.equippedBeast
                      ? collection.equippedBeast.name
                      : "No Companion Linked"}
                  </span>
                </div>
              </div>
              <Link href="/beasts">
                <PixelButton size="sm" variant="dark">
                  {collection?.equippedBeast
                    ? `+${collection.equippedBeast.statBonusValue}%`
                    : "Incubate"}
                </PixelButton>
              </Link>
            </div>

            {/* Bio-Recovery Telemetry Section */}
            <div className="p-3 bg-[#1A0D2E] border border-[#3b1861] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-[#120824] border border-[#3b1861] flex items-center justify-center text-white flex-shrink-0">
                  <PixelActivityIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-pixel text-white/70 block uppercase tracking-wider">
                    BIO-RECOVERY TELEMETRY
                  </span>
                  <span className="text-xs sm:text-sm font-pixel text-white font-bold block">
                    {muscleRecovery?.summary.overallFreshness ?? 100}% Fresh (
                    {muscleRecovery?.summary.freshCount ?? 16}/16 Ready)
                  </span>
                </div>
              </div>
              <Link href="/workouts">
                <PixelButton size="sm" variant="dark">
                  Scanner
                </PixelButton>
              </Link>
            </div>

            {/* Attributes Matrix */}
            <div className="pt-2 border-t-2 border-black/40 space-y-3">
              <h3 className="text-xs font-pixel text-white uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-3.5 bg-[#22c55e] inline-block shadow-[1px_1px_0_0_#000]" />
                ATTRIBUTES
              </h3>

              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Stats List */}
                <div className="space-y-2">
                  {radarData.map((stat) => (
                    <div key={stat.name} className="space-y-1 font-pixel text-xs">
                      <div className="flex justify-between text-white font-bold">
                        <span>{stat.name}</span>
                        <span>{stat.value}</span>
                      </div>
                      <PixelProgress
                        value={stat.value}
                        max={100}
                        variant="primary"
                        height="sm"
                      />
                    </div>
                  ))}
                </div>

                {/* Radar Chart */}
                <div className="flex items-center justify-center p-1 bg-[#120824] border border-[#3b1861] shadow-[inset_2px_2px_0_0_#000]">
                  <RadarChart data={radarData} />
                </div>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: TODAY'S MISSIONS & CURRENT BOSS */}
        {/* ========================================================= */}
        <div suppressHydrationWarning className="space-y-5">
          {/* Today's Missions Card */}
          <PixelCard
            title="TODAY'S MISSIONS"
            titleBadge={
              <PixelBadge variant="purple">
                {currentCompletedCount}/{currentTotalCount} CLEARED
              </PixelBadge>
            }
            className="flex flex-col min-h-[460px]"
          >
            {/* Filter Tabs: ALL / HABITS / MISSIONS */}
            <div className="grid grid-cols-3 gap-2 mb-3.5 bg-[#120824] p-1.5 border border-[#3b1861]">
              <PixelButton
                size="sm"
                variant={missionViewFilter === "all" ? "purple" : "dark"}
                onClick={() => setMissionViewFilter("all")}
                className="text-xs"
              >
                ALL ({combinedTotalCount})
              </PixelButton>
              <PixelButton
                size="sm"
                variant={missionViewFilter === "habits" ? "purple" : "dark"}
                onClick={() => setMissionViewFilter("habits")}
                className="text-xs"
              >
                HABITS ({totalHabitsCount})
              </PixelButton>
              <PixelButton
                size="sm"
                variant={missionViewFilter === "missions" ? "purple" : "dark"}
                onClick={() => setMissionViewFilter("missions")}
                className="text-xs"
              >
                MISSIONS ({totalQuestsCount})
              </PixelButton>
            </div>

            {/* Scrollable Missions List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
              {isLoading ? (
                <div className="py-8 text-center font-pixel text-xs text-white animate-pulse">
                  Loading missions & habits...
                </div>
              ) : (
                (() => {
                  const displayHabits =
                    missionViewFilter === "all" || missionViewFilter === "habits"
                      ? todayMissions
                      : [];
                  const displayQuests =
                    missionViewFilter === "all" || missionViewFilter === "missions"
                      ? quests
                      : [];
                  const hasAny = displayHabits.length > 0 || displayQuests.length > 0;

                  if (!hasAny) {
                    return (
                      <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-10 h-10 bg-[#120824] border border-[#3b1861] flex items-center justify-center text-white">
                          <PixelCrosshairIcon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-pixel text-xs text-white max-w-xs">
                          {missionViewFilter === "habits"
                            ? "No active habits scheduled for today."
                            : missionViewFilter === "missions"
                            ? "No custom missions created yet."
                            : "No active missions or habits for today."}
                        </p>
                        <Link
                          href={
                            missionViewFilter === "habits"
                              ? "/habits/create"
                              : "/missions"
                          }
                        >
                          <PixelButton size="sm" variant="dark">
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            {missionViewFilter === "habits"
                              ? "Add Habit"
                              : "Create Mission"}
                          </PixelButton>
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Habit Mission Cards */}
                      {displayHabits.map((mission) => (
                        <div key={`habit-${mission.id}`}>
                          <MissionCard
                            mission={mission}
                            onComplete={(id, habit, completionType) =>
                              executeMissionCompletion(id, habit, completionType)
                            }
                          />
                        </div>
                      ))}

                      {/* Custom Kanban Mission Cards */}
                      {displayQuests.map((quest) => (
                        <div key={`quest-${quest.id}`}>
                          <DashboardQuestCard quest={quest} />
                        </div>
                      ))}
                    </>
                  );
                })()
              )}
            </div>

            {/* Daily Completion Progress */}
            <div className="mt-4 pt-3 border-t-2 border-black/40 space-y-1.5">
              <div className="flex items-center justify-between font-pixel text-xs text-white uppercase font-bold">
                <span>DAILY COMPLETION</span>
                <Package className="w-4 h-4 text-white" />
              </div>
              <PixelProgress
                value={
                  currentTotalCount > 0
                    ? (currentCompletedCount / currentTotalCount) * 100
                    : 0
                }
                max={100}
                variant="primary"
                height="sm"
              />
            </div>
          </PixelCard>

          {/* Current Boss Card */}
          <PixelCard title="CURRENT BOSS" variant="danger">
            {(() => {
              const activeBoss =
                bosses.find((b) => b.status === "ACTIVE") || bosses[0];
              if (isBossesLoading && bosses.length === 0) {
                return (
                  <div className="py-6 text-center font-pixel text-xs text-white animate-pulse">
                    Scanning active boss threats...
                  </div>
                );
              }

              if (!activeBoss) {
                return (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-[#330c12] border border-[#7f1d1d] flex items-center justify-center text-white">
                      <PixelSkullIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-pixel text-xs text-white">
                      No active boss threat targeted.
                    </p>
                    <PixelButton
                      size="sm"
                      variant="error"
                      onClick={() => router.push("/bosses")}
                    >
                      <PixelSkullIcon className="w-3.5 h-3.5 mr-1" />
                      Summon Boss
                    </PixelButton>
                  </div>
                );
              }

              const hpPercent = Math.max(
                0,
                Math.min(100, (activeBoss.currentHp / activeBoss.maxHp) * 100)
              );
              const damageDealt = activeBoss.maxHp - activeBoss.currentHp;
              const contributionPct =
                activeBoss.maxHp > 0
                  ? ((damageDealt / activeBoss.maxHp) * 100).toFixed(1)
                  : "0.0";

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Boss Sprite */}
                    <div className="w-16 h-16 bg-[#2a0a10] border border-black flex items-center justify-center flex-shrink-0 p-1">
                      <img
                        src={getEnemySpritePath(activeBoss.name, 1, true)}
                        alt={activeBoss.name}
                        className="w-full h-full object-contain animate-pixel-bob"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-pixel text-sm font-bold text-white truncate">
                        {activeBoss.name}
                      </h3>
                      <p className="font-pixel text-xs text-white/80 mt-0.5">
                        {activeBoss.difficulty} • {activeBoss.category}
                      </p>
                      <div className="font-pixel text-xs text-white font-bold mt-1">
                        CONTRIBUTION: {contributionPct}%
                      </div>
                    </div>
                  </div>

                  {/* HP Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-pixel text-xs text-white font-bold">
                      <span>
                        {activeBoss.currentHp.toLocaleString()} /{" "}
                        {activeBoss.maxHp.toLocaleString()} HP
                      </span>
                      <span>{hpPercent.toFixed(1)}%</span>
                    </div>
                    <PixelProgress
                      value={hpPercent}
                      max={100}
                      variant="danger"
                      height="sm"
                    />
                  </div>

                  <PixelButton
                    size="sm"
                    variant="error"
                    className="w-full"
                    onClick={() => router.push("/bosses")}
                  >
                    View Boss Details
                  </PixelButton>
                </div>
              );
            })()}
          </PixelCard>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: COMPANION SANCTUM & TOWER OF ASCENSION */}
        {/* ========================================================= */}
        <div suppressHydrationWarning className="space-y-5 flex flex-col">
          {/* Companion & Step Matrix Hub */}
          <CompanionSanctumCard />

          {/* Tower of Ascension Card */}
          <PixelCard
            title="TOWER OF ASCENSION"
            titleBadge={
              <PixelBadge variant="purple">
                {(() => {
                  const sorted = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);
                  const activeFloor =
                    sorted.find(
                      (f) => f.status === "AVAILABLE" || f.status === "ATTEMPTED"
                    ) || sorted[0];
                  return activeFloor ? `FLOOR ${activeFloor.floorNumber}` : "1";
                })()}
              </PixelBadge>
            }
          >
            {(() => {
              const sortedTowerFloors = [...floors].sort(
                (a, b) => a.floorNumber - b.floorNumber
              );
              const activeFloor =
                sortedTowerFloors.find(
                  (f) => f.status === "AVAILABLE" || f.status === "ATTEMPTED"
                ) || sortedTowerFloors[0];

              if (!activeFloor) {
                return (
                  <div className="py-6 text-center font-pixel text-xs text-white animate-pulse">
                    Loading Tower Data...
                  </div>
                );
              }

              const enemyName =
                activeFloor.enemy?.name ||
                `Floor ${activeFloor.floorNumber} Guardian`;
              const enemyDesc = `Level ${
                activeFloor.enemy?.level || activeFloor.floorNumber
              } ${
                activeFloor.isBoss ? "Boss Threat" : "Tower Sentinel"
              }. Defeat to claim ascension rewards.`;
              const towerTokensReward =
                activeFloor.towerTokensReward ||
                activeFloor.floorNumber * 10 * (activeFloor.isBoss ? 3 : 1);

              return (
                <div className="space-y-3">
                  <div className="p-3 bg-[#1A0D2E] border border-[#3b1861] space-y-2">
                    <div className="flex items-center justify-between font-pixel text-xs">
                      <span className="text-white font-bold">{enemyName}</span>
                      <span className="text-white font-bold">
                        REQ: {activeFloor.requiredPower.toLocaleString()}
                      </span>
                    </div>

                    <p className="font-pixel text-xs text-white/80 line-clamp-2">
                      {enemyDesc}
                    </p>

                    <div className="flex items-center justify-between font-pixel text-xs pt-1.5 text-white font-bold border-t border-[#3b1861]">
                      <span>REWARD</span>
                      <span>+{towerTokensReward} Tokens</span>
                    </div>
                  </div>

                  <Link href="/tower" className="block w-full">
                    <PixelButton size="sm" variant="purple" className="w-full">
                      Challenge Floor {activeFloor.floorNumber}
                    </PixelButton>
                  </Link>
                </div>
              );
            })()}
          </PixelCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
