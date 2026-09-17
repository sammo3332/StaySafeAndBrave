'use client';
import { useEffect, useState } from 'react';
import { onSnapshot, type DocumentData, type DocumentReference, type FirestoreError } from 'firebase/firestore';

type Target = DocumentReference<DocumentData> | null | undefined;
export function usePublicDocument<T>(target: Target) {
  const [state, setState] = useState<{
    target: Target; data: (T & { id: string }) | null; error: FirestoreError | null;
  }>({ target: null, data: null, error: null });
  useEffect(() => {
    if (!target) return;
    let active = true;
    const unsubscribe = onSnapshot(target, snapshot => {
      if (active) setState({ target, data: snapshot.exists() ? { ...snapshot.data() as T, id: snapshot.id } : null, error: null });
    }, error => { if (active) setState({ target, data: null, error }); });
    return () => { active = false; unsubscribe(); };
  }, [target]);
  if (!target || state.target !== target) return { data: null, error: null, isLoading: Boolean(target) };
  return { ...state, isLoading: false };
}
