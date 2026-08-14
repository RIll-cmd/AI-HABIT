"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Terminal,
  RefreshCw,
  Cpu,
  Radio,
  Swords,
  Package,
  Target,
  Dumbbell,
  BarChart3,
  Bot,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAiraStore } from "@/features/aira/store";
import { AiraAvatar, AiraMood } from "@/components/ui/AiraAvatar";
import { useCharacterStore } from "@/store/useCharacterStore";
import { playNoticeSound } from "@/features/audio/useSystemAudio";
import { fetchSystemStatus } from "@/features/aira/services/aira.service";
import { AIRASystemStatusResponse } from "@/features/aira/types";
import { playVoiceLine, playBattleSFX, playUIMenuSFX } from "@/utils/audio";

const QUICK_PROMPTS = [
  {
    id: "tower",
    title: "Tower Analysis",
    icon: Swords,
    color: "text-amber-400",
    promptText: "Can I beat Floor 1 of the Tower?",
  },
  {
    id: "equipment",
    title: "Equipment Advice",
    icon: Package,
    color: "text-indigo-400",
    promptText: "Analyze my gear and recommend upgrades",
  },
  {
    id: "goal",
    title: "Goal Routine",
    icon: Target,
    color: "text-cyan-400",
    promptText: "I want to get better at programming",
  },
  {
    id: "workout",
    title: "Workout Today",
    icon: Dumbbell,
    color: "text-emerald-400",
    promptText: "What should I train today?",
  },
  {
    id: "status",
    title: "System Status",
    icon: BarChart3,
    color: "text-purple-400",
    promptText: "Analyze my progress over the last week",
  },
];

