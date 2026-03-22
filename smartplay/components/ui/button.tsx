import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-lime-400 px-5 py-3 text-slate-950 shadow-[0_12px_40px_rgba(163,230,53,0.35)] hover:bg-lime-300",
        secondary:
          "border border-white/12 bg-white/5 px-5 py-3 text-white hover:bg-white/10",
        ghost: "px-4 py-2 text-slate-200 hover:bg-white/8",
        outline:
          "border border-slate-800 bg-slate-950 px-5 py-3 text-white hover:border-lime-400/50 hover:bg-slate-900",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
