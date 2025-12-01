'use client';

import { GoogleAuthProvider, signInWithPopup, getAuth as getFirebaseAuth } from 'firebase/auth';
import { app } from '@/firebase/config';

export async function signInWithGoogle() {
  const auth = getFirebaseAuth(app);
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // TODO: Save or update user data in Firestore
    
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
}
