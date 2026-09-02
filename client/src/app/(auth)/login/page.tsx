"use client";

import React from "react";
import { AuthCard } from "@/components/v2/auth/AuthCard";

export default function LoginPage() {
  return (
    <div suppressHydrationWarning className="w-full flex justify-center">
      <AuthCard initialTab="login" />
    </div>
  );
}
