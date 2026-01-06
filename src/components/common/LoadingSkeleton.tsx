import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl p-6 space-y-4 bg-card border border-border/50 animate-pulse",
      className
    )}>
      <Skeleton className="h-8 w-3/4 bg-muted" />
      <Skeleton className="h-4 w-full bg-muted" />
      <Skeleton className="h-4 w-5/6 bg-muted" />
      <Skeleton className="h-10 w-32 mt-4 bg-muted" />
    </div>
  );
}

export function PostCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border/50 p-5 sm:p-6 space-y-4",
      className
    )}>
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0 bg-muted" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4 bg-muted" />
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-2/3 bg-muted" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-4 w-20 bg-muted" />
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border/50 overflow-hidden",
      className
    )}>
      <Skeleton className="aspect-[16/9] w-full bg-muted" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-full bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-2/3 bg-muted" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-border/50 overflow-hidden">
      <Skeleton className="h-12 w-full bg-muted" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full bg-muted" />
      ))}
    </div>
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("w-full aspect-video rounded-2xl bg-muted", className)} />
  );
}

export function ListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
          <Skeleton className="h-12 w-12 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-background">
      <div className="text-center space-y-6 px-4">
        <Skeleton className="h-16 w-80 mx-auto bg-muted" />
        <Skeleton className="h-8 w-96 mx-auto bg-muted" />
        <div className="flex gap-4 justify-center mt-8">
          <Skeleton className="h-12 w-40 rounded-full bg-muted" />
          <Skeleton className="h-12 w-40 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}