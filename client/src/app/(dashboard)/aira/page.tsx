"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
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
import { fetchSystemStatus } from "@/features/aira/services/aira.service";
import { AIRASystemStatusResponse } from "@/features/aira/types";

export default function AiraTerminalPage() {
  const { character } = useCharacterStore();
  const { messages, dailyReport, isLoading, loadDailyReport, sendPrompt, confirmAction, cancelAction } =
    useAiraStore();

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
      }
    };
    loadStatus();
  }, [characterId]);

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
      {/* 1. Holographic Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#151C33] via-[#1E1538] to-[#151C33] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/20 text-center flex flex-col items-center justify-center">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <Bot className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-2xl font-black font-heading text-slate-100 tracking-wide uppercase">
            AI System <span className="text-emerald-400 text-sm ml-2">● ONLINE</span>
          </h1>
        </div>
        
        <div className="relative z-10 space-y-1">
          <p className="text-xs text-slate-400 font-mono tracking-[0.2em] uppercase">System Administrator</p>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-widest uppercase">
            AIRA
          </h2>
          <p className="text-sm text-cyan-300/80 font-mono mt-4 italic">
            "Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {character?.name || 'Master'}. I have analyzed your progress."
          </p>
        </div>
      </div>

      {/* 2. System Status & Attention Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status Panel */}
        <Card className="bg-[#151C33] border-cyan-500/30 shadow-xl overflow-hidden font-mono">
          <CardHeader className="p-4 border-b border-slate-800 bg-[#0D1322]">
            <CardTitle className="text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2 uppercase">
              <Activity className="w-4 h-4 text-cyan-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-sm text-slate-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Character Level</span>
              <span className="font-bold text-cyan-400">{character?.level || 1}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Power</span>
              <span className="font-bold text-amber-400">{character?.power || 50}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Mission Success</span>
              <span className="font-bold text-emerald-400">{character?.stats?.consistency || 100}%</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Habit Strength</span>
              <span className="font-bold text-emerald-400">{(character?.stats?.consistency || 100) - 5}%</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-slate-400">Workout Consistency</span>
              <span className="font-bold text-purple-400">{(character?.stats?.consistency || 100) - 12}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Attention Panel */}
        <Card className={`bg-[#151C33] border-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-500/30 shadow-xl overflow-hidden font-mono relative`}>
          <div className={`absolute inset-0 bg-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-500/5 pointer-events-none`} />
          <CardHeader className="p-4 border-b border-slate-800 bg-[#0D1322]">
            <CardTitle className={`text-sm font-bold text-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-400 tracking-wider flex items-center gap-2 uppercase`}>
              <Shield className="w-4 h-4" />
              {systemStatus?.status === 'warning' ? 'Attention Required' : 'System Status'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm text-slate-200 font-sans">
              {systemStatus?.message || "System optimal. No critical warnings."}
            </p>
            {systemStatus?.status === 'warning' && (
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <span className="block text-[10px] text-amber-500/80 uppercase mb-1">Recommended Action</span>
                <p className="text-xs text-slate-300 font-sans">
                  Please consult with AIRA for a recalibration of your routines.
                </p>
              </div>
            )}
            <Button variant="outline" className={`w-full text-xs border-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-500/30 text-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-400 hover:bg-${systemStatus?.status === 'warning' ? 'amber' : 'emerald'}-950/40 mt-2`}>
              [ VIEW ANALYSIS ]
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 3. Terminal Chat Interface */}
      <Card className="bg-[#0D1322] border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Terminal Window Header Bar */}
        <CardHeader className="p-3 px-4 bg-[#151C33] border-b border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>aira@ascend-os:~/command-center</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMorningBriefing}
              disabled={isLoading}
              className="h-6 text-[10px] px-2 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 font-mono uppercase tracking-wider"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Briefing
            </Button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
            </div>
          </div>
        </CardHeader>

        {/* Chat Output Feed */}
        <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs leading-relaxed">
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
                    <div className={`mt-4 p-3 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'bg-cyan-950/30 border-cyan-500/40' : 'bg-amber-950/30 border-amber-500/40'} border rounded-lg space-y-3`}>
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'text-cyan-400' : 'text-amber-400'}`} />
                        <span className={`text-xs font-bold ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'text-cyan-400' : 'text-amber-400'} uppercase tracking-wider`}>
                          {msg.pendingAction.action_type === 'generate_progression_plan' ? 'RECOMMENDED HABITS' : 'SYSTEM ACTION PROPOSED'}
                        </span>
                      </div>
                      <p className={`text-sm font-sans ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'text-cyan-200/90 bg-cyan-900/20' : 'text-amber-200/90 bg-amber-900/20'} p-2 rounded`}>
                        {msg.pendingAction.summary}
                      </p>
                      
                      {/* Plan specifics if it's a plan */}
                      {msg.pendingAction.action_type === 'generate_progression_plan' && (
                        <div className="text-xs text-slate-300 bg-[#0D1322]/50 p-2 rounded border border-slate-800 space-y-1 font-mono">
                           <p>+ {msg.pendingAction.action_args.habit1_title || "Read for 30m"}</p>
                           <p>+ {msg.pendingAction.action_args.habit2_title || "Code for 1h"}</p>
                           <p>+ {msg.pendingAction.action_args.habit3_title || "Review notes"}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => confirmAction(msg.id, characterId)}
                          disabled={isLoading}
                          className={`flex-1 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-amber-600 hover:bg-amber-500'} text-slate-950 font-bold h-8 text-xs uppercase`}
                        >
                          {msg.pendingAction.action_type === 'generate_progression_plan' ? '[ ACCEPT PLAN ]' : '[ CONFIRM ]'}
                        </Button>
                        <Button
                          onClick={() => cancelAction(msg.id)}
                          disabled={isLoading}
                          variant="outline"
                          className={`flex-1 ${msg.pendingAction.action_type === 'generate_progression_plan' ? 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/50' : 'border-amber-500/40 text-amber-400 hover:bg-amber-950/50'} h-8 text-xs uppercase`}
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
              placeholder="Ask AIRA anything..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="bg-[#0D1322] border-slate-800 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500 py-6"
            />

            <Button
              onClick={handleSend}
              disabled={isLoading || !inputPrompt.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold h-12 px-6 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
