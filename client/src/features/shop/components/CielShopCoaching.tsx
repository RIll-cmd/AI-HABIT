"use client";

import { useEffect, useState } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Card } from "@/components/ui/card";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { playVoiceLine } from "@/utils/audio";

export function CielShopCoaching() {
  const { character } = useCharacterStore();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!character) return;
    
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/aira/shop-analysis/${character.id}`);
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
    
    fetchAnalysis();
  }, [character?.id]);

  if (!character) return null;

  return (
    <Card className="relative overflow-hidden border-indigo-500/20 bg-black/40 backdrop-blur-xl mb-8 p-0">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 mix-blend-overlay"></div>
      <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Ciel Avatar / Icon */}
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Bot className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Coaching Content */}
        <div className="flex-grow space-y-2">
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
              <p className="text-muted-foreground opacity-50">Analysis unavailable at this time.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
