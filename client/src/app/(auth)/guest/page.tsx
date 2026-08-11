import React from "react";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function GuestPage() {
  return (
    <div suppressHydrationWarning className="w-full">
      <AuthForm mode="guest" />;
    </div>
  );
}
