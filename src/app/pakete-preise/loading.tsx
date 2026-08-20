
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function PaketePreiseLoading() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" /> {/* Subtitle */}
        <Skeleton className="h-4 w-4/5 max-w-xl mx-auto" /> {/* Subtitle line 2 */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className={`flex flex-col rounded-xl shadow-lg ${index === 1 ? 'border-2 border-primary/30' : 'border'}`}>
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary/30 text-primary-foreground text-sm font-semibold rounded-full shadow-md">
                <Skeleton className="h-4 w-16" />
              </div>
            )}
            <CardHeader className="pt-8 space-y-2">
              <Skeleton className="h-8 w-3/4" /> {/* Tier Name */}
              <Skeleton className="h-10 w-1/2" /> {/* Price */}
              <Skeleton className="h-5 w-full" /> {/* Description */}
            </CardHeader>
            <CardContent className="flex-grow space-y-3 mt-4">
              {[...Array(4)].map((_, featureIndex) => (
                 <div key={featureIndex} className="flex gap-x-3 items-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-5/6" />
                 </div>
              ))}
            </CardContent>
            <CardFooter>
              <Skeleton className="h-12 w-full" /> {/* Button */}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-2/3" /> {/* Section Title */}
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="space-y-2 pl-4 mt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
