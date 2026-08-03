"use client";

import React from "react";
import { CharacterCard } from "@/features/character/components/CharacterCard";
import { User, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">Character Profile</h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">Manage your user identity and character domain boundaries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CharacterCard />
        <div className="saas-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 font-heading uppercase tracking-wider">Account Credentials</h3>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-3 space-y-2 text-xs font-sans text-slate-300">
            <p><strong>Email:</strong> shadowmonarch@ascend.os</p>
            <p><strong>Role:</strong> System Administrator</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
