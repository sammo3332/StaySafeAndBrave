import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" /> {/* Welcome message */}
          <Skeleton className="h-6 w-80" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-28" /> {/* Logout Button */}
      </div>

      {/* User Profile Quick View Skeleton */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
          <div className="space-y-2 text-center md:text-left">
            <Skeleton className="h-8 w-48" /> {/* Name */}
            <Skeleton className="h-5 w-56" /> {/* Email */}
            <Skeleton className="h-4 w-40" /> {/* Member Since */}
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions / Overview Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-32" /> {/* Card Title */}
                <Skeleton className="h-7 w-7 rounded-full" /> {/* Icon */}
              </div>
              <Skeleton className="h-4 w-full" /> {/* Description Line 1 */}
              <Skeleton className="h-4 w-5/6" /> {/* Description Line 2 */}
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-5 w-3/4" /> {/* Content text */}
              <Skeleton className="h-5 w-24" /> {/* Button/Link text */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Travel Assistant Teaser Skeleton */}
      <Card className="bg-secondary/10 border-secondary/30 shadow-md">
        <CardHeader className="space-y-2">
          <Skeleton className="h-7 w-1/2" /> {/* Title */}
          <Skeleton className="h-4 w-full" /> {/* Description Line 1 */}
           <Skeleton className="h-4 w-5/6" /> {/* Description Line 2 */}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-40" /> {/* Button */}
        </CardContent>
      </Card>
    </div>
  );
}
