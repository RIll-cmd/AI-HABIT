import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[16px] text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-heading cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-500 shadow-md",
        destructive: "bg-red-600 text-white hover:bg-red-500 shadow-md",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-slate-200",
        secondary: "bg-[#151C33] text-slate-100 hover:bg-[#1e2745] border border-white/10",
        ghost: "hover:bg-white/5 text-slate-300 hover:text-white",
        link: "text-blue-400 underline-offset-4 hover:underline",
        gold: "bg-[#F6C453] text-slate-950 font-bold hover:bg-[#f8cf70] shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
