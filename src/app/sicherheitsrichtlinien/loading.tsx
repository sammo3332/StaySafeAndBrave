import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SicherheitsrichtlinienLoading() {
  return (
    <>
    <section className="w-full mb-12">
        <Skeleton className="w-full h-[400px]" />
      </section>
    <div className="container mx-auto px-4">
      <div className="space-y-12">
        <header className="text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" /> {/* Subtitle line 1 */}
          <Skeleton className="h-6 w-4/5 max-w-xl mx-auto" /> {/* Subtitle line 2 */}
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader className="space-y-2">
                <Skeleton className="h-8 w-1/2" /> {/* Card Title */}
                <Skeleton className="h-5 w-3/4" /> {/* Description line */}
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-2">
            <Skeleton className="h-8 w-2/3" /> {/* Section Title */}
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>

        <div className="text-center py-8 space-y-4">
          <Skeleton className="h-10 w-1/2 mx-auto" /> {/* CTA Title */}
          <Skeleton className="h-5 w-3/4 max-w-lg mx-auto" /> {/* CTA Subtitle */}
        </div>
      </div>
    </div>
    </>
  );
}
