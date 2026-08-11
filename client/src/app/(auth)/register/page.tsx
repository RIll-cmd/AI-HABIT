import React from "react";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function RegisterPage() {
  return (
    <div suppressHydrationWarning className="w-full">
      <AuthForm mode="register" />
    </div>
  );
}
