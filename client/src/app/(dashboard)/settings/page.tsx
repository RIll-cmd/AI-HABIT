"use client";

import React, { useState, useEffect } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useThemeStore, ThemeMode } from "@/store/useThemeStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Sparkles,
  Palette,
  Shield,
  Save,
  Check,
  Moon,
  Swords,
  Crown,
  Wand2,
  Target as TargetIcon,
  Zap,
} from "lucide-react";

const TITLE_OPTIONS = [
  "Wanderer",
  "Dreamer",
  "Scholar",
  "Adventurer",
  "Rookie",
  "Shadow Seeker",
];

const THEME_SWATCHES = [
  {
    name: "Blue",
    value: "blue-rpg",
    hex: "#2563EB",
    bg: "bg-blue-600",
  },
  {
    name: "Purple",
    value: "purple-rpg",
    hex: "#9333EA",
    bg: "bg-purple-600",
  },
  {
    name: "Green",
    value: "green-rpg",
    hex: "#10B981",
    bg: "bg-emerald-500",
  },
  {
    name: "Red",
    value: "red-rpg",
    hex: "#EF4444",
    bg: "bg-red-500",
  },
  {
    name: "Gold",
    value: "gold-rpg",
    hex: "#F59E0B",
    bg: "bg-amber-500",
  },
];

const AVATAR_ARCHETYPES = [
  {
    id: "warrior",
    label: "Warrior",
    avatar: "/avatars/warrior.png",
    fallback: "WR",
    icon: Swords,
    color: "from-red-600 to-amber-700",
  },
  {
    id: "mage",
    label: "Mage",
    avatar: "/avatars/mage.png",
    fallback: "MG",
    icon: Wand2,
    color: "from-purple-600 to-indigo-800",
  },
  {
    id: "rogue",
    label: "Rogue",
    avatar: "/avatars/rogue.png",
    fallback: "RG",
    icon: Zap,
    color: "from-emerald-600 to-teal-800",
  },
  {
    id: "ranger",
    label: "Ranger",
    avatar: "/avatars/ranger.png",
    fallback: "RN",
    icon: TargetIcon,
    color: "from-amber-600 to-yellow-700",
  },
  {
    id: "shadow-monarch",
    label: "Shadow Monarch",
    avatar: "/avatars/shadow-monarch.png",
    fallback: "SM",
    icon: Crown,
    color: "from-blue-600 to-indigo-900",
  },
];

