'use client';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, getSdks } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function signUpWithEmail(email, password, displayName) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });

    // Create user document in Firestore
    const { firestore } = getSdks(auth.app);
    const userRef = doc(firestore, 'users', result.user.uid);
    await setDoc(userRef, {
      id: result.user.uid,
      username: displayName,
      email: result.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    error = e;
  }

  return { result, error };
}
