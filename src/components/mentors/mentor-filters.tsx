'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Award, LanguagesIcon, RotateCcw, SlidersHorizontal } from 'lucide-react';

export interface MentorFilterValues {
  searchTerm: string;
  location: string;
  expertise: string;
  language: string;
}

interface MentorFiltersProps {
  locations: string[];
  expertises: string[];
  languages: string[];
  filters: MentorFilterValues;
  totalCount: number;
  filteredCount: number;
  onFilterChange: (filters: MentorFilterValues) => void;
  onReset: () => void;
}

export function MentorFilters({
  locations,
  expertises,
  languages,
  filters,
  totalCount,
  filteredCount,
  onFilterChange,
  onReset,
}: MentorFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.searchTerm || filters.location || filters.expertise || filters.language
  );

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, searchTerm: value });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value === 'ALL' ? '' : value });
  };

  const handleExpertiseChange = (value: string) => {
    onFilterChange({ ...filters, expertise: value === 'ALL' ? '' : value });
  };

  const handleLanguageChange = (value: string) => {
    onFilterChange({ ...filters, language: value === 'ALL' ? '' : value });
  };

  return (
    <Card className="shadow-sm border border-border/70 mb-8 bg-card/90 backdrop-blur-sm">
      <CardContent className="p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-base md:text-lg">
            <SlidersHorizontal className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
            <h2>Mentoren filtern &amp; suchen</h2>
          </div>

          <div
            className="flex items-center gap-3 text-sm"
            role="status"
            aria-live="polite"
          >
            <span className="text-muted-foreground">
              {totalCount === 0 ? (
                'Keine Mentoren verfügbar'
              ) : hasActiveFilters ? (
                <>
                  <strong className="text-foreground">{filteredCount}</strong> von {totalCount} Mentoren
                </>
              ) : (
                <>
                  <strong className="text-foreground">{totalCount}</strong> {totalCount === 1 ? 'Mentor verfügbar' : 'Mentoren verfügbar'}
                </>
              )}
            </span>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Alle Filter zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1 text-muted-foreground" aria-hidden="true" />
                Zurücksetzen
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Free-text Search */}
          <div className="space-y-1.5">
            <label htmlFor="mentor-search-input" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
              <span>Suchbegriff</span>
            </label>
            <div className="relative">
              <Input
                id="mentor-search-input"
                type="text"
                placeholder="Name, Ort, Interesse..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-10 text-sm pl-9"
              />
              <Search
                className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-1.5">
            <label htmlFor="location-select-trigger" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
              <span>Standort</span>
            </label>
            <Select
              value={filters.location || 'ALL'}
              onValueChange={handleLocationChange}
            >
              <SelectTrigger id="location-select-trigger" className="h-10 text-sm">
                <SelectValue placeholder="Alle Standorte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Standorte</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expertise Filter */}
          <div className="space-y-1.5">
            <label htmlFor="expertise-select-trigger" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
              <span>Expertise</span>
            </label>
            <Select
              value={filters.expertise || 'ALL'}
              onValueChange={handleExpertiseChange}
            >
              <SelectTrigger id="expertise-select-trigger" className="h-10 text-sm">
                <SelectValue placeholder="Alle Expertisen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Expertisen</SelectItem>
                {expertises.map((exp) => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div className="space-y-1.5">
            <label htmlFor="language-select-trigger" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LanguagesIcon className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
              <span>Sprache</span>
            </label>
            <Select
              value={filters.language || 'ALL'}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="language-select-trigger" className="h-10 text-sm">
                <SelectValue placeholder="Alle Sprachen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Alle Sprachen</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

