import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning className="min-h-screen w-full bg-[#0B1020] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* AMBIENT BACKGROUND GLOW */}
      <div suppressHydrationWarning className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div suppressHydrationWarning className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP BAR / BACK TO LANDING */}
      <header suppressHydrationWarning className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-slate-400 hover:text-white hover:bg-white/5"
        >
          <Link href="/landing" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <Link
          href="/landing"
          className="flex items-center gap-2 text-lg font-bold text-white font-heading group"
        >
          <div suppressHydrationWarning className="w-8 h-8 rounded-[12px] bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-500 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline tracking-wider">ASCEND OS</span>
        </Link>
      </header>

      {/* MAIN CENTERED AUTH CONTENT CONTAINER */}
      <main suppressHydrationWarning className="relative z-10 w-full max-w-md my-auto pt-16 pb-8">
        {children}
      </main>
    </div>
  );
}
