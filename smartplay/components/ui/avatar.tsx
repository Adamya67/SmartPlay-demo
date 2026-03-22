"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils/cn";

export function Avatar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

export const AvatarImage = AvatarPrimitive.Image;

export function AvatarFallback({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center bg-white/10 text-sm font-semibold text-white",
        className,
      )}
      {...props}
    />
  );
}
