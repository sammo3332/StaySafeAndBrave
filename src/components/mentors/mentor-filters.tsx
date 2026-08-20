'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Award, X } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface MentorFiltersProps {
  locations: string[];
  expertises: string[];
  onFilterChange: (filters: { searchTerm: string; location: string; expertise: string }) => void;
}

export function MentorFilters({ locations, expertises, onFilterChange }: MentorFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = () => {
    onFilterChange({ searchTerm, location, expertise });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setExpertise('');
    onFilterChange({ searchTerm: '', location: '', expertise: '' });
  };
  
  const hasActiveFilters = searchTerm || location || expertise;

  if (!isClient) {
    return (
      <Card className="shadow-md mb-8 sticky top-20 z-10 bg-background/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Search className="w-6 h-6" />
            Finde deinen Mentor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Skeleton className="h-5 w-3/4 mb-1" /> {/* Label skeleton */}
              <Skeleton className="h-10 w-full" /> {/* Input skeleton */}
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-1/2 mb-1" /> {/* Label skeleton */}
              <Skeleton className="h-10 w-full" /> {/* Select skeleton */}
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-1/2 mb-1" /> {/* Label skeleton */}
              <Skeleton className="h-10 w-full" /> {/* Select skeleton */}
            </div>
            <div className="flex gap-2">
               <Skeleton className="h-10 w-full" /> {/* Button skeleton */}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md mb-8 sticky top-20 z-10 bg-background/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Search className="w-6 h-6" />
          Finde deinen Mentor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label htmlFor="search" className="text-sm font-medium">Suche nach Name/Stichwort</label>
            <Input
              id="search"
              type="text"
              placeholder="z.B., Aisha, Safari, Wandern"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="location" className="text-sm font-medium flex items-center gap-1"><MapPin className="w-4 h-4 text-secondary"/>Standort</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Alle Standorte" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">All Locations</SelectItem> */} {/* Removed */}
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label htmlFor="expertise" className="text-sm font-medium flex items-center gap-1"><Award className="w-4 h-4 text-secondary"/>Expertise</label>
            <Select value={expertise} onValueChange={setExpertise}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Alle Expertisen" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">All Expertises</SelectItem> */} {/* Removed */}
                {expertises.map((exp) => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Search className="w-4 h-4 mr-2" />
              Suchen
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outline" className="h-10">
                <X className="w-4 h-4 mr-2" />
                Löschen
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
