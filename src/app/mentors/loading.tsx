import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MentorsLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-8 w-2/3" />

      {/* Filters Skeleton */}
      <Card className="shadow-md mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
      
      {/* Mentor Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <Skeleton className="h-56 w-full rounded-md" /> {/* Image */}
            <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Title */}
            <Skeleton className="h-4 w-1/2 rounded-md" /> {/* Location */}
            <div className="space-y-2"> {/* Expertise/Experience */}
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" /> {/* Button */}
          </div>
        ))}
      </div>
    </div>
  );
}
