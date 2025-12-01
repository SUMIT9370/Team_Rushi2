'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  DocumentData,
  Firestore,
  QueryConstraint,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  constraints?: QueryConstraint[];
  listen?: boolean;
}

export function useCollection<T>(
  path: string,
  options?: UseCollectionOptions
) {
  const db = useFirestore();
  const [data, setData = useState<T[] | null>(null);
  const [loading, setLoading = useState(true);
  const [error, setError = useState<Error | null>(null);

  const memoizedConstraints = useMemo(() =options?.constraints || [], [options?.constraints]);

  useEffect(() = {
    if (!db) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(db, path);
    const q = query(collectionRef, ...memoizedConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) = {
        const result: T[] = [];
        snapshot.forEach((doc) = {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) = {
        console.error(`Error fetching collection ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () = unsubscribe();
  }, [db, path, memoizedConstraints]);

  return { data, loading, error };
}
