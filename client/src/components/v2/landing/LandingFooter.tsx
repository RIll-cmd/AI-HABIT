"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Shield, Lock, Activity, ArrowRight } from "lucide-react";

export function LandingFooter() {
  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAuth = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("auth-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800/80 pt-16 pb-12 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Covenant Summary (Spans 2 cols on LG) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight font-sans">
                  ASCEND OS
                </span>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  Solo Leveling Life-RPG
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-normal">
              The executive operating system that converts real-world habits, gym exertion, and walking steps into tangible character attributes, raid boss damage, and permanent progression.
            </p>

            {/* Security Badges */}
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span className="text-[11px]">Zero-Knowledge Hashing</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px]">Client Sandbox</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Pillars */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
              Core Pillars
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-400">
              <li>
                <a
                  href="#features"
                  onClick={scrollToSection("features")}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Neural Habit Matrix
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={scrollToSection("features")}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  16-Muscle Gym Terminal
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={scrollToSection("features")}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Bestiary Pedometer Sync
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={scrollToSection("features")}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  AIRA Neural Administrator
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: RPG Progression */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
              RPG Progression
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-400">
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Solo Leveling Ranks
                </a>
              </li>
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Gate Boss Calamities
                </a>
              </li>
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Equipment Sockets & Armory
                </a>
              </li>
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Tri-Currency Economy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Terminal Access */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
              Terminal Access
            </span>
            <ul className="flex flex-col gap-2 text-xs text-zinc-400">
              <li>
                <Link
                  href="/v2/login"
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Direct Login Portal
                </Link>
              </li>
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Commission Hunter License
                </a>
              </li>
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Explore Guest Sandbox
                </a>
              </li>
              <li>
                <a
                  href="#auth-section"
                  onClick={scrollToAuth}
                  className="hover:text-zinc-200 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded outline-none"
                >
                  Two-Factor Recovery
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-900 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Ascend OS Protocol. Built for high-agency human discipline.</p>

          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-zinc-400">
              PROTOCOL: v2.4.0-preview
            </span>
            <span className="text-zinc-700">•</span>
            <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEMS NORMAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
