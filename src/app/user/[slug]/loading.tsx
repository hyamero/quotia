import { Skeleton } from "~/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto mt-40 flex w-full max-w-lg items-center  justify-between xl:max-w-xl">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
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
