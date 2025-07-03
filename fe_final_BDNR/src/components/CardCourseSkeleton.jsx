import { Skeleton } from "./ui/skeleton";

export const CardCourseSkeleton = () => {
  return (
    <div className="flex-1 flex justify-between items-center h-24 rounded-md">
      <div className="flex gap-4 items-center">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-20 h-5" />
      </div>
    </div>
  );
};
