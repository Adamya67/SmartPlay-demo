import { cn } from "@/lib/utils/cn";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-white/8", className)}
      {...props}
    />
  );
}
