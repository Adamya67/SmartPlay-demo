import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-lime-400/50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
