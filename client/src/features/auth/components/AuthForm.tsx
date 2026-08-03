"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, UserCheck, Check, X, Mail, Lock, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuthFormProps {
  mode: "login" | "register" | "guest";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Validation Checklist Rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitted ${mode} form:`, { email, mode });
    // Push user to onboarding screen as requested
    router.push("/onboarding");
  };

  const handleGuestGenerate = () => {
    const randomGuestId = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log("Generated Guest Identity:", randomGuestId);
    router.push("/onboarding");
  };

  return (
    <Card className="w-full bg-[#151C33] border-white/10 shadow-2xl backdrop-blur-md">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 rounded-[16px] bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
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

      <CardContent className="space-y-4">
        {mode === "guest" ? (
          <div className="space-y-5">
            <div className="p-4 rounded-[14px] bg-blue-950/40 border border-blue-500/20 text-slate-300 text-xs leading-relaxed font-sans">
              <p className="font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Temporary Ascendant Mode
              </p>
              Your progress will be saved locally as a temporary Ascendant. You can convert to a permanent account anytime.
            </div>

            <div className="p-4 rounded-[14px] bg-[#0B1020] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Assigned Identity</span>
                <span className="text-base font-bold font-mono text-blue-400">Guest-4839</span>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ascendant@ascend.os"
                  className="pl-9 bg-[#0B1020] border-white/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9 bg-[#0B1020] border-white/10"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-sans">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="pl-9 bg-[#0B1020] border-white/10"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD VALIDATION CHECKLIST */}
                <div className="p-3.5 rounded-[14px] bg-[#0B1020] border border-white/10 space-y-2 mt-2">
                  <div className="text-[11px] font-semibold text-slate-400 font-sans mb-1">
                    Password Requirements:
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasMinLength ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />}
                      <span>Min. 8 Characters</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasUppercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />}
                      <span>Uppercase Letter</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasNumber ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />}
                      <span>Number (0-9)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasSpecialChar ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 text-slate-600" />}
                      <span>Special Character</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full h-11 text-xs font-bold mt-4 shadow-lg shadow-blue-600/25"
            >
              <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2 text-center text-xs text-slate-400 border-t border-white/5">
        <div className="flex items-center justify-center gap-4 w-full">
          {mode !== "login" && (
            <Link href="/login" className="hover:text-blue-400 transition-colors">
              Already have an account? <span className="text-blue-400 font-semibold underline underline-offset-4">Sign In</span>
            </Link>
          )}

          {mode !== "register" && mode !== "guest" && (
            <Link href="/register" className="hover:text-blue-400 transition-colors">
              New here? <span className="text-blue-400 font-semibold underline underline-offset-4">Create Account</span>
            </Link>
          )}
        </div>

        {mode !== "guest" && (
          <div>
            <Link href="/guest" className="text-slate-500 hover:text-slate-300 text-[11px] font-mono transition-colors">
              [ Continue as Guest ]
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

