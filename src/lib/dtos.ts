
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
