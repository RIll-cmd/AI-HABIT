"use client";

import React, { useState, useEffect } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import {
  TreePine,
  Shield,
  Zap,
  Swords,
  Sparkles,
  Lock,
  CheckCircle2,
  Award,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface Specialization {
  id: string;
  name: string;
  baseClass: string;
  tier: number;
  requiredLevel: number;
  description: string;
  icon: string;
}

export default function SkillTreePage() {
  const { character, refetch } = useCharacterStore();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/character/specializations/all");
        if (res.ok) {
          const data = await res.json();
          setSpecializations(data.specializations || []);
        }
      } catch (e) {
        console.error("Failed to fetch specializations", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  const activeSpecId = character?.specializationId;
  const currentLevel = character?.level || 1;

  const handleSelectSpecialization = async (spec: Specialization) => {
    if (currentLevel < spec.requiredLevel) {
      toast.error(`Unlocks at Level ${spec.requiredLevel}. (Current Level: ${currentLevel})`);
      return;
    }

    setIsSelecting(spec.id);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/character/specializations/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character?.id || "char-id-123",
          specializationId: spec.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(`Chosen Class Evolution: ${spec.name}!`);
        await refetch();
      } else {
        toast.error("Failed to select specialization.");
      }
    } catch (e) {
      toast.error("Network error.");
    } finally {
      setIsSelecting(null);
    }
  };

  const baseClasses = ["Warrior", "Mage", "Rogue"];

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-[24px] bg-[#0B1020]/90 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-cyan-400" />
              Class Specialization & Skill Trees
            </h2>
            {character?.specialization && (
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                ACTIVE: {character.specialization.name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Evolve your class branch at Level 10 and Level 25 to unlock specialized passive perks and combat multipliers.
          </p>
        </div>
      </div>

      {/* SPECIALIZATION EVOLUTION TREES */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 font-mono text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Loading Class Skill Trees...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {baseClasses.map((baseClass) => {
            const classSpecs = specializations.filter((s) => s.baseClass === baseClass);

            return (
              <div key={baseClass} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                  <Swords className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold font-heading text-white tracking-tight">
                    {baseClass} Evolution Tree
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono text-slate-500">
                    Tier 2 Evolution
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classSpecs.map((spec) => {
                    const isSelected = activeSpecId === spec.id;
                    const isUnlocked = currentLevel >= spec.requiredLevel;

                    return (
                      <Card
                        key={spec.id}
                        className={`bg-[#0F1629] border transition-all overflow-hidden flex flex-col justify-between relative shadow-xl ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            : isUnlocked
                            ? "border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                            : "border-slate-900 opacity-75"
                        }`}
                      >
                        <CardHeader className="pb-2 bg-slate-900/40 border-b border-slate-800/80 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{spec.icon}</span>
                            <div>
                              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                {spec.name}
                                {isSelected && (
                                  <Badge className="bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] uppercase">
                                    EQUIPPED
                                  </Badge>
                                )}
                              </CardTitle>
                              <span className="text-[10px] font-mono text-slate-400">
                                Base: {spec.baseClass} • Required Lvl {spec.requiredLevel}
                              </span>
                            </div>
                          </div>

                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                          ) : !isUnlocked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : null}
                        </CardHeader>

                        <CardContent className="p-4 space-y-4 font-mono flex-1 flex flex-col justify-between">
                          <p className="text-xs text-slate-300 font-sans leading-relaxed">
                            {spec.description}
                          </p>

                          <div className="pt-2">
                            <Button
                              size="sm"
                              disabled={isSelected || !isUnlocked || isSelecting === spec.id}
                              onClick={() => handleSelectSpecialization(spec)}
                              className={`w-full font-mono text-xs font-bold uppercase tracking-wider ${
                                isSelected
                                  ? "bg-cyan-950 text-cyan-400 border border-cyan-500/50"
                                  : isUnlocked
                                  ? "bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
                                  : "bg-slate-900 text-slate-500 border border-slate-800"
                              }`}
                            >
                              {isSelecting === spec.id ? (
                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                              ) : isSelected ? (
                                "Active Evolution"
                              ) : isUnlocked ? (
                                "Select Specialization"
                              ) : (
                                `Locked (Req. Lvl ${spec.requiredLevel})`
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
