'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAuth } from '@/firebase';

export async function signInWithGoogle() {
  const auth = getAuth();
  if (!auth) {
    console.error('Firebase Auth is not initialized.');
    return;
  }
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
}
