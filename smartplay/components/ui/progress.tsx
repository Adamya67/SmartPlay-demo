"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils/cn";

export function Progress({
  className,
  value,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2 overflow-hidden rounded-full bg-white/10", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-lime-400 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
