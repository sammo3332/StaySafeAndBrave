
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BookingsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" /> {/* Title */}
          <Skeleton className="h-6 w-72" /> {/* Subtitle */}
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-10 w-28" /> {/* Filter Button */}
            <Skeleton className="h-10 w-36" /> {/* New Booking Button */}
        </div>
      </div>

      {/* Upcoming Bookings Skeleton */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-60" /> {/* Section Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Skeleton className="h-[72px] w-[72px] rounded-lg" /> {/* Image */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" /> {/* Mentor Name */}
                  <Skeleton className="h-4 w-1/2" /> {/* Expertise */}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <Skeleton className="h-4 w-full" /> {/* Date */}
                <Skeleton className="h-4 w-full" /> {/* Time */}
                <Skeleton className="h-4 w-2/3" /> {/* Location */}
                <Skeleton className="h-9 w-full mt-2" /> {/* Button */}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Bookings Skeleton */}
      <section className="space-y-6">
        <Skeleton className="h-8 w-52" /> {/* Section Title */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(1)].map((_, index) => (
             <Card key={index} className="shadow-sm opacity-75">
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Skeleton className="h-[72px] w-[72px] rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-2">
                    <Skeleton className="h-9 w-1/2" />
                    <Skeleton className="h-9 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
