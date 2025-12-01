'use client';

import { getAuth as getFirebaseAuth } from 'firebase/auth';
import { app } from '@/firebase/config';

export async function signOut() {
  const auth = getFirebaseAuth(app);
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out', error);
  }
}
