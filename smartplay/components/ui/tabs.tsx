"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex rounded-full border border-white/10 bg-white/5 p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-full px-4 py-2 text-sm text-slate-300 transition data-[state=active]:bg-lime-400 data-[state=active]:text-slate-950",
        className,
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
