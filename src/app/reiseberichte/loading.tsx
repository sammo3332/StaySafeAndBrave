
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReiseberichteLoading() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" /> {/* Subtitle */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <Skeleton className="h-56 w-full" /> {/* Image */}
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-5/6" /> {/* Report Title */}
              <Skeleton className="h-4 w-1/2" /> {/* Author & Date */}
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
             <CardContent className="border-t pt-4">
                <Skeleton className="h-5 w-1/3" /> {/* Location */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
