"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils/cn";

export function Switch({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 transition data-[state=checked]:bg-lime-400",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white transition data-[state=checked]:translate-x-[22px]" />
    </SwitchPrimitive.Root>
  );
}
