
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MessagesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" /> {/* Title */}
          <Skeleton className="h-6 w-72" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-40" /> {/* Compose Button */}
      </div>

      <Card className="shadow-md">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-36" /> {/* Inbox Title */}
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3" /> {/* Sender Name */}
                  <Skeleton className="h-4 w-1/4" /> {/* Timestamp */}
                </div>
                <Skeleton className="h-4 w-2/3" /> {/* Subject */}
                <Skeleton className="h-4 w-full" /> {/* Preview */}
              </div>
              <Skeleton className="h-3 w-3 rounded-full self-center ml-2" /> {/* Unread Dot */}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
