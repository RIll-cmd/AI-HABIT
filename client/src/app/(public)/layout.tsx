import React from "react";
import Link from "next/link";
import { Sparkles, LogIn, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#050a18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* HIGH-TECH TOP NAVIGATION BAR */}
      <header suppressHydrationWarning className="w-full h-20 px-6 sm:px-10 border-b border-cyan-500/10 bg-[#050a18]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50 shadow-lg shadow-black/40">
        <Link href="/landing" className="flex items-center gap-3 group">
          <div suppressHydrationWarning className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div suppressHydrationWarning>
            <div suppressHydrationWarning className="flex items-center gap-2">
              <span className="font-bold text-lg font-heading text-white tracking-[0.12em] group-hover:text-cyan-300 transition-colors">
                ASCEND OS
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold tracking-wider">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block -mt-0.5 tracking-widest">
              LIFE RPG PLATFORM
            </span>
          </div>
        </Link>

        {/* RIGHT NAVIGATION ACTIONS */}
        <div suppressHydrationWarning className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 text-xs font-semibold rounded-xl transition-all duration-200"
          >
            <Link href="/guest" className="hidden sm:flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>Guest Sandbox</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-300 text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-cyan-950/50"
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
          </Button>

          <Button
            variant="default"
            size="sm"
            asChild
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-200"
          >
            <Link href="/register" className="flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Journey</span>
              <span className="sm:hidden">Join</span>
            </Link>
          </Button>
        </div>
      </header>

      <main suppressHydrationWarning className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
