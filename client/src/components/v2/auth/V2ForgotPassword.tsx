"use client";

import React, { useState } from "react";
import { Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle2, ShieldQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface V2ForgotPasswordProps {
  onBackToLogin?: () => void;
  onSuccess?: () => void;
  forceLoading?: boolean;
  forceError?: string | null;
  forceSuccess?: boolean;
}

export function V2ForgotPassword({
  onBackToLogin,
  onSuccess,
  forceLoading = false,
  forceError = null,
  forceSuccess = false,
}: V2ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [botTrap, setBotTrap] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const activeError = forceError ?? localError;
  const isLoading = forceLoading || isSubmitting;
  const isSuccess = forceSuccess || !!submittedEmail;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (botTrap) return;

    if (!email.trim() || !email.includes("@")) {
      setLocalError("Please enter a valid communications email.");
      return;
    }

    setLocalError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEmail(email);
      if (onSuccess) onSuccess();
    }, 900);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldQuestion className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Recover Terminal Access
          </h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Provide the registered email associated with your Hunter License. We will transmit an encrypted recovery token.
        </p>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-1"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-emerald-100">Recovery Token Transmitted</span>
            <span className="text-[11px] text-emerald-300/80 leading-relaxed">
              If an active operative account exists for{" "}
              <strong className="text-white font-mono">{submittedEmail || email || "your email"}</strong>, instructions have been dispatched. Check your spam and archive directories.
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {activeError && !isSuccess && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-100">Transmission Failed</span>
            <span className="text-[11px] text-rose-300/90">{activeError}</span>
          </div>
        </div>
      )}

      {!isSuccess && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Honeypot Bot Trap */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true">
            <label htmlFor="v2_forgot_bot_trap">Do not fill this field</label>
            <input
              id="v2_forgot_bot_trap"
              type="text"
              name="bot_trap"
              tabIndex={-1}
              value={botTrap}
              onChange={(e) => setBotTrap(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="v2_forgot_email"
              className="text-xs font-semibold text-zinc-300 flex items-center justify-between"
            >
              <span>Operative Account Email</span>
              <span className="text-[11px] font-normal text-zinc-500">Registered Address</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                id="v2_forgot_email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(null);
                }}
                required
                disabled={isLoading}
                placeholder="hunter@ascend.io"
                className="pl-10 min-h-[44px] bg-zinc-900/90 border-zinc-800 focus:border-cyan-500 text-zinc-100 placeholder:text-zinc-600 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-cyan-950/40 cursor-pointer mt-2 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching Recovery Token...</span>
              </div>
            ) : (
              <span>Send Recovery Instructions</span>
            )}
          </Button>
        </form>
      )}

      {/* Return to Login */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer py-1.5 px-3 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sign In</span>
        </button>
      </div>
    </div>
  );
}
