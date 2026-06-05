import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-6 lg:gap-0 card-base overflow-hidden">
    <Skeleton className="aspect-[16/10] lg:aspect-auto" />
    <div className="p-6 lg:p-10 space-y-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  </div>
);

export const NovedadCardSkeleton = () => (
  <div className="card-base overflow-hidden">
    <Skeleton className="aspect-[16/9]" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);