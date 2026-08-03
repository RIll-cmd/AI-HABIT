import React from "react";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function GuestPage() {
  return <AuthForm mode="guest" />;
}
