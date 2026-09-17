import type { MentorDTO, ReportDTO, ReviewDTO } from '@/lib/dtos';

const text = (value: unknown): string => typeof value === 'string' ? value : '';
const strings = (value: unknown): string[] => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  : [];
const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? value as Record<string, unknown> : {};

// Presentation normalization only: no stored content is rewritten.
export function publicMentor(value: unknown): MentorDTO | null {
  const v = record(value);
  if (!text(v.id) || !(text(v.firstName).trim() || text(v.lastName).trim())) return null;
  return {
    id: text(v.id), firstName: text(v.firstName), lastName: text(v.lastName),
    email: '', bio: text(v.bio), location: text(v.location),
    profilePictureUrl: text(v.profilePictureUrl), qualifications: text(v.qualifications),
    languages: strings(v.languages), areasOfExpertise: strings(v.areasOfExpertise),
    travelStyles: strings(v.travelStyles), active: v.active === false ? false : undefined,
    verificationStatus: v.verificationStatus === 'verified' ? 'verified' : undefined,
    identityVerified: v.identityVerified === true,
    backgroundCheckVerified: v.backgroundCheckVerified === true,
    profileApproved: v.profileApproved === true,
    createdAt: text(v.createdAt), updatedAt: text(v.updatedAt),
    averageRating: typeof v.averageRating === 'number' && Number.isFinite(v.averageRating)
      && v.averageRating >= 1 && v.averageRating <= 5 ? v.averageRating : undefined,
    reviewCount: typeof v.reviewCount === 'number' && Number.isInteger(v.reviewCount)
      && v.reviewCount > 0 ? v.reviewCount : undefined,
  };
}

export function dateMillis(value: unknown): number | null {
  let result = NaN;
  if (typeof value === 'string' && value.trim()) result = Date.parse(value);
  else if (value instanceof Date) result = value.getTime();
  else if (value && typeof value === 'object') {
    const v = record(value);
    if (typeof v.seconds === 'number') result = v.seconds * 1000;
  }
  return Number.isFinite(result) && Math.abs(result) <= 8640000000000000 ? result : null;
}

export function storyDate(story: ReportDTO): number | null {
  return dateMillis(story.publishedAt) ?? dateMillis(story.tripDate) ?? dateMillis(story.createdAt);
}

export function formatStoryDate(story: ReportDTO): string | null {
  const date = storyDate(story);
  return date === null ? null : new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

export function publicStory(value: unknown): ReportDTO | null {
  const v = record(value);
  if (v.visibility !== 'public' || !text(v.id) || !text(v.title).trim() || !text(v.content).trim()) return null;
  const date = (x: unknown) => { const ms = dateMillis(x); return ms === null ? '' : new Date(ms).toISOString(); };
  return {
    id: text(v.id), userId: text(v.userId), title: text(v.title), content: text(v.content),
    visibility: 'public', location: text(v.location), mentorId: text(v.mentorId),
    mentorName: text(v.mentorName), imageUrls: strings(v.imageUrls),
    publishedAt: date(v.publishedAt), tripDate: date(v.tripDate),
    createdAt: date(v.createdAt), updatedAt: date(v.updatedAt),
  };
}

export function publicReview(value: unknown, mentorId: string): ReviewDTO | null {
  const v = record(value);
  if (v.mentorId !== mentorId || !text(v.id) || v.id !== v.bookingId || !text(v.travelerId)
    || typeof v.rating !== 'number' || !Number.isInteger(v.rating) || v.rating < 1 || v.rating > 5) return null;
  return {
    id: text(v.id), bookingId: text(v.bookingId), mentorId, travelerId: text(v.travelerId),
    travelerName: text(v.travelerName), rating: v.rating, text: text(v.text),
    createdAt: text(v.createdAt), updatedAt: text(v.updatedAt),
  };
}
