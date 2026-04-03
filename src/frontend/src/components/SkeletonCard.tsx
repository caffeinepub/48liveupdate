import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: "post" | "member" | "thread";
  className?: string;
}

export default function SkeletonCard({
  variant = "post",
  className,
}: SkeletonCardProps) {
  if (variant === "member") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card overflow-hidden",
          className,
        )}
      >
        <div className="aspect-[3/4] skeleton-pulse" />
        <div className="p-4 space-y-2.5">
          <div className="skeleton-pulse h-4 w-3/4 rounded" />
          <div className="skeleton-pulse h-3 w-1/2 rounded" />
          <div className="skeleton-pulse h-8 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === "thread") {
    return (
      <div className={cn("flex items-start gap-4 py-4 px-4", className)}>
        <div className="flex flex-col items-center gap-1 min-w-[44px]">
          <div className="skeleton-pulse h-5 w-5 rounded" />
          <div className="skeleton-pulse h-3 w-6 rounded" />
        </div>
        <div className="skeleton-pulse h-8 w-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-pulse h-3 w-24 rounded" />
          <div className="skeleton-pulse h-4 w-full rounded" />
          <div className="skeleton-pulse h-3 w-2/3 rounded" />
        </div>
      </div>
    );
  }

  // Default: post card
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <div className="aspect-video skeleton-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <div className="skeleton-pulse h-5 w-16 rounded-full" />
          <div className="skeleton-pulse h-5 w-14 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="skeleton-pulse h-4 w-full rounded" />
          <div className="skeleton-pulse h-4 w-4/5 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="skeleton-pulse h-3 w-16 rounded" />
          <div className="skeleton-pulse h-3 w-12 rounded" />
        </div>
        <div className="pt-1 border-t border-border flex justify-between">
          <div className="skeleton-pulse h-5 w-20 rounded" />
          <div className="skeleton-pulse h-5 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}
