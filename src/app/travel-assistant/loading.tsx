import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TravelAssistantLoading() {
  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
      </div>
      
      {/* Form Skeleton */}
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-10 w-full" /> {/* Input */}
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-10 w-full" /> {/* Button */}
        </CardContent>
      </Card>
    </div>
  );
}
