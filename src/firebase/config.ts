
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// --- IMPORTANT ---
// Replace the placeholder values below with your actual
// Firebase project's configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  let app: FirebaseApp;
  let auth: Auth;
  let db: Firestore;

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);

  return { app, auth, db };
}

// Export the initialized services
const { app, auth, db } = initializeFirebase();
export { app, auth, db, initializeFirebase };
