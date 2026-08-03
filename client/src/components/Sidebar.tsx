"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Target,
  Flame,
  Package,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const sidebarNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Character", href: "/character", icon: User },
    { name: "Missions", href: "/missions", icon: Target },
    { name: "Tower", href: "/tower", icon: Flame },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "AI System", href: "/ai-system", icon: Bot },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex flex-col border-r border-white/10 bg-[#0B1020] shrink-0 select-none font-sans hidden md:flex">
      {/* LOGO */}
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[12px] bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-500 transition-colors">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold tracking-wider text-base font-heading text-white">
              ASCEND OS
            </h1>
            <p className="text-[10px] text-blue-400 font-mono">
              LIFE RPG PLATFORM
            </p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER NAV / LOG OUT */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        <Link
          href="/landing"
          className="w-full py-2.5 px-3.5 rounded-[14px] bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-3 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit to Landing</span>
        </Link>
      </div>
    </aside>
  );
}
