
import type { MentorDTO } from '@/lib/dtos';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Award, LanguagesIcon, CheckCircle2, Star, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MentorCardProps {
  mentor: MentorDTO;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const fullName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Lokaler Mentor';
  const hasRealRating = typeof mentor.averageRating === 'number' && !isNaN(mentor.averageRating) && mentor.averageRating > 0;
  const isVerified = mentor.verificationStatus === 'verified';
  const languagesList = Array.isArray(mentor.languages) ? mentor.languages : [];
  const expertiseList = Array.isArray(mentor.areasOfExpertise) ? mentor.areasOfExpertise : [];

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full border border-border/70 hover:border-primary/40 bg-card">
      <CardHeader className="p-0 relative overflow-hidden bg-muted/50">
        {mentor.profilePictureUrl ? (
          <Image
            src={mentor.profilePictureUrl}
            alt={`Porträt von ${fullName}`}
            width={400}
            height={280}
            className="object-cover w-full h-60 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-60 bg-muted/60 flex flex-col items-center justify-center text-muted-foreground">
            <User className="w-16 h-16 stroke-1 mb-2 opacity-40" aria-hidden="true" />
            <span className="text-xs text-muted-foreground/80">{fullName}</span>
          </div>
        )}

        {/* Verification badge ONLY if explicitly verified in data */}
        {isVerified && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-emerald-700 text-white border border-emerald-600 text-xs shadow-md font-medium flex items-center gap-1 px-2.5 py-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" aria-hidden="true" />
            <span>Verifiziert</span>
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <CardTitle className="text-xl font-semibold text-primary">
            <Link
              href={`/mentors/${mentor.id}`}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              {fullName}
            </Link>
          </CardTitle>

          {/* Real rating only if present in data */}
          {hasRealRating && (
            <div
              className="flex items-center gap-1 text-sm font-semibold text-amber-800 dark:text-amber-300 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800"
              aria-label={`Bewertung: ${mentor.averageRating!.toFixed(1)} von 5 Sternen`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
              <span>{mentor.averageRating!.toFixed(1)}</span>
              {typeof mentor.reviewCount === 'number' && mentor.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground font-normal">({mentor.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1.5 text-secondary shrink-0" aria-hidden="true" />
          <span>{mentor.location || 'Südafrika'}</span>
        </div>

        <div className="space-y-3 mb-4 flex-grow">
          {/* Expertise tags */}
          {expertiseList.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <Award className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
                <span>Expertise</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {expertiseList.slice(0, 3).map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="border-accent/60 text-accent-foreground bg-accent/10 text-xs font-normal"
                  >
                    {item}
                  </Badge>
                ))}
                {expertiseList.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">+{expertiseList.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {languagesList.length > 0 && (
            <div className="flex items-start text-xs text-muted-foreground">
              <LanguagesIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-secondary shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{languagesList.join(', ')}</span>
            </div>
          )}

          {/* Bio snippet */}
          {mentor.bio && (
            <CardDescription className="text-sm line-clamp-3 text-muted-foreground leading-relaxed pt-1">
              {mentor.bio}
            </CardDescription>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 bg-transparent mt-auto">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
          <Link href={`/mentors/${mentor.id}`}>
            Profil ansehen
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
