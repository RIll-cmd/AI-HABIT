import React from "react";

export const metadata = {
  title: "Ascend OS | Authentication Matrix (V2)",
  description: "Next-generation cybernetic login and operative license commission deck.",
};

export default function V2AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {children}
    </div>
  );
}
