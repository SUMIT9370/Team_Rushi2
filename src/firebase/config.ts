'use client';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "studio-2271828587-d1be7",
  appId: "1:215654047100:web:1ce0294851846e1ef8d8f9",
  apiKey: "AIzaSyAL8w1AOJvwMeORLfRxwlh1ac0l0h3Milo",
  authDomain: "studio-2271828587-d1be7.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "215654047100",
};

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

export { app, auth, db };
