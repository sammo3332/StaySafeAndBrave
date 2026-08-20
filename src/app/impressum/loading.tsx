import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ImpressumLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8 space-y-4">
          <Skeleton className="h-12 w-1/2 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-3/4 mx-auto" /> {/* Subtitle */}
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-2/5" /> {/* Section Title */}
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" /> {/* Section Title */}
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
