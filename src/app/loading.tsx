import { Skeleton } from "~/app/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center gap-20 text-white xl:max-w-xl">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-[140px]" />
            <Skeleton className="h-2 w-[90px]" />
          </div>
        </div>
        <Skeleton className="h-7 w-[60px]" />
      </div>

      <div className="flex w-full flex-col gap-20">
        {[...Array(5).keys()].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-[250px]" />
          <Skeleton className="h-3 w-[200px]" />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-2 w-[7px]" />
        <Skeleton className="h-2 w-[7px]" />
        <Skeleton className="h-2 w-[7px]" />
      </div>
    </div>
  );
};
