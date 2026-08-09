"use client";

import { useEffect, useState } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useBossStore } from "@/features/bosses/store/useBossStore";
import { BossCard } from "@/features/bosses/components/BossCard";
import { BossCreationModal } from "@/features/bosses/components/BossCreationModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Skull } from "lucide-react";

export default function BossesPage() {
  const { character } = useCharacterStore();
  const { bosses, fetchBosses, isLoading } = useBossStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (character) {
      fetchBosses(character.id);
    }
  }, [character, fetchBosses]);

  const activeBosses = bosses.filter(b => b.status === "ACTIVE");
  const completedBosses = bosses.filter(b => b.status !== "ACTIVE");

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background min-h-full">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end pb-6 border-b border-border/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skull className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl font-black tracking-tight uppercase">Real-Life Bosses</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Turn your massive real-world goals into towering dungeon bosses. 
              Deal damage by completing linked habits, missions, and workouts.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg shadow-red-900/20"
          >
            <PlusCircle className="w-5 h-5" /> SUMMON BOSS
          </Button>
        </div>

        {/* Content Section */}
        {isLoading && bosses.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <div className="animate-pulse flex items-center gap-3">
              <Skull className="w-6 h-6" /> Scanning for threats...
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Active Bosses */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                ACTIVE THREATS
              </h2>
              
              {activeBosses.length === 0 ? (
                <div className="bg-card border border-dashed rounded-xl p-12 text-center text-muted-foreground">
                  <Skull className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No active bosses.</p>
                  <p className="text-sm">Summon a boss to start tracking a major life goal.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeBosses.map((boss) => (
                    <BossCard key={boss.id} boss={boss} />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Bosses */}
            {completedBosses.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-border/50">
                <h2 className="text-xl font-bold flex items-center gap-2 text-muted-foreground">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  CONQUERED
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                  {completedBosses.map((boss) => (
                    <BossCard key={boss.id} boss={boss} />
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}

      </div>

      <BossCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
