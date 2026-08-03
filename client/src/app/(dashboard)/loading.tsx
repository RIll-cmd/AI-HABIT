import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[#151C33]" />
          <Skeleton className="h-4 w-96 bg-[#151C33]" />
        </div>
        <Skeleton className="h-9 w-36 bg-[#151C33] rounded-[14px]" />
      </div>

      {/* 6-CARD GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 rounded-[20px] bg-[#151C33] border border-white/10 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36 bg-[#0B1020]" />
              <Skeleton className="h-5 w-16 bg-[#0B1020] rounded-[10px]" />
            </div>
            <Skeleton className="h-20 w-full bg-[#0B1020] rounded-[14px]" />
            <Skeleton className="h-9 w-full bg-[#0B1020] rounded-[14px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
