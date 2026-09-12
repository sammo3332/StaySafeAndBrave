
import type { Timestamp, FieldValue } from 'firebase/firestore';

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
  dailyRate?: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
  travelStyles?: string[];
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'suspended';
  identityVerified?: boolean;
  backgroundCheckVerified?: boolean;
  profileApproved?: boolean;
  verifiedAt?: string;
  reviewCount?: number;
  active?: boolean;
}

export interface MentorAuthDTO {
  mentorId: string;
}

export interface AdminAuthDTO {
  role: 'admin';
}

export type BookingStatus = 'requested' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingDTO {
  id: string;
  userId: string;
  mentorId: string;
  mentorName?: string;
  packageId?: string;
  packageName?: string;
  requestedStartDate?: string;
  requestedEndDate?: string;
  travelerMessage?: string;
  status: BookingStatus;
  createdAt: string | Timestamp | FieldValue;
  updatedAt: string | Timestamp | FieldValue;
  // Legacy fields for backward compatibility
  bookingDate?: string;
  durationHours?: number;
  totalPrice?: number;
  paymentIntentId?: string;
  notes?: string;
}

export type ReportVisibility = 'private' | 'public';

export interface ReportDTO {
  id: string;
  userId: string;
  title: string;
  content: string;
  location?: string;
  tripDate?: string;
  mentorId?: string;
  mentorName?: string;
  bookingId?: string;
  imageUrls?: string[];
  visibility?: ReportVisibility; // default is 'private'
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDTO {
  id: string; // INVARIANT: reviewId === bookingId
  bookingId: string;
  mentorId: string;
  travelerId: string;
  travelerName?: string;
  rating: number; // 1 to 5 integer
  text?: string;
  createdAt: string | Timestamp | FieldValue;
  updatedAt: string | Timestamp | FieldValue;
}

export interface ConversationDTO {
  id: string;
  bookingId: string;
  travelerId: string;
  mentorId: string;
  mentorName?: string;
  createdAt: string | Timestamp | FieldValue;
  updatedAt: string | Timestamp | FieldValue;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  lastMessageCreatedAt?: string | Timestamp | FieldValue;
}

export interface MessageDTO {
  id: string;
  senderId: string;
  text: string;
  createdAt: string | Timestamp | FieldValue;
}
