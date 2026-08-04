"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Terminal,
  RefreshCw,
  Cpu,
  Radio,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAiraStore } from "@/features/aira/store";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playNoticeSound } from "@/features/audio/useSystemAudio";

export default function AiraTerminalPage() {
  const { character } = useCharacterStore();
  const { messages, dailyReport, isLoading, loadDailyReport, sendPrompt } =
    useAiraStore();

  const [inputPrompt, setInputPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const characterId = character?.id || "char-id-123";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputPrompt.trim() || isLoading) return;
    const promptToSend = inputPrompt;
    setInputPrompt("");
    await sendPrompt(promptToSend, characterId);
  };

  const handleQuickPrompt = async (text: string) => {
    if (isLoading) return;
    await sendPrompt(text, characterId);
  };

  const handleMorningBriefing = async () => {
    if (isLoading) return;
    await loadDailyReport(characterId);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Holographic Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#151C33] via-[#1E1538] to-[#151C33] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/20">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                <Cpu className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black font-heading text-slate-100 tracking-tight">
                    AIRA Core Terminal
                  </h1>
                  <Badge variant="outline" className="text-[10px] bg-cyan-950 text-cyan-300 border-cyan-500/40 font-mono">
                    Ciel Protocol v2.5
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Artificial Intelligence Resonance Administrator • 100% Calculation Accuracy
                </p>
              </div>
            </div>
          </div>

          {/* Quick System Telemetry Card */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-3 px-5 rounded-xl border border-slate-800 shrink-0 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">
                Master Resonance
              </span>
              <span className="text-sm font-bold text-cyan-400">
                {character?.name || "Master"} (Lvl {character?.level || 1})
              </span>
            </div>

            <div className="text-right border-l border-slate-800 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase">
                Power Score
              </span>
              <span className="text-sm font-bold text-amber-400">
                ⚡ {character?.power || 50}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Command Terminal (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-[#0D1322] border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col h-[580px]">
            {/* Terminal Window Header Bar */}
            <CardHeader className="p-3 px-4 bg-[#151C33] border-b border-slate-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>aira@ascend-os:~/resonance-stream</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
              </div>
            </CardHeader>

            {/* Chat Output Feed */}
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "aira" && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-xl border ${
                      msg.sender === "user"
                        ? "bg-purple-950/40 border-purple-500/40 text-purple-200"
                        : "bg-[#151C33]/90 border-cyan-500/30 text-slate-200 shadow-lg shadow-cyan-950/10"
                    }`}
                  >
                    {/* Header tag for AIRA responses */}
                    {msg.sender === "aira" && (
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
                          AIRA Persona Analysis
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap font-sans text-xs">
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 text-cyan-400 text-xs font-mono py-2"
                >
                  <Bot className="w-5 h-5 animate-spin" />
                  <span>AIRA calculating optimal response... [100% accuracy sync]</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Terminal Command Input */}
            <div className="p-3 bg-[#151C33] border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Command AIRA or query skill acquisition strategy..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  className="bg-[#0D1322] border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500"
                />

                <Button
                  onClick={handleSend}
                  disabled={isLoading || !inputPrompt.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Tactical Quick Actions & Persona Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Daily Report Banner */}
          <Card className="bg-[#151C33] border-purple-500/30 shadow-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm font-heading">
                <Sparkles className="w-4 h-4" /> AIRA Daily Briefing
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleMorningBriefing}
                disabled={isLoading}
                className="h-7 text-[11px] px-2.5 text-purple-300 border-purple-500/30 hover:bg-purple-950/40"
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Briefing
              </Button>
            </CardHeader>

            <CardContent className="p-4 text-xs font-mono text-slate-300 space-y-2">
              {dailyReport ? (
                <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                  {dailyReport}
                </p>
              ) : (
                <p className="text-slate-500 italic">
                  Click 'Briefing' to initialize AIRA's signature morning report.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Query Commands */}
          <Card className="bg-[#151C33] border-slate-800 shadow-xl">
            <CardHeader className="p-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                Quick Strategic Queries
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleQuickPrompt(
                    "AIRA, analyze my current attributes and tell me which habit to prioritize next."
                  )
                }
                disabled={isLoading}
                className="w-full justify-start text-xs text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 bg-slate-900/60"
              >
                📊 Prioritize Next Skill Routine
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleQuickPrompt(
                    "AIRA, calculate my combat readiness for Floor 5 of the Ascension Tower."
                  )
                }
                disabled={isLoading}
                className="w-full justify-start text-xs text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 bg-slate-900/60"
              >
                ⚔️ Tower Floor Combat Analysis
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleQuickPrompt(
                    "AIRA, explain how my Consistency stat affects my equipment rarity drops."
                  )
                }
                disabled={isLoading}
                className="w-full justify-start text-xs text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 bg-slate-900/60"
              >
                🎲 Rarity Drop Luck Coefficient
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
