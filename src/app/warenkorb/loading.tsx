
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export default function WarenkorbLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center">
        <header className="text-center py-8 space-y-4">
          <Skeleton className="h-12 w-72 mx-auto" />
        </header>

        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-9 w-1/3" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
