"use client";

import { API_BASE_URL } from "@/constants";
import React, { useState, useEffect } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import {
  Palette,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Loader2,
  Zap,
} from "lucide-react";

interface TitleItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  statBonus: Record<string, number>;
  powerMultiplier: number;
  requirementType: string;
  requirementValue: number;
  isUnlocked: boolean;
  isEquipped: boolean;
}

export default function CustomizePage() {
  const { character, refetch } = useCharacterStore();
  const [titles, setTitles] = useState<TitleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEquipping, setIsEquipping] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/character/titles/${character?.id || "char-id-123"}`);
        if (res.ok) {
          const data = await res.json();
          setTitles(data.titles || []);
        }
      } catch (e) {
        console.error("Failed to fetch titles", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTitles();
  }, [character?.id]);

  const handleEquipTitle = async (title: TitleItem) => {
    setIsEquipping(title.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/character/titles/equip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: character?.id || "char-id-123",
          titleId: title.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(data.message);
        await refetch();
        // Update local status
        setTitles((prev) =>
          prev.map((t) => ({
            ...t,
            isEquipped: t.id === title.id,
            isUnlocked: t.id === title.id ? true : t.isUnlocked,
          }))
        );
      } else {
        toast.error("Failed to equip title.");
      }
    } catch (e) {
      toast.error("Network error equipping title.");
    } finally {
      setIsEquipping(null);
    }
  };

  const categories = ["Milestone", "Tower", "Habits", "Special"];

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-[24px] bg-[#0B1020]/90 border border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Equippable Achievement Titles & Identity
            </h2>
            {character?.title && (
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                EQUIPPED: {character.title}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Equip milestone achievement titles earned through Tower climbs, habit streaks, and level progression to gain active power multipliers.
          </p>
        </div>
      </div>

      {/* TITLES GRID BY CATEGORY */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 font-mono text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          <span>Loading Title Vault...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const categoryTitles = titles.filter((t) => t.category === cat);
            if (categoryTitles.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <h3 className="text-base font-bold font-heading text-white tracking-tight">
                    {cat} Titles ({categoryTitles.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTitles.map((t) => (
                    <Card
                      key={t.id}
                      className={`bg-[#0F1629] border transition-all overflow-hidden flex flex-col justify-between shadow-xl ${
                        t.isEquipped
                          ? "border-purple-400 bg-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : t.isUnlocked
                          ? "border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/60"
                          : "border-slate-900 opacity-60"
                      }`}
                    >
                      <CardHeader className="pb-2 bg-slate-900/40 border-b border-slate-800/80 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{t.icon || "👑"}</span>
                          <CardTitle className="text-sm font-bold text-white">
                            {t.name}
                          </CardTitle>
                        </div>

                        {t.isEquipped ? (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        ) : !t.isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        ) : null}
                      </CardHeader>

                      <CardContent className="p-4 space-y-3 font-mono flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                            {t.description}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                            <span>Power Multiplier:</span>
                            <span className="font-bold text-cyan-400">+{Math.round((t.powerMultiplier - 1.0) * 100)}%</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          disabled={t.isEquipped || isEquipping === t.id}
                          onClick={() => handleEquipTitle(t)}
                          className={`w-full font-mono text-xs font-bold uppercase tracking-wider ${
                            t.isEquipped
                              ? "bg-purple-950 text-purple-300 border border-purple-500/50"
                              : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/50"
                          }`}
                        >
                          {isEquipping === t.id ? (
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          ) : t.isEquipped ? (
                            "Equipped"
                          ) : (
                            "Equip Title"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
