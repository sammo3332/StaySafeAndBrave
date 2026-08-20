
'use client';

import { useState, useMemo } from 'react';
import { MentorCard } from '@/components/mentors/mentor-card';
import { MentorFilters } from '@/components/mentors/mentor-filters';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { MentorDTO } from '@/lib/dtos';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MentorsPage() {
  const db = useFirestore();
  const [filters, setFilters] = useState({ searchTerm: '', location: '', expertise: '' });

  const mentorsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'mentors');
  }, [db]);

  const { data: mentors, isLoading } = useCollection<MentorDTO>(mentorsRef);

  const filteredMentors = useMemo(() => {
    if (!mentors) return [];
    
    return mentors.filter(mentor => {
      const matchesSearch = !filters.searchTerm || 
        `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        mentor.areasOfExpertise.some(exp => exp.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      const matchesLocation = !filters.location || mentor.location === filters.location;
      const matchesExpertise = !filters.expertise || mentor.areasOfExpertise.includes(filters.expertise);

      return matchesSearch && matchesLocation && matchesExpertise;
    });
  }, [mentors, filters]);

  const uniqueLocations = useMemo(() => {
    if (!mentors) return [];
    const locations = new Set(mentors.map(m => m.location));
    return Array.from(locations).sort();
  }, [mentors]);

  const uniqueExpertises = useMemo(() => {
    if (!mentors) return [];
    const expertises = new Set(mentors.flatMap(m => m.areasOfExpertise));
    return Array.from(expertises).sort();
  }, [mentors]);

  const handleFilterChange = (newFilters: { searchTerm: string; location: string; expertise: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Triff unsere Mentoren</h1>
        <p className="text-lg text-muted-foreground">
          Entdecke erfahrene lokale Guides, die bereit sind, deine Südafrika-Reise unvergesslich zu machen.
        </p>
        
        <MentorFilters
          locations={uniqueLocations}
          expertises={uniqueExpertises}
          onFilterChange={handleFilterChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Mentoren werden geladen...</p>
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <Alert variant="default" className="bg-secondary/10 border-secondary/30">
            <AlertCircle className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-primary">Keine Mentoren gefunden</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Keine Mentoren entsprechen deinen aktuellen Filterkriterien. Versuche, deine Suche anzupassen.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
