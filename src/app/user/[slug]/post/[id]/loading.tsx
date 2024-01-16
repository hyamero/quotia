import { Skeleton } from "~/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-20 flex justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
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
}
