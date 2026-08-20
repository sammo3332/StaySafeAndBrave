
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function UeberUnsLoading() {
  return (
    <div className="space-y-16">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 md:py-32 bg-muted/30">
         <div className="absolute inset-0">
            <Skeleton className="w-full h-full opacity-20"/>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
          <Skeleton className="h-8 w-full max-w-3xl mx-auto" /> {/* Subtitle */}
        </div>
      </section>

      {/* Our Story Section Skeleton */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" /> {/* Section Title */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
          <Skeleton className="h-[450px] w-full rounded-xl" /> {/* Image */}
        </div>
      </section>

      {/* Our Values Section Skeleton */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <Skeleton className="h-10 w-1/2 mx-auto mb-12" /> {/* Section Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-6 space-y-3">
                <Skeleton className="w-16 h-16 rounded-full mx-auto" /> {/* Icon */}
                <Skeleton className="h-6 w-3/4 mx-auto" /> {/* Value Title */}
                <Skeleton className="h-4 w-full mx-auto" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Team Section Skeleton */}
      <section className="container mx-auto px-4 md:px-6">
        <Skeleton className="h-10 w-1/2 mx-auto mb-12" /> {/* Section Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="text-center shadow-lg">
              <CardHeader className="items-center">
                <Skeleton className="w-[150px] h-[150px] rounded-full mx-auto mb-4" /> {/* Avatar */}
                <Skeleton className="h-6 w-3/4 mx-auto" /> {/* Name */}
                <Skeleton className="h-4 w-1/2 mx-auto" /> {/* Role */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Skeleton */}
      <section className="bg-primary/80 py-16">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Skeleton className="h-10 w-3/4 mx-auto bg-background/30" /> {/* Title */}
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-background/30" /> {/* Subtitle */}
          <Skeleton className="h-12 w-52 mx-auto bg-background/50" /> {/* Button */}
        </div>
      </section>
    </div>
  );
}
