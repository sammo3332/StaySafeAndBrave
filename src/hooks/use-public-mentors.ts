'use client';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { usePublicCollection } from '@/hooks/use-public-collection';
import { publicMentor } from '@/components/content/public-data';

export function usePublicMentors() {
  const db = useFirestore();
  const target = useMemoFirebase(() => db ? collection(db, 'mentors') : null, [db]);
  const result = usePublicCollection<unknown>(target);
  const mentors = useMemo(() => (result.data || []).map(publicMentor)
    .filter(mentor => mentor !== null).filter(mentor => mentor.active !== false), [result.data]);
  return { ...result, mentors, isLoading: !db || result.isLoading };
}
