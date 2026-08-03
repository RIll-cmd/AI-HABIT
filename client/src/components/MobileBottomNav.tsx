"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Flame, User, Menu } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Missions", href: "/missions", icon: Target },
    { name: "Tower", href: "/tower", icon: Flame },
    { name: "Profile", href: "/character", icon: User },
    { name: "Settings", href: "/settings", icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B1020]/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around z-50 px-2 font-sans">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-[12px] transition-colors ${
              isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
            <span className="text-[10px] tracking-tight font-mono">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
