import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AGBLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8 space-y-4">
          <Skeleton className="h-12 w-2/3 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-full max-w-lg mx-auto" /> {/* Subtitle */}
        </header>

        {[...Array(3)].map((_, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-1/3" /> {/* Section Title */}
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
