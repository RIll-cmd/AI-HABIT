"use client";

import React, { useState, useRef, useEffect } from "react";
import { KeyRound, ArrowLeft, RefreshCw, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface V2OtpFormProps {
  email?: string;
  onBackToLogin?: () => void;
  onSuccess?: () => void;
  forceLoading?: boolean;
  forceError?: string | null;
  forceSuccess?: boolean;
}

export function V2OtpForm({
  email = "hunter_ciel@ascend.io",
  onBackToLogin,
  onSuccess,
  forceLoading = false,
  forceError = null,
  forceSuccess = false,
}: V2OtpFormProps) {
  const [digits, setDigits] = useState<string[]>(["7", "4", "2", "9", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(42);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const activeError = forceError ?? localError;
  const isLoading = forceLoading || isSubmitting;

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    if (localError) setLocalError(null);
    const cleaned = value.replace(/[^0-9]/g, "");

    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    // Handle single digit
    if (cleaned.length === 1) {
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      setDigits(newDigits);

      // Auto-advance to next box
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    // Handle paste across multiple inputs
    const pasted = cleaned.slice(0, 6).split("");
    const newDigits = [...digits];
    pasted.forEach((char, i) => {
      if (index + i < 6) {
        newDigits[index + i] = char;
      }
    });
    setDigits(newDigits);

    const nextIndex = Math.min(5, index + pasted.length);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join("");
    if (fullCode.length < 6) {
      setLocalError("Please enter all 6 digits of the security token.");
      return;
    }

    setLocalError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    }, 900);
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(60);
    setLocalError(null);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Two-Factor Neural Verification
          </h2>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          A single-use 6-digit access code was dispatched to{" "}
          <span className="font-mono text-cyan-300 font-medium">{email}</span>.
        </p>
      </div>

      {/* Success Notification */}
      {forceSuccess && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-1"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-emerald-100">Code Authenticated</span>
            <span className="text-[11px] text-emerald-300/80">
              Granting elevated access to Hunter Command Deck...
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {activeError && !forceSuccess && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-100">Verification Token Invalid</span>
            <span className="text-[11px] text-rose-300/90">{activeError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 6-box OTP Input Array */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              aria-label={`Verification digit ${index + 1} of 6`}
              className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl font-mono font-bold bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 text-zinc-100 rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            />
          ))}
        </div>

        {/* Resend Action */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Didn&apos;t receive token?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCountdown > 0 || isLoading}
            className={`font-semibold flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md outline-none px-1 ${
              resendCountdown > 0
                ? "text-zinc-500 cursor-not-allowed"
                : "text-cyan-400 hover:text-cyan-300 hover:underline"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${resendCountdown > 0 ? "" : "group-hover:rotate-180 transition-transform"}`} />
            {resendCountdown > 0 ? (
              <span>Resend in {resendCountdown}s</span>
            ) : (
              <span>Request Fresh Code</span>
            )}
          </button>
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
              <span>Validating Token Signature...</span>
            </div>
          ) : (
            <span>Authenticate & Access Deck</span>
          )}
        </Button>
      </form>

      {/* Return to Login */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer py-1.5 px-3 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Primary Identification</span>
        </button>
      </div>
    </div>
  );
}
