import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="page-shell section-space space-y-8" role="status" aria-label="Seite wird geladen">
      <span className="sr-only">Seite wird geladen …</span>
      <div className="max-w-2xl space-y-4" aria-hidden="true">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="max-w-3xl space-y-4 border-t pt-8" aria-hidden="true">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
