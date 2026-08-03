import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[10px] border px-2.5 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600/20 text-blue-300 border-blue-500/30",
        secondary:
          "border-transparent bg-white/5 text-slate-300 border-white/10",
        destructive:
          "border-transparent bg-red-600/20 text-red-300 border-red-500/30",
        outline: "text-slate-300 border-white/10",
        gold: "border-transparent bg-amber-500/20 text-amber-300 border-amber-500/30",
        success:
          "border-transparent bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
