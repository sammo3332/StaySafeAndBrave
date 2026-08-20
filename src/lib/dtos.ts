
export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  homeCountry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  bio: string;
  location: string;
  languages: string[];
  areasOfExpertise: string[];
  qualifications?: string;
  dailyRate: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDTO {
  id: string;
  userId: string;
  mentorId: string;
  bookingDate: string;
  durationHours: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  paymentIntentId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDTO {
  id: string;
  userId: string;
  title: string;
  content: string;
  location: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}
