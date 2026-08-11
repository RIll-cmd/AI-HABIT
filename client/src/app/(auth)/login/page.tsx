import React from "react";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <div suppressHydrationWarning className="w-full">
      <AuthForm mode="login" />
    </div>
  );
}
