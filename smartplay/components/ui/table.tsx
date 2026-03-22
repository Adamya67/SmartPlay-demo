import { cn } from "@/lib/utils/cn";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-white/5", className)} {...props} />;
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400", className)}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-3 text-slate-100", className)} {...props} />;
}