export default function AiraTerminalPage() {
  const { character } = useCharacterStore();
  const {
    messages,
    dailyReport,
    isLoading,
    loadDailyReport,
    sendPrompt,
    confirmAction,
    cancelAction,
    autoBriefingsEnabled,
    toggleAutoBriefings,
    currentMood,
    clearMessages,
  } = useAiraStore();

  const [inputPrompt, setInputPrompt] = useState("");
  const [systemStatus, setSystemStatus] = useState<AIRASystemStatusResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const characterId = character?.id || "char-id-123";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const loadStatus = async () => {
      const status = await fetchSystemStatus(characterId);
      if (status) {
        setSystemStatus(status);
        if (status.status === "warning") {
          playVoiceLine("/sounds/AIRA Persona/AI-NOTICE.mp3");
        }
      }
    };
    loadStatus();
  }, [characterId]);

  const handleSend = async () => {
    if (!inputPrompt.trim() || isLoading) return;
    const promptToSend = inputPrompt;
    setInputPrompt("");
    playUIMenuSFX("confirm");
    await sendPrompt(promptToSend, characterId);
  };

  const handleQuickPrompt = async (text: string) => {
    if (isLoading) return;
    playUIMenuSFX("hover");
    await sendPrompt(text, characterId);
  };

  const handleMorningBriefing = async () => {
    if (isLoading) return;
    playUIMenuSFX("confirm");
    await loadDailyReport(characterId);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 max-w-7xl w-full mx-auto font-sans text-slate-100 min-h-0 animate-in fade-in duration-300">
      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: AIRA TELEMETRY & ATTENTION PANEL (4 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 min-h-0">
          {/* Holographic Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#121A33]/95 via-[#18112E]/95 to-[#0C0F1E]/98 p-4 rounded-[22px] border border-cyan-500/30 shadow-xl relative backdrop-blur-xl shrink-0">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                <AiraAvatar mood={currentMood as AiraMood} className="w-9 h-9" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold font-heading text-white tracking-wide">
                    AIRA
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase truncate">
                  System Administrator
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-mono mt-2.5 italic bg-[#090D1C]/70 p-2.5 rounded-xl border border-slate-800/80 relative z-10 leading-relaxed">
              "Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {character?.name || 'Master'}. All neural resonance matrices are synchronized."
            </p>
          </div>

          {/* System Telemetry Metrics */}
          <Card className="bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border-cyan-500/25 shadow-xl overflow-hidden font-mono rounded-[22px] flex-1 flex flex-col justify-between p-0">
            <CardHeader className="p-3 border-b border-cyan-500/20 bg-cyan-950/30 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-xs font-bold text-slate-200 tracking-wider flex items-center gap-2 uppercase">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                System Telemetry
              </CardTitle>
              <span className="text-[10px] text-cyan-400 font-bold">100% SYNC</span>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-xs text-slate-300 flex-1 flex flex-col justify-around">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Character Level</span>
                <span className="font-bold text-cyan-300 font-mono">Lv. {character?.level || 1}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Power Rating</span>
                <span className="font-bold text-amber-400 font-mono">{character?.power || 50}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Mission Success</span>
                <span className="font-bold text-emerald-400 font-mono">{character?.stats?.consistency || 100}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Habit Strength</span>
                <span className="font-bold text-emerald-400 font-mono">{Math.max(0, (character?.stats?.consistency || 100) - 5)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Workout Consistency</span>
                <span className="font-bold text-purple-400 font-mono">{Math.max(0, (character?.stats?.consistency || 100) - 12)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Attention & Status Alert */}
          <Card className={`bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-500/30 shadow-xl overflow-hidden font-mono rounded-[22px] shrink-0`}>
            <CardHeader className="p-3 border-b border-slate-800 bg-[#070D1E]/60 flex flex-row items-center justify-between">
              <CardTitle className={`text-xs font-bold text-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-400 tracking-wider flex items-center gap-2 uppercase`}>
                <Shield className="w-3.5 h-3.5" />
                {systemStatus?.status === 'warning' ? 'Attention Required' : 'System Directive'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {systemStatus?.message || "System optimal. No critical anomalies detected in ascension path."}
              </p>
              {systemStatus?.status === 'warning' && (
                <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                  <span className="block text-[9.5px] text-amber-400 uppercase font-bold mb-0.5">Recommended Action</span>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Consult with AIRA below for routine recalibration.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: FULL-HEIGHT AIRA COMMAND TERMINAL (8 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 flex flex-col flex-1 h-full min-h-[480px] lg:min-h-0">
          <Card className="bg-gradient-to-br from-[#0A0F22]/98 via-[#070B18]/98 to-[#040712]/98 border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col flex-1 h-full rounded-[24px] backdrop-blur-2xl">
            {/* Terminal Window Header Bar */}
            <CardHeader className="p-3 px-4 bg-[#0E152C] border-b border-cyan-500/20 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">aira@ascend-os:~/command-center</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleAutoBriefings}
                  className="h-7 text-[10px] px-2.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 font-mono uppercase tracking-wider gap-1.5 rounded-lg"
                >
                  <AiraAvatar mood={currentMood as AiraMood} className="w-3.5 h-3.5" />
                  <span>Briefings:</span>
                  <span className={autoBriefingsEnabled ? "text-emerald-400 font-bold" : "text-slate-400 font-bold"}>
                    {autoBriefingsEnabled ? "ON" : "OFF"}
                  </span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMorningBriefing}
                  disabled={isLoading}
                  className="h-7 text-[10px] px-2.5 text-purple-300 hover:text-purple-200 hover:bg-purple-950/40 font-mono uppercase tracking-wider rounded-lg"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Briefing
                </Button>

                {messages.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      playUIMenuSFX("decline");
                      clearMessages();
                    }}
                    className="h-7 text-[10px] px-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 font-mono rounded-lg"
                    title="Clear Terminal Log"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Chat Output Feed */}
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed custom-scrollbar min-h-0">
              <AnimatePresence>
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
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-sm">
                        <AiraAvatar mood={(msg.mood || "NEUTRAL") as AiraMood} className="w-5 h-5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl border ${
                        msg.sender === "user"
                          ? "bg-purple-950/50 border-purple-500/40 text-purple-200 shadow-md"
                          : "bg-[#11182E]/90 border-cyan-500/30 text-slate-200 shadow-lg shadow-cyan-950/20"
                      }`}
                    >
                      {/* Header tag for AIRA responses */}
                      {msg.sender === "aira" && (
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AIRA Persona Analysis
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}

                      <div className="font-sans text-sm text-slate-200 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-cyan-300" {...props} />,
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-3 rounded-lg border border-slate-700">
                                <table className="w-full text-xs text-left" {...props} />
                              </div>
                            ),
                            th: ({ node, ...props }) => (
                              <th className="bg-slate-800/80 p-2 font-bold text-cyan-400 border-b border-slate-700" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="p-2 border-b border-slate-800/50" {...props} />
                            ),
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {msg.pendingAction && (
                        <div className={`mt-4 p-3.5 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-amber-950/40 border-amber-500/40'} border rounded-xl space-y-3`}>
                          <div className="flex items-center gap-2">
                            <Shield className={`w-4 h-4 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'text-cyan-400' : 'text-amber-400'}`} />
                            <span className={`text-xs font-bold ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'text-cyan-400' : 'text-amber-400'} uppercase tracking-wider`}>
                              {msg.pendingAction.action_type === 'generate_progression_plan' ? 'RECOMMENDED HABITS PROTOCOL' : 'SYSTEM ACTION PROPOSED'}
                            </span>
                          </div>
                          <p className={`text-xs font-sans ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'text-cyan-200/90 bg-cyan-900/30' : 'text-amber-200/90 bg-amber-900/30'} p-2.5 rounded-lg`}>
                            {msg.pendingAction.summary}
                          </p>

                          {/* Plan specifics if it's a plan */}
                          {msg.pendingAction.action_type === 'generate_progression_plan' && (
                            <div className="text-xs text-slate-300 bg-[#080D1D]/70 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono">
                              <p>+ {msg.pendingAction.action_args.habit1_title || "Read for 30m"}</p>
                              <p>+ {msg.pendingAction.action_args.habit2_title || "Code for 1h"}</p>
                              <p>+ {msg.pendingAction.action_args.habit3_title || "Review notes"}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-1">
                            <Button
                              onClick={() => {
                                playBattleSFX("impact");
                                if (msg.pendingAction?.action_type === 'generate_progression_plan') {
                                  playVoiceLine("/sounds/AIRA Persona/AI-SUCCESSFUL.mp3");
                                } else {
                                  playVoiceLine("/sounds/AIRA Persona/AI-CONFRIMED.mp3");
                                }
                                confirmAction(msg.id, characterId);
                              }}
                              disabled={isLoading}
                              className={`flex-1 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-amber-600 hover:bg-amber-500'} text-slate-950 font-black h-8 text-xs uppercase rounded-lg shadow-md cursor-pointer`}
                            >
                              {msg.pendingAction.action_type === 'generate_progression_plan' ? '[ ACCEPT PLAN ]' : '[ CONFIRM ]'}
                            </Button>
                            <Button
                              onClick={() => {
                                playUIMenuSFX("decline");
                                cancelAction(msg.id);
                              }}
                              disabled={isLoading}
                              variant="outline"
                              className={`flex-1 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/50' : 'border-amber-500/40 text-amber-400 hover:bg-amber-950/50'} h-8 text-xs uppercase rounded-lg cursor-pointer`}
                            >
                              [ CANCEL ]
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 text-cyan-400 text-xs font-mono py-2"
                >
                  <AiraAvatar mood="ANALYZING" className="w-6 h-6" />
                  <span>AIRA calculating optimal response... [100% accuracy sync]</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Terminal Command Input Bar */}
            <div className="p-3.5 bg-[#0C1226] border-t border-cyan-500/20 space-y-2.5 shrink-0">
              {/* Quick Prompt Action Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_PROMPTS.map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleQuickPrompt(chip.promptText)}
                      disabled={isLoading}
                      title={chip.promptText}
                      className="bg-[#080D1D] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/50 text-xs text-cyan-300 font-mono transition-all duration-150 rounded-xl px-3 py-1.5 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.25)] active:scale-95"
                    >
                      <Icon className={`w-3.5 h-3.5 ${chip.color || 'text-cyan-400'}`} />
                      <span>{chip.promptText}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Ask AIRA anything..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  className="bg-[#060914] border-slate-800 focus:border-cyan-400 text-sm font-mono text-slate-100 placeholder:text-slate-500 py-6 rounded-xl"
                />

                <Button
                  onClick={handleSend}
                  disabled={isLoading || !inputPrompt.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-black h-12 px-6 shrink-0 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <Send className="w-5 h-5 fill-slate-950" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

