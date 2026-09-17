'use client';
import { usePublicMentors } from '@/hooks/use-public-mentors';
import { MentorCard } from '@/components/mentors/mentor-card';
import { MentorEmptyState } from '@/components/mentors/mentor-empty-state';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedMentors() {
  const { mentors, isLoading, error } = usePublicMentors();
  if (isLoading) return <div role="status" aria-label="Local Mentoren werden geladen" className="grid gap-6 md:grid-cols-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}</div>;
  if (error) return <div role="alert" className="border-y py-8"><h3 className="text-lg">Profile gerade nicht erreichbar</h3><p className="mt-2 text-sm text-muted-foreground">Die Profile konnten nicht geladen werden. Bitte versuche es später erneut.</p></div>;
  if (!mentors.length) return <MentorEmptyState />;
  return <div className="grid gap-6 md:grid-cols-3">{mentors.slice(0, 3).map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)}</div>;
}
