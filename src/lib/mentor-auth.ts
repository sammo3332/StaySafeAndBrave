import { doc, getDoc, Firestore } from "firebase/firestore";
import type { MentorDTO, MentorAuthDTO } from "@/lib/dtos";

/**
 * Resolves a mentor profile linked to a specific Firebase Auth UID via the private /mentorAuth mapping.
 * 
 * INVARIANT:
 * - Reads /mentorAuth/{authUid} directly (only readable by request.auth.uid == authUid).
 * - Extracts mentorId from the private mapping document.
 * - Reads the public profile from /mentors/{mentorId}.
 * - Returns null truthfully if no mapping exists or the referenced profile is not found.
 * - Never queries /mentors by authUid.
 * - Never assumes mentor document ID === Firebase Auth UID.
 */
export async function resolveMentorByAuthUid(
  db: Firestore | null,
  authUid: string | null | undefined
): Promise<MentorDTO | null> {
  if (!db || !authUid) {
    return null;
  }

  try {
    // 1. Fetch private auth mapping document
    const authMappingRef = doc(db, "mentorAuth", authUid);
    const authMappingSnap = await getDoc(authMappingRef);

    if (!authMappingSnap.exists()) {
      return null;
    }

    const mappingData = authMappingSnap.data() as MentorAuthDTO;
    const mentorId = mappingData?.mentorId;

    if (!mentorId || typeof mentorId !== "string") {
      return null;
    }

    // 2. Fetch public mentor profile using the resolved mentorId
    const mentorRef = doc(db, "mentors", mentorId);
    const mentorSnap = await getDoc(mentorRef);

    if (!mentorSnap.exists()) {
      return null;
    }

    const data = mentorSnap.data();
    return {
      id: mentorSnap.id,
      ...data,
    } as MentorDTO;
  } catch (error) {
    console.error("Error resolving mentor profile via private mentorAuth mapping:", error);
    return null;
  }
}
