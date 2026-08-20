export interface Mentor {
  id: string;
  name: string;
  imageUrl?: string;
  dataAiHint?: string; // For placeholder image generation
  qualifications: string[];
  experience: string;
  expertise: string[];
  location: string;
  bio: string;
  languages: string[];
}
