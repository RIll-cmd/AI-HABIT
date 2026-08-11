import React from "react";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";

export default function DashboardPage() {
  return (
    <div suppressHydrationWarning className="w-full">
      <DashboardOverview />
    </div>
  );
}
