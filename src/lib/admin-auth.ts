import { doc, getDoc, Firestore } from "firebase/firestore";
import type { AdminAuthDTO } from "@/lib/dtos";

/**
 * Resolves whether a specific Firebase Auth UID has admin privileges via the private /adminAuth mapping.
 * 
 * INVARIANT:
 * - Reads /adminAuth/{authUid} directly (only readable by request.auth.uid == authUid).
 * - Verifies role === 'admin'.
 * - Returns false truthfully if no mapping exists, if role !== 'admin', or on error.
 * - Never checks public user profile for admin role.
 * - Never grants client-side admin privileges without an authentic Firestore record.
 */
export async function resolveIsAdminByAuthUid(
  db: Firestore | null,
  authUid: string | null | undefined
): Promise<boolean> {
  if (!db || !authUid) {
    return false;
  }

  try {
    const adminMappingRef = doc(db, "adminAuth", authUid);
    const adminMappingSnap = await getDoc(adminMappingRef);

    if (!adminMappingSnap.exists()) {
      return false;
    }

    const mappingData = adminMappingSnap.data() as AdminAuthDTO;
    return mappingData?.role === "admin";
  } catch (error) {
    // If permission denied or document not found, gracefully fail closed
    console.error("Error resolving admin role via private adminAuth mapping:", error);
    return false;
  }
}
