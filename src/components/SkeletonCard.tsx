import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden bg-card border-border h-full">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </Card>
  );
};

export const SkeletonGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: 24 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
