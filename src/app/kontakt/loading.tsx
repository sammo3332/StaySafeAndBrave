
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function KontaktLoading() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" /> {/* Subtitle */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <Skeleton className="h-8 w-1/2" /> {/* Form Title */}
            <Skeleton className="h-5 w-3/4" /> {/* Form Description */}
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-1.5">
                <Skeleton className="h-5 w-1/4" /> {/* Label */}
                <Skeleton className={index === 3 ? "h-24 w-full" : "h-10 w-full"} /> {/* Input/Textarea */}
              </div>
            ))}
            <Skeleton className="h-12 w-full" /> {/* Submit Button */}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-7 w-1/3" /> {/* Section Title */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-7 w-1/3" /> {/* Section Title */}
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-4 aspect-video w-full h-48 rounded-md" /> {/* Map Placeholder */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
