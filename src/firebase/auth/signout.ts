'use client';

import { getAuth } from '@/firebase';

export async function signOut() {
  const auth = getAuth();
  if (!auth) {
    console.error('Firebase Auth is not initialized.');
    return;
  }
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out', error);
  }
}
