"use client";

import { useEffect } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { 
  Lock, 
  Swords, 
  CheckCircle2, 
  Crown,
  ChevronRight,
  ShieldAlert,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BattleModal } from "@/features/tower/components/BattleModal";
import { getEnemySpritePath, CHARACTER_AVATAR_PREVIEW } from "@/utils/sprites";
import { playBattleSFX, playUIMenuSFX, playAIRASound } from "@/utils/audio";

export default function TowerPage() {
  const { character } = useCharacterStore();
  const { 
    floors, 
    selectedFloor, 
    fetchFloors, 
    selectFloor, 
    challengeFloor, 
    isSimulating
  } = useTowerStore();

  useEffect(() => {
    if (character?.id) {
      fetchFloors(character.id);
    }
  }, [character?.id, fetchFloors]);

  // Sort floors descending so Floor 20 is at the top
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Tower Map */}
      <div className="w-1/2 flex flex-col bg-card rounded-xl border p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          Tower of Ascension
        </h2>
        <p className="text-muted-foreground mb-6">Climb the tower to test your character's ultimate potential.</p>
        
        <div className="flex-1 pr-4 overflow-y-auto">
          <div className="flex flex-col gap-4 relative pb-10">
            {/* The line connecting floors */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-border/50 rounded-full" />
            
            {sortedFloors.map((floor) => {
              const isSelected = selectedFloor?.id === floor.id;
              
              let statusColor = "bg-muted text-muted-foreground border-border";
              let StatusIcon = Lock;
              let statusGlow = "";
              
              if (floor.status === "CLEARED") {
                statusColor = "bg-green-500/10 text-green-500 border-green-500/50";
                StatusIcon = CheckCircle2;
              } else if (floor.status === "AVAILABLE" || floor.status === "ATTEMPTED") {
                statusColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500";
                statusGlow = "shadow-[0_0_15px_rgba(99,102,241,0.5)]";
                StatusIcon = Swords;
              } else if (floor.isBoss) {
                statusColor = "bg-red-500/5 text-red-500/40 border-red-500/20";
                StatusIcon = Crown;
              }

              return (
                <div 
                  key={floor.id}
                  onClick={() => selectFloor(floor)}
                  className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/50 z-10 
                    ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-accent' : 'border-transparent bg-card/80 backdrop-blur-sm'}
                  `}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${statusColor} ${statusGlow} transition-all overflow-hidden p-1.5 shrink-0 bg-slate-950/80`}>
                    <img
                      src={getEnemySpritePath(floor.enemy.name, floor.floorNumber, floor.isBoss)}
                      alt={floor.enemy.name}
                      onError={(e) => { e.currentTarget.src = "/BossesAndEnemies_sprite/cropped/slime_cropped.gif"; }}
                      className={`w-full h-full object-contain ${floor.status === "LOCKED" ? "opacity-40 grayscale" : "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"}`}
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-lg ${floor.status === "LOCKED" ? "text-muted-foreground" : ""}`}>
                        Floor {floor.floorNumber}
                      </h3>
                      {floor.isBoss && <Badge variant="destructive" className="ml-auto">BOSS</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {floor.enemy.name} • Lv {floor.enemy.level}
                    </p>
                  </div>
                  
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isSelected ? 'translate-x-1 text-primary' : ''}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-1/2 flex flex-col gap-6 h-full min-h-0">
        {selectedFloor ? (
          <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between h-full min-h-0 space-y-4">
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Floor {selectedFloor.floorNumber}
                    {selectedFloor.status === "CLEARED" && <Badge className="bg-green-500 ml-2">CLEARED</Badge>}
                  </h2>
                  <p className="text-muted-foreground">Enemy: {selectedFloor.enemy.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-bold font-mono tracking-wider">{selectedFloor.status}</p>
                </div>
              </div>

              {/* Tower Battle View (Player Left vs Enemy Right Face-Off) */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#151C33] to-red-950/60 border border-indigo-500/30 overflow-visible flex items-center justify-between shadow-inner min-h-[140px]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-2xl" />

                {/* Player Side (Left) */}
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-950/60 border border-cyan-500/40 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)] overflow-hidden">
                    <img
                      src={CHARACTER_AVATAR_PREVIEW}
                      alt={character?.name || "Player"}
                      onError={(e) => { e.currentTarget.src = CHARACTER_AVATAR_PREVIEW; }}
                      className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <span className="text-xs font-bold text-cyan-300 font-mono mt-1">{character?.name || "Player"}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Pwr: <span className="text-amber-400 font-bold">{character?.power || 0}</span></span>
                </div>

                {/* VS Center Badge */}
                <div className="flex flex-col items-center justify-center relative z-10 px-2">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 font-black font-mono text-sm tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
                    VS
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">FACE OFF</span>
                </div>

                {/* Enemy Side (Right) */}
                <div className="flex flex-col items-center gap-1 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900/50 border border-red-500/30 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)] overflow-hidden">
                    <img
                      src={getEnemySpritePath(selectedFloor.enemy.name, selectedFloor.floorNumber, selectedFloor.isBoss)}
                      alt={selectedFloor.enemy.name}
                      onError={(e) => { e.currentTarget.src = "/BossesAndEnemies_sprite/cropped/slime_cropped.gif"; }}
                      className="w-16 h-16 object-contain transform -scale-x-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <span className="text-xs font-bold text-red-400 font-mono mt-1 text-center truncate max-w-[120px]">{selectedFloor.enemy.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Lv. <span className="text-red-300 font-bold">{selectedFloor.enemy.level}</span></span>
                </div>
              </div>

              {/* Enemy Weaknesses & Telemetry */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Enemy Tactical Vulnerabilities
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Attribute Weakness */}
                  <div className="bg-[#0B1020] border border-indigo-500/30 rounded-lg p-3 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Attribute Weakness</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-mono font-bold text-xs uppercase px-2.5 py-1">
                        🎯 {selectedFloor.enemy.weaknessStat || "Knowledge"}
                      </Badge>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-1">+25% damage bonus when stat matches</span>
                  </div>

                  {/* Elemental Weakness */}
                  <div className="bg-[#0B1020] border border-amber-500/30 rounded-lg p-3 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Elemental Vulnerability</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 font-mono font-bold text-xs uppercase px-2.5 py-1">
                        ⚡ {selectedFloor.enemy.resistanceStat || "Flame"}
                      </Badge>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-1">+25% damage bonus on element exploit</span>
                  </div>
                </div>

                {/* Scaled Enemy Combat Telemetry */}
                <div className="bg-[#0B1020]/80 rounded-lg p-3 border border-slate-800 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">HP</span>
                    <span className="text-xs font-bold text-red-400 font-mono">{selectedFloor.enemy.hp.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">ATTACK</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">{selectedFloor.enemy.attack.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">DEFENSE</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">{selectedFloor.enemy.defense.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">SPEED</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{selectedFloor.enemy.speed.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Floor Rewards & Stats */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3 text-slate-300 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-amber-500" />
                  Floor Rewards & Progress
                </h3>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Attempts</span>
                    <span className="font-bold text-slate-200">{selectedFloor.attempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Clear Time</span>
                    <span className="font-bold text-slate-200">
                      {selectedFloor.bestClearTimeSeconds ? `${selectedFloor.bestClearTimeSeconds}s` : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                    <span className="text-slate-400">Floor Completion Bounty</span>
                    <span className="font-bold">
                      <span className="text-yellow-400 mr-3">+{selectedFloor.goldReward} Gold</span>
                      <span className="text-cyan-400">+{selectedFloor.expReward} EXP</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold shrink-0 mt-2" 
              size="lg"
              disabled={selectedFloor.status === "LOCKED" || isSimulating || !character}
              onClick={() => {
                if (character) {
                  playBattleSFX("encounter");
                  if (selectedFloor.status === "CLEARED") {
                    playAIRASound("REPEATING");
                  }
                  challengeFloor(character.id, selectedFloor.floorNumber);
                }
              }}
            >
              {isSimulating ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Swords className="w-5 h-5 animate-spin" /> Simulating Battle...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Swords className="w-5 h-5" /> ENTER FLOOR
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border flex items-center justify-center h-full text-muted-foreground">
            Select a floor to view details.
          </div>
        )}
      </div>

      {/* Combat Result Modal */}
      <BattleModal />
    </div>
  );
}

function RequirementRow({ label, required, current }: { label: string, required: number, current: number }) {
  const isMet = current >= required;
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm ${isMet ? 'text-primary' : 'text-destructive'}`}>
          {current}
        </span>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="font-mono text-sm text-muted-foreground">{required}</span>
        {isMet ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 ml-1" />
        ) : (
          <div className="w-4 h-4 text-red-500 ml-1 font-bold flex items-center justify-center text-xs">✕</div>
        )}
      </div>
    </div>
  );
}
