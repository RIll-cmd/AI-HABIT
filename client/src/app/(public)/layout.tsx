import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* MINIMAL TOP NAV BAR */}
      <header className="w-full h-20 px-8 border-b border-white/10 bg-[#0B1020]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <Link href="/landing" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[14px] bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30 group-hover:bg-blue-500 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg font-heading text-white tracking-wider">
              ASCEND OS
            </span>
            <span className="text-[10px] text-blue-400 font-mono block -mt-1">
              LIFE RPG PLATFORM
            </span>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
