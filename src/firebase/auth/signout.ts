'use client';

import { auth } from '@/firebase';

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out', error);
  }
}
