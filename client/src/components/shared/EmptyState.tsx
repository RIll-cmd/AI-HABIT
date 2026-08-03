import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`bg-[#151C33] border-white/10 shadow-xl ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-[18px] bg-[#0B1020] border border-white/10 text-slate-500 flex items-center justify-center mb-4 shadow-inner">
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-white font-heading">{title}</h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm font-sans leading-relaxed">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}
