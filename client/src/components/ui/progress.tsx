"use client";

import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indicatorClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, indicatorClassName = "bg-blue-500", ...props }, ref) => {
    const percentage = Math.max(0, Math.min(100, value || 0));

    return (
      <div
        ref={ref}
        className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}
        {...props}
      >
        <div
          className={`h-full w-full flex-1 transition-all duration-300 ease-in-out ${indicatorClassName}`}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
