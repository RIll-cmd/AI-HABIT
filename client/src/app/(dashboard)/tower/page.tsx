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
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${statusColor} ${statusGlow} transition-all`}>
                    <StatusIcon className="w-8 h-8" />
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
      <div className="w-1/2 flex flex-col gap-6">
        {selectedFloor ? (
          <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
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

            <div className="space-y-6 flex-1">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  Stat Requirements
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <RequirementRow 
                    label="Power" 
                    required={selectedFloor.requiredPower} 
                    current={character?.power || 0} 
                  />
                  <RequirementRow 
                    label="Strength" 
                    required={selectedFloor.requiredStrength} 
                    current={character?.stats?.strength || 1} 
                  />
                  <RequirementRow 
                    label="Endurance" 
                    required={selectedFloor.requiredEndurance} 
                    current={character?.stats?.endurance || 1} 
                  />
                  <RequirementRow 
                    label="Knowledge" 
                    required={selectedFloor.requiredKnowledge} 
                    current={character?.stats?.knowledge || 1} 
                  />
                  <RequirementRow 
                    label="Recovery" 
                    required={selectedFloor.requiredRecovery} 
                    current={character?.stats?.recovery || 1} 
                  />
                  <RequirementRow 
                    label="Focus" 
                    required={selectedFloor.requiredFocus} 
                    current={character?.stats?.focus || 1} 
                  />
                  <RequirementRow 
                    label="Discipline" 
                    required={selectedFloor.requiredDiscipline} 
                    current={character?.stats?.discipline || 1} 
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Floor Data
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attempts</span>
                    <span className="font-mono">{selectedFloor.attempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Time</span>
                    <span className="font-mono">
                      {selectedFloor.bestClearTimeSeconds ? `${selectedFloor.bestClearTimeSeconds}s` : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rewards</span>
                    <span>
                      <span className="text-yellow-500 mr-2">{selectedFloor.goldReward}g</span>
                      <span className="text-blue-400">{selectedFloor.expReward} EXP</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold mt-4" 
              size="lg"
              disabled={selectedFloor.status === "LOCKED" || isSimulating || !character}
              onClick={() => character && challengeFloor(character.id, selectedFloor.floorNumber)}
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
