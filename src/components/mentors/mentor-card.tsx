
import type { MentorDTO } from '@/lib/dtos';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Briefcase, MapPin, Award, MessageSquare, LanguagesIcon, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface MentorCardProps {
  mentor: MentorDTO;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const fullName = `${mentor.firstName} ${mentor.lastName}`;
  
  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-transparent hover:border-primary/30">
      <CardHeader className="p-0 relative overflow-hidden">
        {mentor.profilePictureUrl ? (
          <Image
            src={mentor.profilePictureUrl}
            alt={fullName}
            width={400}
            height={300}
            className="object-cover w-full h-60 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-60 bg-muted flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <Badge variant="secondary" className="absolute top-3 right-3 bg-green-600/80 text-white border-green-500 text-xs shadow-md">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verifiziert
        </Badge>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold text-primary mb-1">{fullName}</CardTitle>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1.5 text-secondary" />
          {mentor.location}
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <Award className="w-5 h-5 mr-2 mt-1 text-secondary shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-foreground/90">Expertise</h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {mentor.areasOfExpertise.map((item) => (
                  <Badge key={item} variant="outline" className="border-accent/50 text-accent-foreground bg-accent/10 text-xs">{item}</Badge>
                ))}
              </div>
            </div>
          </div>
          {mentor.qualifications && (
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 mr-2 mt-1 text-secondary shrink-0" />
               <div>
                <h4 className="font-medium text-sm text-foreground/90">Qualifikationen</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">{mentor.qualifications}</p>
              </div>
            </div>
          )}
           <div className="flex items-start">
            <LanguagesIcon className="w-5 h-5 mr-2 mt-1 text-secondary shrink-0" />
             <div>
              <h4 className="font-medium text-sm text-foreground/90">Sprachen</h4>
               <p className="text-sm text-muted-foreground">{mentor.languages.join(', ')}</p>
            </div>
          </div>
        </div>
        
        <CardDescription className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">{mentor.bio}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 bg-muted/20 border-t mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground transition-transform group-hover:scale-105">
          <MessageSquare className="w-4 h-4 mr-2" />
          Kontaktiere {mentor.firstName}
        </Button>
      </CardFooter>
    </Card>
  );
}
