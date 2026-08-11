"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Check,
  X,
  User,
  Sparkles,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Swords,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthFormProps {
  mode: "login" | "register" | "guest";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Username & Password Validation Rules
  const hasMinLength = username.length >= 3;
  const hasMaxLength = username.length <= 20;
  const isAlphanumeric = /^[a-zA-Z0-9_]+$/.test(username);
  const isValidUsername = hasMinLength && hasMaxLength && isAlphanumeric;
  const hasPasswordMinLength = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && (!isValidUsername || !hasPasswordMinLength)) return;
    if (mode === "login" && (!username || !password)) return;
    
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.detail || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      // Success
      if (data.token && (data.user || data.username)) {
        useAuthStore.getState().setAuth(data.user || { id: data.characterId || username, username }, data.token);
      } else {
        await useAuthStore.getState().checkAuth();
      }
      
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please ensure backend is running.");
      setIsLoading(false);
    }
  };

  const handleGuestGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.detail || "Guest login failed.");
        setIsLoading(false);
        return;
      }

      if (data.token && (data.user || data.username)) {
        useAuthStore.getState().setAuth(data.user || { id: data.characterId || data.username, username: data.username }, data.token);
      } else {
        await useAuthStore.getState().checkAuth();
      }
      
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error.");
      setIsLoading(false);
    }
  };

  const modeConfig = {
    login: {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Welcome Back, Ascendant",
      subtitle: "Enter your credentials to access your RPG progression",
      accentFrom: "from-cyan-400",
      accentTo: "to-blue-500",
      glowColor: "rgba(6, 182, 212, 0.15)",
      borderColor: "border-cyan-500/20",
      ringColor: "ring-cyan-500/30",
    },
    register: {
      icon: <UserPlus className="w-7 h-7" />,
      title: "Create Your Account",
      subtitle: "Initialize your character profile & attribute matrix",
      accentFrom: "from-violet-400",
      accentTo: "to-indigo-500",
      glowColor: "rgba(139, 92, 246, 0.15)",
      borderColor: "border-violet-500/20",
      ringColor: "ring-violet-500/30",
    },
    guest: {
      icon: <UserCheck className="w-7 h-7" />,
      title: "Enter Guest Sandbox",
      subtitle: "Explore Ascend OS features as a temporary guest user",
      accentFrom: "from-amber-400",
      accentTo: "to-orange-500",
      glowColor: "rgba(245, 158, 11, 0.15)",
      borderColor: "border-amber-500/20",
      ringColor: "ring-amber-500/30",
    },
  };

  const config = modeConfig[mode];

  return (
    <div suppressHydrationWarning className="auth-form-wrapper relative">
      {/* CARD GLOW HALO */}
      <div
        suppressHydrationWarning
        className="absolute -inset-[1px] rounded-[24px] opacity-60 blur-xl pointer-events-none auth-halo-pulse"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${config.glowColor}, transparent 70%)` }}
      />

      {/* MAIN CARD */}
      <div suppressHydrationWarning className={`relative w-full rounded-[24px] border ${config.borderColor} bg-[#0a0f1e]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden`}>
        {/* TOP EDGE GRADIENT LINE */}
        <div suppressHydrationWarning className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${config.accentFrom} via-transparent ${config.accentTo} opacity-60`} />

        {/* INNER NOISE TEXTURE */}
        <div suppressHydrationWarning className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* HEADER SECTION */}
        <div suppressHydrationWarning className="relative px-8 pt-8 pb-5 text-center">
          {/* ANIMATED ICON CONTAINER */}
          <div suppressHydrationWarning className="auth-icon-container mx-auto mb-5 relative">
            {/* Spinning border ring */}
            <div className="absolute -inset-[3px] rounded-[20px] auth-icon-ring" style={{
              background: `conic-gradient(from 0deg, transparent, ${config.glowColor}, transparent, ${config.glowColor}, transparent)`,
            }} />
            <div className={`relative w-16 h-16 rounded-[18px] bg-gradient-to-br ${config.accentFrom} ${config.accentTo} flex items-center justify-center text-white shadow-lg z-10`} style={{
              boxShadow: `0 0 30px ${config.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
            }}>
              {config.icon}
            </div>
            {/* Floating sparkle particles around icon */}
            <div className="auth-icon-sparkle auth-icon-sparkle-1">✦</div>
            <div className="auth-icon-sparkle auth-icon-sparkle-2">✧</div>
            <div className="auth-icon-sparkle auth-icon-sparkle-3">✦</div>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold font-heading text-white mb-1.5 tracking-wide">
            {config.title}
          </h1>

          {/* SUBTITLE WITH DECORATIVE LINES */}
          <div className="flex items-center gap-3 justify-center">
            <div className={`h-[1px] w-8 bg-gradient-to-r from-transparent ${config.accentFrom} opacity-40`} />
            <p className="text-xs text-slate-400 font-sans">
              {config.subtitle}
            </p>
            <div className={`h-[1px] w-8 bg-gradient-to-l from-transparent ${config.accentTo} opacity-40`} />
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div suppressHydrationWarning className="px-8 pb-3">
          {mode === "guest" ? (
            <div suppressHydrationWarning className="space-y-5">
              {/* GUEST INFO CARD */}
              <div suppressHydrationWarning className="relative p-4 rounded-[16px] bg-gradient-to-br from-amber-950/30 to-orange-950/20 border border-amber-500/15 text-slate-300 text-xs leading-relaxed font-sans overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <p className="font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5 relative z-10">
                  <Sparkles className="w-3.5 h-3.5" />
                  Temporary Ascendant Mode
                </p>
                <span className="relative z-10">
                  Your progress will be saved locally as a temporary Ascendant. You
                  can convert to a permanent account anytime.
                </span>
              </div>

              {/* IDENTITY DISPLAY */}
              <div suppressHydrationWarning className="p-4 rounded-[16px] bg-[#080d1a] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-600 block tracking-widest">
                    Assigned Identity
                  </span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    Guest-4839
                  </span>
                </div>
                <Badge variant="gold">Guest Level 1</Badge>
              </div>

              {/* GUEST SUBMIT BUTTON */}
              <button
                type="button"
                onClick={handleGuestGenerate}
                disabled={isLoading}
                className="auth-submit-btn w-full h-12 rounded-[14px] font-bold text-sm tracking-wide text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <><span className="auth-spinner" /> Generating...</>
                  ) : (
                    <>Generate Guest Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </button>
            </div>
          ) : (
            <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-5">
              {/* ERROR MESSAGE */}
              {errorMsg && (
                <div suppressHydrationWarning className="relative p-3.5 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded-[14px] font-sans flex items-start gap-2.5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5 relative z-10">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="relative z-10">{errorMsg}</span>
                </div>
              )}

              {/* USERNAME FIELD */}
              <div suppressHydrationWarning className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 font-sans">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Username
                </label>
                <div suppressHydrationWarning className="auth-input-wrapper relative group">
                  <div className="absolute -inset-[1px] rounded-[14px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-blue-500/0 group-focus-within:from-cyan-500/30 group-focus-within:via-blue-500/20 group-focus-within:to-indigo-500/30 transition-all duration-500 opacity-0 group-focus-within:opacity-100" />
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3 transition-colors group-focus-within:text-cyan-400" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      placeholder="SAIKOU01"
                      className="pl-10 h-10 bg-[#080d1a] border-white/8 text-white rounded-[13px] focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 placeholder:text-slate-600 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div suppressHydrationWarning className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 font-sans">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Password
                </label>
                <div suppressHydrationWarning className="auth-input-wrapper relative group">
                  <div className="absolute -inset-[1px] rounded-[14px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-blue-500/0 group-focus-within:from-cyan-500/30 group-focus-within:via-blue-500/20 group-focus-within:to-indigo-500/30 transition-all duration-500 opacity-0 group-focus-within:opacity-100" />
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3 transition-colors group-focus-within:text-cyan-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-11 h-10 bg-[#080d1a] border-white/8 text-white rounded-[13px] focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 placeholder:text-slate-600 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-600 hover:text-cyan-400 transition-colors duration-200"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* REGISTER VALIDATION CHECKLIST */}
              {mode === "register" && (
                <div suppressHydrationWarning className="p-4 rounded-[16px] bg-[#080d1a] border border-white/5 space-y-2.5">
                  <div className="text-[10px] font-semibold text-slate-500 font-sans tracking-widest uppercase mb-2 flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    Account Requirements
                  </div>

                  <div suppressHydrationWarning className="grid grid-cols-1 gap-2.5 text-[11px] font-sans">
                    <div
                      suppressHydrationWarning
                      className={`flex items-center gap-2 transition-colors duration-300 ${hasMinLength && hasMaxLength ? "text-emerald-400" : "text-slate-600"}`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${hasMinLength && hasMaxLength ? "bg-emerald-500/20 ring-1 ring-emerald-500/40" : "bg-slate-800 ring-1 ring-slate-700"}`}>
                        {hasMinLength && hasMaxLength ? (
                          <Check className="w-2.5 h-2.5 shrink-0" />
                        ) : (
                          <X className="w-2.5 h-2.5 shrink-0" />
                        )}
                      </div>
                      <span>Username: 3-20 Characters</span>
                    </div>

                    <div
                      suppressHydrationWarning
                      className={`flex items-center gap-2 transition-colors duration-300 ${isAlphanumeric && username.length > 0 ? "text-emerald-400" : "text-slate-600"}`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${isAlphanumeric && username.length > 0 ? "bg-emerald-500/20 ring-1 ring-emerald-500/40" : "bg-slate-800 ring-1 ring-slate-700"}`}>
                        {isAlphanumeric && username.length > 0 ? (
                          <Check className="w-2.5 h-2.5 shrink-0" />
                        ) : (
                          <X className="w-2.5 h-2.5 shrink-0" />
                        )}
                      </div>
                      <span>Letters, Numbers, Underscores Only</span>
                    </div>

                    <div
                      suppressHydrationWarning
                      className={`flex items-center gap-2 transition-colors duration-300 ${hasPasswordMinLength ? "text-emerald-400" : "text-slate-600"}`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${hasPasswordMinLength ? "bg-emerald-500/20 ring-1 ring-emerald-500/40" : "bg-slate-800 ring-1 ring-slate-700"}`}>
                        {hasPasswordMinLength ? (
                          <Check className="w-2.5 h-2.5 shrink-0" />
                        ) : (
                          <X className="w-2.5 h-2.5 shrink-0" />
                        )}
                      </div>
                      <span>Password: Minimum 6 Characters</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading || (mode === "register" && (!isValidUsername || !hasPasswordMinLength)) || (mode === "login" && (!username || !password))}
                className="auth-submit-btn w-full h-12 rounded-[14px] font-bold text-sm tracking-wide text-white relative overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                style={{ background: mode === 'register'
                  ? 'linear-gradient(135deg, #8b5cf6, #6d28d9, #4c1d95)'
                  : 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                {/* Subtle pulse glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  boxShadow: mode === 'register'
                    ? 'inset 0 0 30px rgba(139, 92, 246, 0.3)'
                    : 'inset 0 0 30px rgba(6, 182, 212, 0.3)',
                }} />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <><span className="auth-spinner" /> Authenticating...</>
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div suppressHydrationWarning className="relative px-8 py-5 border-t border-white/5">
          {/* Feature badges row — only on login */}
          {mode === "login" && (
            <div suppressHydrationWarning className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                <Zap className="w-3 h-3 text-cyan-700" />
                <span>Level System</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-800" />
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                <Swords className="w-3 h-3 text-cyan-700" />
                <span>RPG Combat</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-800" />
              <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                <Shield className="w-3 h-3 text-cyan-700" />
                <span>AI Assistant</span>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <div suppressHydrationWarning className="flex items-center justify-center gap-5 text-xs text-slate-500">
            {mode !== "login" && (
              <Link
                href="/login"
                className="hover:text-cyan-400 transition-colors duration-200 group/link"
              >
                Already have an account?{" "}
                <span className="text-cyan-500 font-semibold group-hover/link:underline underline-offset-4">
                  Sign In
                </span>
              </Link>
            )}

            {mode !== "register" && mode !== "guest" && (
              <Link
                href="/register"
                className="hover:text-cyan-400 transition-colors duration-200 group/link"
              >
                New here?{" "}
                <span className="text-cyan-500 font-semibold group-hover/link:underline underline-offset-4">
                  Create Account
                </span>
              </Link>
            )}
          </div>

          {mode !== "guest" && (
            <div suppressHydrationWarning className="text-center mt-3">
              <Link
                href="/guest"
                className="text-slate-600 hover:text-slate-400 text-[10px] font-mono transition-colors duration-200 tracking-widest uppercase"
              >
                [ Continue as Guest ]
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* INLINE STYLES */}
      <style>{`
        .auth-form-wrapper {
          perspective: 1000px;
        }

        .auth-halo-pulse {
          animation: auth-halo 4s ease-in-out infinite;
        }
        @keyframes auth-halo {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .auth-icon-container {
          width: 64px;
          height: 64px;
          position: relative;
        }
        .auth-icon-ring {
          animation: auth-icon-spin 8s linear infinite;
          border-radius: 20px;
        }
        @keyframes auth-icon-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-icon-sparkle {
          position: absolute;
          font-size: 10px;
          color: rgba(6, 182, 212, 0.5);
          animation: auth-sparkle-float 3s ease-in-out infinite;
          pointer-events: none;
        }
        .auth-icon-sparkle-1 { top: -6px; right: -6px; animation-delay: 0s; }
        .auth-icon-sparkle-2 { bottom: -4px; left: -8px; animation-delay: 1s; }
        .auth-icon-sparkle-3 { top: 50%; right: -10px; animation-delay: 2s; }
        @keyframes auth-sparkle-float {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 1; transform: translateY(-5px) scale(1); }
        }

        .auth-submit-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }
        .auth-submit-btn:not(:disabled):active {
          transform: translateY(0px) scale(0.99);
        }

        .auth-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: auth-spin 0.6s linear infinite;
        }
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
