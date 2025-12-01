'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc, DocumentData, Firestore } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T>(path: string) {
  const db = useFirestore();
  const [data, setData = useState<T | null>(null);
  const [loading, setLoading = useState(true);
  const [error, setError = useState<Error | null>(null);

  useEffect(() = {
    if (!db || !path) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, path);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) = {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) = {
        console.error(`Error fetching document ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () = unsubscribe();
  }, [db, path]);

  return { data, loading, error };
}
