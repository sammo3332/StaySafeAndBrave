import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ConversationLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-md" />
        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Booking context card skeleton */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Messages card skeleton */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="min-h-[360px] space-y-4">
            <div className="flex justify-start">
              <Skeleton className="h-14 w-2/3 rounded-2xl" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-1/2 rounded-2xl" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-16 w-3/5 rounded-2xl" />
            </div>
          </div>
          <div className="pt-3 border-t flex gap-2">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-10 w-12 rounded-md self-end" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
