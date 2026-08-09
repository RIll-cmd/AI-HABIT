"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  User,
  Sword,
  Shield,
  Circle,
  Shirt,
  Footprints,
  Gem,
  CheckCircle2,
  Check,
  X,
  Plus,
  Play,
  Clock,
  Activity,
  Bot,
  Skull,
  Crosshair,
  Timer,
  Sparkles,
  Package
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useHabitStore } from "@/features/habits/store";
import { MissionCard } from "@/features/habits/components/MissionCard";
import { RadarChart } from "@/components/RadarChart";
import { playSystemOpen } from "@/features/audio/useSystemAudio";
import { PaperDoll } from "@/features/inventory/components";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { useCombatStats } from "@/features/inventory/hooks/useCombatStats";
import { useTowerStore } from "@/features/tower/store/useTowerStore";

export function DashboardOverview() {
  const router = useRouter();
  const { character, loadCharacter } = useCharacterStore();
  const { items, fetchInventory } = useInventoryStore();
  const finalStats = useCombatStats();
  
  const { todayMissions, loadTodayMissions, executeMissionCompletion, isLoading } =
    useHabitStore();

  const { floors, fetchFloors, selectFloor } = useTowerStore();

  useEffect(() => {
    loadCharacter("char-id-123");
    loadTodayMissions("char-id-123");
    fetchInventory("char-id-123");
    fetchFloors("char-id-123");
  }, [loadCharacter, loadTodayMissions, fetchInventory, fetchFloors]);

  const totalMissionsCount = todayMissions.length;
  const completedMissionsCount = todayMissions.filter(
    (m) => m.status === "COMPLETED"
  ).length;

  const radarData = [
    { name: "Strength", value: finalStats.strength },
    { name: "Endurance", value: finalStats.endurance },
    { name: "Discipline", value: finalStats.discipline },
    { name: "Knowledge", value: finalStats.knowledge },
    { name: "Recovery", value: finalStats.recovery },
    { name: "Focus", value: finalStats.focus },
    { name: "Consistency", value: finalStats.consistency },
  ];

  return (
    <div className="space-y-6">
      {/* MAIN 3-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================================= */}
        {/* COLUMN 1: CHARACTER & ATTRIBUTES */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="rounded-[24px] bg-[#0B1020] border border-white/10 overflow-hidden shadow-2xl p-5 flex flex-col">
            <h2 className="text-sm font-bold text-slate-300 font-heading tracking-wider mb-4 uppercase">Character</h2>
            
            {/* Portrait & Equip Slots Container */}
            <div className="mb-4">
               <PaperDoll equippedItems={items.filter(i => i.isEquipped)} />
            </div>

            {/* Power Score */}
            <div className="flex flex-col mt-2">
               <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] tracking-widest uppercase">
                 <Sword className="w-3.5 h-3.5" />
                 <span>POWER</span>
               </div>
               <div className="text-4xl font-bold font-mono text-purple-400 mt-1 shadow-purple-500/50 drop-shadow-md">
                 {character?.power?.toLocaleString() || "5,870"}
               </div>
            </div>

            {/* Title and Guild */}
            <div className="flex items-end justify-between mt-4 pb-2 border-b border-white/5">
              <div>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">TITLE</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-purple-300 text-xs font-semibold">{character?.title || "Shadow Seeker"}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">GUILD</p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-slate-300 text-xs font-semibold">Lone Ascendants</span>
                </div>
              </div>
            </div>

            {/* Attributes Matrix */}
            <div className="mt-4 pt-2">
              <h3 className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-4">ATTRIBUTES</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Stats List */}
                <div className="space-y-3">
                  {radarData.map((stat, i) => {
                     const colors = ["bg-blue-500", "bg-blue-600", "bg-amber-500", "bg-cyan-500", "bg-emerald-500", "bg-purple-500", "bg-amber-400"];
                     return (
                      <div key={stat.name} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors[i]}`} />
                        <span className="text-[10px] text-slate-300 flex-1">{stat.name}</span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[i]}`} style={{ width: `${stat.value}%` }} />
                        </div>
                        <span className="text-xs font-mono font-bold text-white w-5 text-right">{stat.value}</span>
                      </div>
                     );
                  })}
                </div>

                {/* Radar Chart */}
                <div className="flex items-center justify-center">
                  <RadarChart data={radarData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: MISSIONS & BOSS */}
        {/* ========================================================= */}
        <div className="space-y-4">
          
          {/* Today's Missions */}
          <div className="rounded-[24px] bg-[#0B1020] border border-white/10 overflow-hidden shadow-2xl p-5 flex flex-col h-[400px]">
             <h2 className="text-sm font-bold text-slate-300 font-heading tracking-wider mb-4 uppercase">Today's Missions</h2>
             
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
               {isLoading ? (
                  <div className="py-6 text-center text-xs text-slate-400">Loading missions...</div>
                ) : todayMissions.length > 0 ? (
                  todayMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onComplete={(id, habit, completionType) =>
                        executeMissionCompletion(id, habit, completionType)
                      }
                    />
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                    <p className="text-xs">No active missions for today.</p>
                    <Button variant="outline" size="sm" asChild className="text-xs border-white/10">
                      <Link href="/missions/create"><Plus className="w-3.5 h-3.5 mr-1" /> Add Mission</Link>
                    </Button>
                  </div>
                )}
             </div>

             {/* Daily Completion */}
             <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase mb-2">
                  <span>DAILY COMPLETION</span>
                  <div className="w-4 h-4 text-amber-500"><Package className="w-4 h-4"/></div>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${totalMissionsCount > 0 ? (completedMissionsCount / totalMissionsCount) * 100 : 0}%` }} 
                  />
                </div>
             </div>
          </div>

          {/* Current Boss */}
          <div className="rounded-[24px] bg-[#0B1020] border border-white/10 overflow-hidden shadow-2xl p-5">
            <h2 className="text-sm font-bold text-slate-300 font-heading tracking-wider mb-4 uppercase">Current Boss</h2>
            
            <div className="flex gap-4">
               {/* Boss Image Placeholder */}
               <div className="w-28 h-28 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.1)] relative overflow-hidden">
                  <Skull className="w-12 h-12 text-purple-500/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent" />
               </div>

               {/* Boss Info */}
               <div className="flex flex-col justify-center flex-1">
                 <h3 className="text-sm font-bold text-white font-heading">Procrastination King</h3>
                 <p className="text-[10px] text-slate-400 font-mono">Lv. 25 Boss</p>
                 
                 <div className="mt-3">
                   <div className="flex justify-between text-[10px] font-mono text-purple-300 mb-1">
                     <span>7,420 / 10,000 HP</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mb-1">
                     <div className="h-full bg-purple-600 w-[74.2%]" />
                   </div>
                   <div className="text-[9px] text-emerald-400 font-mono">YOUR CONTRIBUTION 26.0%</div>
                 </div>

                 <Button className="mt-3 w-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-xs h-7">
                   View Boss Details
                 </Button>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[24px] bg-[#0B1020] border border-white/10 overflow-hidden shadow-2xl p-4">
             <h2 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">QUICK ACTIONS</h2>
             <div className="grid grid-cols-6 gap-2">
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                 <div className="w-8 h-8 rounded-lg bg-[#151C33] border border-white/5 flex items-center justify-center"><Play className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Start<br/>Workout</span>
               </button>
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                 <div className="w-8 h-8 rounded-lg bg-[#151C33] border border-white/5 flex items-center justify-center"><Timer className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Focus<br/>Timer</span>
               </button>
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                 <div className="w-8 h-8 rounded-lg bg-[#151C33] border border-white/5 flex items-center justify-center"><Activity className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Log<br/>Activity</span>
               </button>
               <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                 <div className="w-8 h-8 rounded-lg bg-[#151C33] border border-white/5 flex items-center justify-center"><Bot className="w-4 h-4 text-purple-400" /></div>
                 <span className="text-[9px] text-center leading-tight">AI<br/>Advice</span>
               </button>
               <Link href="/missions/create" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                 <div className="w-8 h-8 rounded-lg bg-[#151C33] border border-white/5 flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                 <span className="text-[9px] text-center leading-tight">Add<br/>Mission</span>
               </Link>
               <Link href="/habits/create" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                 <div className="w-8 h-8 rounded-lg bg-[#151C33] border border-white/5 flex items-center justify-center"><Plus className="w-4 h-4 text-cyan-400" /></div>
                 <span className="text-[9px] text-center leading-tight">Create<br/>Habit</span>
               </Link>
             </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: TOWER OF ASCENSION */}
        {/* ========================================================= */}
        <div className="space-y-4 flex flex-col h-full">
          <div className="rounded-[24px] bg-[#0B1020] border border-white/10 overflow-hidden shadow-2xl p-5 flex flex-col flex-1 relative">
            
            {/* Tower Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#151C33]/50 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-sm font-bold text-slate-300 font-heading tracking-wider uppercase">Tower of Ascension</h2>
              <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400 text-[10px]">i</div>
            </div>
            
            {/* Tower Floors */}
            <div className="flex-1 flex flex-col gap-3 relative z-10">
              {(() => {
                const sortedTowerFloors = [...floors].sort((a, b) => a.floorNumber - b.floorNumber);
                const activeFloor = sortedTowerFloors.find((f) => f.status === "AVAILABLE" || f.status === "ATTEMPTED") || sortedTowerFloors[0];
                const nextFloor = activeFloor ? sortedTowerFloors.find((f) => f.floorNumber === activeFloor.floorNumber + 1) : null;
                const previousFloors = activeFloor
                  ? sortedTowerFloors.filter((f) => f.floorNumber < activeFloor.floorNumber).slice(-3).reverse()
                  : [];

                if (!activeFloor) {
                  return (
                    <div className="text-center text-xs text-slate-500 py-6 font-mono">
                      Loading Tower Data...
                    </div>
                  );
                }

                return (
                  <>
                    {/* Next Floor (Locked) */}
                    {nextFloor && (
                      <div className="p-3 rounded-2xl border border-white/5 bg-[#151C33]/50 text-center relative overflow-hidden opacity-50">
                        <div className="text-[11px] font-mono text-slate-400 font-bold">Floor {nextFloor.floorNumber}</div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">LOCKED</div>
                      </div>
                    )}

                    {/* Active Floor (Current Challengeable Floor) */}
                    <div className="p-4 rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-900/20 to-blue-900/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center gap-4 relative overflow-hidden group">
                      <div className="w-16 h-16 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <Skull className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white font-heading">Floor {activeFloor.floorNumber}</div>
                        <div className="text-[10px] text-purple-300 font-mono mb-2">{activeFloor.enemy?.name || `Floor ${activeFloor.floorNumber} Guardian`}</div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          Req. Power <span className="text-amber-400 ml-1 font-bold">{activeFloor.requiredPower.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Button
                          size="sm"
                          onClick={() => {
                            selectFloor(activeFloor);
                            router.push("/tower");
                          }}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-8 px-4 rounded-xl shadow-lg shadow-purple-600/30"
                        >
                          Enter Floor
                        </Button>
                      </div>
                    </div>

                    {/* Previous Cleared/Attempted Floors */}
                    {previousFloors.length > 0 ? (
                      previousFloors.map((floor) => (
                        <div key={floor.id} className="py-2.5 px-4 flex items-center justify-between border-b border-white/5 last:border-0">
                          <div>
                            <div className="text-[11px] font-mono text-slate-300 font-bold">Floor {floor.floorNumber}</div>
                            <div className="text-[9px] font-mono text-emerald-500 uppercase mt-0.5 tracking-wider">
                              {floor.status === "CLEARED" ? "CLEARED" : floor.status}
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-3 text-center text-[10px] text-slate-500 font-mono">
                        Begin your ascent on Floor 1!
                      </div>
                    )}

                    {/* Active Floor Rewards Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
                      <h3 className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-3">FLOOR {activeFloor.floorNumber} REWARDS</h3>
                      <div className="flex items-center justify-around gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-center">
                            <Circle className="w-4 h-4 text-amber-400 fill-amber-400"/>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 mt-1">{activeFloor.goldReward} Gold</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-center transform rotate-45">
                            <Gem className="w-4 h-4 text-purple-400 -rotate-45"/>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 mt-1">{activeFloor.expReward} EXP</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
