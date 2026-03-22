import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-lime-400/20 bg-lime-400/10 text-lime-200",
        secondary: "border-white/10 bg-white/5 text-slate-200",
        danger: "border-rose-400/20 bg-rose-400/10 text-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
