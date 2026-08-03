import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, Sparkles, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#0B1020] text-slate-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none font-sans">
      {/* VOID ANOMALY GLOW VISUAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ANOMALY CONTAINER */}
      <div className="relative z-10 max-w-md flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-[28px] bg-[#151C33] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-2xl shadow-purple-950/50">
            <Compass className="w-10 h-10 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-600/40 border border-purple-400/50 flex items-center justify-center text-purple-300 text-[10px] font-mono font-bold">
            404
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black font-heading text-white tracking-tight">
            LOST IN THE VOID
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm">
            The spatial coordinates you are seeking do not exist in this realm
            of Ascend OS.
          </p>
        </div>

        <div className="p-3.5 rounded-[14px] bg-[#151C33]/80 border border-white/10 text-xs text-slate-400 font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Error Code: 0x404_ROUTE_UNBOUND</span>
        </div>

        <Button
          variant="default"
          size="lg"
          asChild
          className="px-6 h-11 text-xs font-bold shadow-lg shadow-blue-600/25"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
