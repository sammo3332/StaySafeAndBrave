import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MentorDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <Skeleton className="h-5 w-48" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column Skeleton */}
        <Card className="overflow-hidden border">
          <Skeleton className="w-full aspect-[4/3]" />
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2 pt-4 border-t">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-11 w-full mt-4" />
          </CardContent>
        </Card>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border">
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="pt-4 border-t space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-muted/20">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