export default function SettingsPage() {
  const { character, updateIdentity } = useCharacterStore();
  const { theme: mode, setTheme: setMode } = useThemeStore();

  const [name, setName] = useState(character?.name || "Shadow Monarch");
  const [title, setTitle] = useState(character?.title || "Shadow Seeker");
  const [accentTheme, setAccentTheme] = useState(
    character?.theme || "dark-rpg"
  );
  const [avatar, setAvatar] = useState(
    character?.avatar || "/avatars/shadow-monarch.png"
  );

  useEffect(() => {
    if (character) {
      setName(character.name || "Shadow Monarch");
      setTitle(character.title || "Shadow Seeker");
      setAccentTheme(character.theme || "dark-rpg");
      setAvatar(character.avatar || "/avatars/shadow-monarch.png");
    }
  }, [character]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateIdentity({
      name: name.trim() || "Ascendant",
      title,
      theme: accentTheme,
      avatar,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-blue-400" />
            Character & System Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Customize your RPG persona, cosmetic title, theme accents, and class
            archetype.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* PREVIEW HERO CARD */}
        <Card className="bg-[#151C33] border-blue-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Live Character Identity Preview
              </CardTitle>
              <Badge variant="default" className="text-[10px] font-mono">
                PREVIEW MODE
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex items-center gap-4">
            <Avatar className="w-16 h-16 rounded-[18px] border border-blue-500/50 shadow-md">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-[18px] bg-gradient-to-br from-blue-600 to-indigo-900 text-white font-bold">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl font-bold text-white font-heading tracking-tight">
                {name || "Ascendant"}
              </h2>
              <p className="text-xs text-blue-400 font-medium flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" /> {title}
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                <span>Level {character?.level || 1}</span>
                <span>•</span>
                <span>Rank {character?.rank || "F"}</span>
                <span>•</span>
                <span>⚡ {character?.power || 50} Power</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1. BASIC INFO */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>1. Character Basic Info</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Set your public character name displayed across dashboards and
              leaderboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <label className="text-xs font-mono text-slate-300 block font-semibold">
              Character Name (Max 20 characters)
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              maxLength={20}
              placeholder="Enter character name..."
              className="bg-[#0B1020] border-white/15 text-white max-w-md focus-visible:ring-blue-500 text-sm font-sans"
            />
            <p className="text-[11px] text-slate-500 font-mono">
              {name.length}/20 characters used
            </p>
          </CardContent>
        </Card>

        {/* 2. TITLE SELECTION */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>2. Cosmetic Title Selection</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Select an unlocked cosmetic title to showcase under your character
              name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {TITLE_OPTIONS.map((t) => {
                const isActive = title === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTitle(t)}
                    className={`px-4 py-2 rounded-[14px] text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                      isActive
                        ? "bg-blue-600/30 border-blue-500 text-blue-200 shadow-md shadow-blue-500/20"
                        : "bg-[#0B1020] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 3. THEME ACCENT */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>3. Theme Accent Color</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Choose your favorite RPG energy color scheme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {THEME_SWATCHES.map((swatch) => {
                const isActive =
                  accentTheme.includes(swatch.name.toLowerCase()) ||
                  accentTheme === swatch.value;
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setAccentTheme(swatch.value)}
                    className={`w-12 h-12 rounded-[14px] ${
                      swatch.bg
                    } flex items-center justify-center transition-all cursor-pointer relative shadow-md ${
                      isActive
                        ? `ring-4 ring-white/80 scale-110 shadow-xl`
                        : "opacity-75 hover:opacity-100 hover:scale-105"
                    }`}
                    title={swatch.name}
                  >
                    {isActive && (
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Selected Theme Accent:{" "}
              <strong className="text-white capitalize">{accentTheme}</strong>
            </p>
          </CardContent>
        </Card>

        {/* 4. AVATAR ARCHETYPE */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Swords className="w-4 h-4 text-emerald-400" />
              <span>4. Avatar Archetype</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Select your active character display portrait from available RPG
              classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {AVATAR_ARCHETYPES.map((arch) => {
                const isActive = avatar === arch.avatar;
                const ClassIcon = arch.icon;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setAvatar(arch.avatar)}
                    className={`p-4 rounded-[18px] bg-[#0B1020] border transition-all cursor-pointer flex flex-col items-center gap-3 relative group ${
                      isActive
                        ? "border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/20"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    <Avatar className="w-14 h-14 rounded-[16px] border border-white/15">
                      <AvatarImage src={arch.avatar} alt={arch.label} />
                      <AvatarFallback
                        className={`rounded-[16px] bg-gradient-to-br ${arch.color} text-white font-bold text-sm`}
                      >
                        {arch.fallback}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                      <span className="text-xs font-bold text-white font-heading block">
                        {arch.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1 mt-0.5">
                        <ClassIcon className="w-3 h-3 text-slate-500" /> Class
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SYSTEM MODE SETTING INTEGRATION */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>5. Platform Display Mode</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Toggle global application color scheme.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-mono">
              Active Mode:{" "}
              <strong className="text-blue-400 uppercase">{mode}</strong>
            </span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ThemeMode)}
              className="bg-[#0B1020] border border-white/15 text-white text-xs px-3 py-2 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            >
              <option value="dark">Dark Mode (#0B1020)</option>
              <option value="light">Light Mode</option>
              <option value="system">System Default</option>
            </select>
          </CardContent>
        </Card>

        {/* SAVE ACTION BUTTON */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98] px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
