import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DatenschutzLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8 space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-full max-w-md mx-auto" /> {/* Subtitle */}
        </header>

        {[...Array(3)].map((_, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-2/5" /> {/* Section Title */}
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              {index === 1 && <Skeleton className="h-4 w-4/5" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
