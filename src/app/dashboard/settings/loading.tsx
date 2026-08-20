
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" /> {/* Title */}
        <Skeleton className="h-6 w-72" /> {/* Subtitle */}
      </div>

      {/* Profile Settings Skeleton */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-1/3" /> {/* Card Title */}
          <Skeleton className="h-5 w-1/2" /> {/* Card Description */}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
                <Skeleton className="h-8 w-28" /> {/* Change Avatar Button */}
            </div>
            <div className="flex-1 w-full space-y-4">
                <div>
                    <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
                    <Skeleton className="h-10 w-full" /> {/* Input */}
                </div>
                 <div>
                    <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
                    <Skeleton className="h-10 w-full" /> {/* Input */}
                </div>
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
            <Skeleton className="h-20 w-full" /> {/* Textarea */}
            <Skeleton className="h-4 w-1/2 mt-1" /> {/* Description */}
          </div>
          <Skeleton className="h-10 w-48" /> {/* Save Button */}
        </CardContent>
      </Card>

      <Separator />

      {/* Password Settings Skeleton */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-1/3" /> {/* Card Title */}
          <Skeleton className="h-5 w-1/2" /> {/* Card Description */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div>
            <Skeleton className="h-5 w-1/4 mb-1" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <Skeleton className="h-10 w-44" /> {/* Update Button */}
        </CardContent>
      </Card>

      <Separator />

      {/* Notification Settings Skeleton */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-1/3" /> {/* Card Title */}
          <Skeleton className="h-5 w-1/2" /> {/* Card Description */}
        </CardHeader>
        <CardContent className="space-y-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-6 w-1/3" /> {/* Label */}
                        <Skeleton className="h-4 w-2/3" /> {/* Description */}
                    </div>
                    <Skeleton className="h-6 w-11" /> {/* Switch */}
                </div>
            ))}
          <Skeleton className="h-10 w-56" /> {/* Save Button */}
        </CardContent>
      </Card>
    </div>
  );
}
