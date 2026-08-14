"use client";

import { useState } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { API_BASE_URL } from "@/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, Sparkles, LineChart } from "lucide-react";
import { playVoiceLine, playUISound } from "@/utils/audio";
import { useAiraStore } from "@/features/aira/store";
import { AiraAvatar, AiraMood } from "@/components/ui/AiraAvatar";

export function CielShopCoaching() {
  const { character } = useCharacterStore();
  const { currentMood } = useAiraStore();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalysis = async () => {
    if (!character) return;
    setIsLoading(true);
    playUISound("/sounds/General/10_UI_Menu_SFX/001_Hover_01.wav");
    try {
      const res = await fetch(`${API_BASE_URL}/api/aira/shop-analysis/${character.id}`);
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
        playVoiceLine("/sounds/AIRA Persona/AI-NOTICE.mp3");
      }
    } catch (e) {
      console.error("Failed to fetch Ciel shop analysis", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!character) return null;

  return (
    <Card className="relative overflow-hidden border-indigo-500/20 bg-black/40 backdrop-blur-xl mb-8 p-0">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 mix-blend-overlay"></div>
      <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center flex-grow">
          {/* Ciel Avatar / Icon */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <AiraAvatar mood={currentMood as AiraMood} className="w-14 h-14" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Coaching Content */}
          <div className="space-y-2 flex-grow">
            <h3 className="font-bold text-lg text-indigo-300 flex items-center gap-2">
              AIRA Economic Analysis
            </h3>
            <div className="text-sm text-indigo-100/80 leading-relaxed font-mono">
              {isLoading ? (
                <div className="flex items-center gap-2 text-indigo-400/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running tactical market analysis...</span>
                </div>
              ) : analysis ? (
                <p>{analysis}</p>
              ) : (
                <p className="text-indigo-300/60 italic text-xs">
                  Click the button to request AIRA's tactical market & purchasing analysis.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full md:w-auto">
          <Button
            onClick={fetchAnalysis}
            disabled={isLoading}
            className="w-full md:w-auto bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-mono text-xs uppercase tracking-wider gap-2 shadow-lg shadow-indigo-950/50 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LineChart className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>{analysis ? "Re-Analyze Market" : "Analyze Market"}</span>
          </Button>
        </div>

      </div>
    </Card>
  );
}

