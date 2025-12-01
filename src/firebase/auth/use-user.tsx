'use client';
import { useMemo, type ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useFirebase, useFirestore, useUser as useAuthUser } from '../provider';
import { useDoc, type UseDocResult } from '../firestore/use-doc';

export type { User } from 'firebase/auth';

export interface UserData {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    createdAt: string;
    updatedAt: string;
}
  
export interface UserDataHookResult extends UseDocResult<UserData> {}

export function useUser() {
    return useAuthUser();
}

/**
 * Hook for accessing the currently authenticated user's data from Firestore.
 * @returns {UserDataHookResult} An object containing the user's data, loading state, and error.
 */
export function useUserData(): UserDataHookResult {
  const { user, isUserLoading: isAuthUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const {
    data: userData,
    isLoading: isDocLoading,
    error,
  } = useDoc<UserData>(userDocRef);

  const isLoading = isAuthUserLoading || (user && !userData && isDocLoading);

  return {
    data: userData,
    isLoading,
    error,
  };
}
