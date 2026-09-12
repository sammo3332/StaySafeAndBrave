import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TravelAssistantLoading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Skeleton className="h-6 w-36 mx-auto rounded-full" />
        <Skeleton className="h-10 w-72 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-xl" />
      </div>

      {/* Distinction Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>

      {/* Chat Area Skeleton */}
      <Card className="max-w-4xl mx-auto border-border/80">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-48" />
        </div>
        <CardContent className="p-6 space-y-4 min-h-[350px]">
          <Skeleton className="h-20 w-3/4" />
          <Skeleton className="h-16 w-1/2 ml-auto" />
          <Skeleton className="h-28 w-4/5" />
        </CardContent>
        <div className="p-4 border-t">
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </Card>
    </div>
  );
}
