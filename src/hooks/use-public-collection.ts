'use client';
import { useEffect, useState } from 'react';
import { onSnapshot, type DocumentData, type FirestoreError, type Query } from 'firebase/firestore';

type Target = Query<DocumentData> | null | undefined;
/** Errors stay in the requesting public section; access rules remain enforced. */
export function usePublicCollection<T>(target: Target) {
  const [state, setState] = useState<{
    target: Target; data: (T & { id: string })[] | null;
    error: FirestoreError | null; isLoading: boolean;
  }>({ target: null, data: null, error: null, isLoading: false });
  useEffect(() => {
    if (!target) return;
    let active = true;
    const unsubscribe = onSnapshot(target, snapshot => {
      if (active) setState({ target, data: snapshot.docs.map(doc => ({ ...doc.data() as T, id: doc.id })), error: null, isLoading: false });
    }, error => {
      if (active) setState({ target, data: null, error, isLoading: false });
    });
    return () => { active = false; unsubscribe(); };
  }, [target]);
  if (!target || state.target !== target) return { data: null, error: null, isLoading: Boolean(target) };
  return state;
}
