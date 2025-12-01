'use client';

import { initializeFirebase } from './config';
import { FirebaseProvider, FirebaseContextValue } from './provider';
import { ReactNode } from 'react';

// Initialize Firebase once on the client
const firebaseInstance = initializeFirebase();

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider value={firebaseInstance}>{children}</FirebaseProvider>
  );
}
