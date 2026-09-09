import {
  doc,
  collection,
  writeBatch,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";

export interface SendMessageParams {
  db: Firestore;
  conversationId: string;
  senderId: string;
  text: string;
  /**
   * If creating conversation for the first time (traveler-only).
   */
  createConversationData?: {
    travelerId: string;
    mentorId: string;
    mentorName: string;
  };
}

/**
 * Sends a message within a conversation using an atomic Firestore batch.
 * 
 * INVARIANT:
 * - Updates/sets parent conversation metadata (updatedAt, lastMessageText, lastMessageSenderId, lastMessageCreatedAt)
 * - Appends message document to /conversations/{conversationId}/messages subcollection
 * - Both operations succeed or fail together atomically via writeBatch()
 */
export async function sendAtomicMessage({
  db,
  conversationId,
  senderId,
  text,
  createConversationData,
}: SendMessageParams): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Nachricht darf nicht leer sein.");
  }
  if (trimmed.length > 2000) {
    throw new Error("Nachricht darf maximal 2000 Zeichen lang sein.");
  }

  const batch = writeBatch(db);
  const convRef = doc(db, "conversations", conversationId);
  const messagesCol = collection(db, "conversations", conversationId, "messages");
  const messageRef = doc(messagesCol);

  const messagePayload = {
    id: messageRef.id,
    senderId,
    text: trimmed,
    createdAt: serverTimestamp(),
  };

  if (createConversationData) {
    batch.set(convRef, {
      id: conversationId,
      bookingId: conversationId,
      travelerId: createConversationData.travelerId,
      mentorId: createConversationData.mentorId,
      mentorName: createConversationData.mentorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageText: trimmed,
      lastMessageSenderId: senderId,
      lastMessageCreatedAt: serverTimestamp(),
    });
    batch.set(messageRef, messagePayload);
  } else {
    batch.update(convRef, {
      updatedAt: serverTimestamp(),
      lastMessageText: trimmed,
      lastMessageSenderId: senderId,
      lastMessageCreatedAt: serverTimestamp(),
    });
    batch.set(messageRef, messagePayload);
  }

  await batch.commit();
}
