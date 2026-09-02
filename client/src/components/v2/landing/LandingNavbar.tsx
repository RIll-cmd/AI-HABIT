"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Shield, Menu, X, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingNavbarProps {
  onSignInClick?: () => void;
  onGetStartedClick?: () => void;
}

export function LandingNavbar({
  onSignInClick,
  onGetStartedClick,
}: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSignInClick) {
      onSignInClick();
    } else {
      const el = document.getElementById("auth-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      const el = document.getElementById("auth-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Telemetry Status */}
        <Link
          href="/v2"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/80 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              ASCEND OS
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
              Executive Deck v2.4
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
          <a
            href="#features"
            onClick={scrollToSection("features")}
            className="hover:text-zinc-100 transition-colors py-1 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md outline-none"
          >
            Quests
          </a>
          <a
            href="#stats"
            onClick={scrollToSection("features")}
            className="hover:text-zinc-100 transition-colors py-1 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md outline-none"
          >
            Stats
          </a>
          <a
            href="#arsenal"
            onClick={scrollToSection("features")}
            className="hover:text-zinc-100 transition-colors py-1 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md outline-none"
          >
            RPG Arsenal
          </a>
          <a
            href="#system-docs"
            onClick={scrollToSection("features")}
            className="hover:text-zinc-100 transition-colors py-1 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md outline-none"
          >
            System Docs
          </a>
        </nav>

        {/* Desktop CTA Action Group */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sign In Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleSignIn}
            className="min-h-[40px] px-3.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            <span>Sign In</span>
          </Button>

          {/* Primary Begin Ascension CTA */}
          <Button
            type="button"
            onClick={handleGetStarted}
            className="min-h-[40px] px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-xs transition-all shadow-md shadow-cyan-950/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 flex items-center gap-1.5"
          >
            <span>Begin Ascension</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="text-zinc-400 hover:text-white rounded-xl min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-zinc-950/95 border-b border-zinc-800 flex flex-col gap-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2 text-sm text-zinc-300">
            <a
              href="#features"
              onClick={scrollToSection("features")}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Quests
            </a>
            <a
              href="#stats"
              onClick={scrollToSection("features")}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Stats
            </a>
            <a
              href="#arsenal"
              onClick={scrollToSection("features")}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              RPG Arsenal
            </a>
            <a
              href="#system-docs"
              onClick={scrollToSection("features")}
              className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              System Docs
            </a>
          </nav>

          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-850">
            <Button
              type="button"
              variant="outline"
              onClick={handleSignIn}
              className="w-full min-h-[44px] rounded-xl bg-zinc-900 text-zinc-200 border-zinc-700"
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={handleGetStarted}
              className="w-full min-h-[44px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-sm shadow-md"
            >
              Begin Ascension
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
