'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxsVzMe-0CUS1-2tO803SV3cDx5cTIaiQ",
  authDomain: "studio-2237527215-3623e.firebaseapp.com",
  projectId: "studio-2237527215-3623e",
  storageBucket: "studio-2237527215-3623e.appspot.com",
  messagingSenderId: "1019072312283",
  appId: "1:1019072312283:web:38a3d787acca7fece26dfe"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
