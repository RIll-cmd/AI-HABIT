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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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

  return (
    <Card suppressHydrationWarning className="w-full bg-[#151C33] border-white/10 shadow-2xl backdrop-blur-md">
      <CardHeader suppressHydrationWarning className="text-center pb-4">
        <div suppressHydrationWarning className="w-12 h-12 rounded-[16px] bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          {mode === "guest" ? (
            <UserCheck className="w-6 h-6 text-blue-400" />
          ) : mode === "register" ? (
            <UserPlus className="w-6 h-6 text-blue-400" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          )}
        </div>

        <CardTitle className="text-2xl font-bold font-heading text-white">
          {mode === "login"
            ? "Welcome Back, Ascendant"
            : mode === "register"
              ? "Create Your Account"
              : "Enter Guest Sandbox"}
        </CardTitle>

        <CardDescription className="text-xs text-slate-400 font-sans mt-1">
          {mode === "login"
            ? "Enter your credentials to access your RPG progression"
            : mode === "register"
              ? "Initialize your character profile & attribute matrix"
              : "Explore Ascend OS features as a temporary guest user"}
        </CardDescription>
      </CardHeader>

      <CardContent suppressHydrationWarning className="space-y-4">
        {mode === "guest" ? (
          <div suppressHydrationWarning className="space-y-5">
            <div suppressHydrationWarning className="p-4 rounded-[14px] bg-blue-950/40 border border-blue-500/20 text-slate-300 text-xs leading-relaxed font-sans">
              <p className="font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Temporary Ascendant Mode
              </p>
              Your progress will be saved locally as a temporary Ascendant. You
              can convert to a permanent account anytime.
            </div>

            <div suppressHydrationWarning className="p-4 rounded-[14px] bg-[#0B1020] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">
                  Assigned Identity
                </span>
                <span className="text-base font-bold font-mono text-blue-400">
                  Guest-4839
                </span>
              </div>
              <Badge variant="gold">Guest Level 1</Badge>
            </div>

            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={handleGuestGenerate}
              className="w-full h-11 text-xs font-bold shadow-lg shadow-blue-600/25"
            >
              <span>Generate Guest Identity</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div suppressHydrationWarning className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg font-sans">
                {errorMsg}
              </div>
            )}
            <div suppressHydrationWarning>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                Username
              </label>
              <div suppressHydrationWarning className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  placeholder="SAIKOU01"
                  className="pl-9 bg-[#0B1020] border-white/10 text-white"
                  required
                />
              </div>
            </div>

            <div suppressHydrationWarning>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                Password
              </label>
              <div suppressHydrationWarning className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10 bg-[#0B1020] border-white/10 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
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

            {mode === "register" && (
              <>
                {/* VALIDATION CHECKLIST */}
                <div suppressHydrationWarning className="p-3.5 rounded-[14px] bg-[#0B1020] border border-white/10 space-y-2 mt-2">
                  <div className="text-[11px] font-semibold text-slate-400 font-sans mb-1">
                    Account Requirements:
                  </div>

                  <div suppressHydrationWarning className="grid grid-cols-1 gap-2 text-[11px] font-sans">
                    <div
                      suppressHydrationWarning
                      className={`flex items-center gap-1.5 ${hasMinLength && hasMaxLength ? "text-emerald-400" : "text-slate-500"}`}
                    >
                      {hasMinLength && hasMaxLength ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                      )}
                      <span>Username: 3-20 Characters</span>
                    </div>

                    <div
                      suppressHydrationWarning
                      className={`flex items-center gap-1.5 ${isAlphanumeric && username.length > 0 ? "text-emerald-400" : "text-slate-500"}`}
                    >
                      {isAlphanumeric && username.length > 0 ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                      )}
                      <span>Letters, Numbers, Underscores Only</span>
                    </div>

                    <div
                      suppressHydrationWarning
                      className={`flex items-center gap-1.5 ${hasPasswordMinLength ? "text-emerald-400" : "text-slate-500"}`}
                    >
                      {hasPasswordMinLength ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                      )}
                      <span>Password: Minimum 6 Characters</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isLoading || (mode === "register" && (!isValidUsername || !hasPasswordMinLength)) || (mode === "login" && (!username || !password))}
              className="w-full h-11 text-xs font-bold mt-4 shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter suppressHydrationWarning className="flex flex-col gap-3 pt-2 text-center text-xs text-slate-400 border-t border-white/5">
        <div suppressHydrationWarning className="flex items-center justify-center gap-4 w-full">
          {mode !== "login" && (
            <Link
              href="/login"
              className="hover:text-blue-400 transition-colors"
            >
              Already have an account?{" "}
              <span className="text-blue-400 font-semibold underline underline-offset-4">
                Sign In
              </span>
            </Link>
          )}

          {mode !== "register" && mode !== "guest" && (
            <Link
              href="/register"
              className="hover:text-blue-400 transition-colors"
            >
              New here?{" "}
              <span className="text-blue-400 font-semibold underline underline-offset-4">
                Create Account
              </span>
            </Link>
          )}
        </div>

        {mode !== "guest" && (
          <div suppressHydrationWarning>
            <Link
              href="/guest"
              className="text-slate-500 hover:text-slate-300 text-[11px] font-mono transition-colors"
            >
              [ Continue as Guest ]
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
