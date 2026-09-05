
'use client';

import { useState, useMemo } from 'react';
import { MentorCard } from '@/components/mentors/mentor-card';
import { MentorFilters, type MentorFilterValues } from '@/components/mentors/mentor-filters';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { MentorDTO } from '@/lib/dtos';
import { Loader2, SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MentorsPage() {
  const db = useFirestore();
  const [filters, setFilters] = useState<MentorFilterValues>({
    searchTerm: '',
    location: '',
    expertise: '',
    language: '',
  });

  const mentorsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'mentors');
  }, [db]);

  const { data: mentors, isLoading } = useCollection<MentorDTO>(mentorsRef);

  // Backward-compatible active check: exclude only if explicitly set to false
  const activeMentors = useMemo(() => {
    if (!mentors) return [];
    return mentors.filter((mentor) => mentor.active !== false);
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    if (!activeMentors) return [];

    const search = filters.searchTerm.trim().toLowerCase();

    return activeMentors.filter((mentor) => {
      // 1. Search term
      if (search) {
        const firstName = (mentor.firstName || '').toLowerCase();
        const lastName = (mentor.lastName || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        const bio = (mentor.bio || '').toLowerCase();
        const location = (mentor.location || '').toLowerCase();
        const expertiseMatch = Array.isArray(mentor.areasOfExpertise) &&
          mentor.areasOfExpertise.some((e) => (e || '').toLowerCase().includes(search));
        const travelStylesMatch = Array.isArray(mentor.travelStyles) &&
          mentor.travelStyles.some((t) => (t || '').toLowerCase().includes(search));

        const matches =
          fullName.includes(search) ||
          bio.includes(search) ||
          location.includes(search) ||
          expertiseMatch ||
          travelStylesMatch;

        if (!matches) return false;
      }

      // 2. Location filter
      if (filters.location && mentor.location !== filters.location) {
        return false;
      }

      // 3. Expertise filter
      if (filters.expertise) {
        const expertiseList = Array.isArray(mentor.areasOfExpertise) ? mentor.areasOfExpertise : [];
        if (!expertiseList.includes(filters.expertise)) {
          return false;
        }
      }

      // 4. Language filter
      if (filters.language) {
        const languagesList = Array.isArray(mentor.languages) ? mentor.languages : [];
        if (!languagesList.includes(filters.language)) {
          return false;
        }
      }

      return true;
    });
  }, [activeMentors, filters]);

  const uniqueLocations = useMemo(() => {
    if (!activeMentors) return [];
    const set = new Set(activeMentors.map((m) => m.location).filter(Boolean));
    return Array.from(set).sort();
  }, [activeMentors]);

  const uniqueExpertises = useMemo(() => {
    if (!activeMentors) return [];
    const set = new Set(
      activeMentors.flatMap((m) => (Array.isArray(m.areasOfExpertise) ? m.areasOfExpertise : [])).filter(Boolean)
    );
    return Array.from(set).sort();
  }, [activeMentors]);

  const uniqueLanguages = useMemo(() => {
    if (!activeMentors) return [];
    const set = new Set(
      activeMentors.flatMap((m) => (Array.isArray(m.languages) ? m.languages : [])).filter(Boolean)
    );
    return Array.from(set).sort();
  }, [activeMentors]);

  const handleFilterChange = (newFilters: MentorFilterValues) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      location: '',
      expertise: '',
      language: '',
    });
  };

  const hasActiveFilters = Boolean(
    filters.searchTerm || filters.location || filters.expertise || filters.language
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Triff deine Local Mentoren
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Finde geprüfte Einheimische in Südafrika, die dir vor und während deiner Reise
            mit verlässlichem Wissen, Sicherheitstipps und echten Geheimtipps zur Seite stehen.
          </p>
        </header>

        <section aria-label="Filteroptionen">
          <MentorFilters
            locations={uniqueLocations}
            expertises={uniqueExpertises}
            languages={uniqueLanguages}
            filters={filters}
            totalCount={activeMentors.length}
            filteredCount={filteredMentors.length}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </section>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" aria-hidden="true" />
            <p className="text-muted-foreground font-medium">Mentoren werden geladen...</p>
          </div>
        ) : filteredMentors.length > 0 ? (
          <section aria-label="Gefundene Mentoren">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </section>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">Keine Mentoren gefunden</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {hasActiveFilters
                  ? 'Für deine aktuellen Such- und Filterkriterien gibt es keine Treffer. Versuche andere Begriffe oder setze die Filter zurück.'
                  : 'Zurzeit sind keine Mentorenprofile verfügbar. Bitte schaue später noch einmal vorbei.'}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="mt-2"
              >
                <RotateCcw className="w-4 h-4 mr-2 text-muted-foreground" aria-hidden="true" />
                Alle Filter zurücksetzen
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

