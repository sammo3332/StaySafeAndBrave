
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] py-12">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-56" /> {/* App Name */}
      </div>
      
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" disabled>
             <Skeleton className="h-5 w-20" />
          </TabsTrigger>
          <TabsTrigger value="register" disabled>
            <Skeleton className="h-5 w-24" />
          </TabsTrigger>
        </TabsList>

        {/* Common Card Structure for Skeleton */}
        <Card className="shadow-xl mt-4">
          <CardHeader className="text-center space-y-2">
            <Skeleton className="h-8 w-3/4 mx-auto" /> {/* Title */}
            <Skeleton className="h-5 w-full mx-auto" /> {/* Description */}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-1/4" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <Skeleton className="h-12 w-full" /> {/* Submit Button */}
            <Skeleton className="h-4 w-3/5 mx-auto mt-2" /> {/* Footer link */}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
