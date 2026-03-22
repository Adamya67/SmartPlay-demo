import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <Skeleton className="mb-4 h-4 w-28" />
          <Skeleton className="mb-3 h-10 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}
