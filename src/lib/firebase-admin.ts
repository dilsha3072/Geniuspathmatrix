import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { applicationDefault } from 'firebase-admin/app';

if (!admin.apps.length) {
  try {
    // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
    // automatically provided by App Hosting.
    admin.initializeApp({
      credential: applicationDefault(),
    });
  } catch (e) {
    console.error('Firebase Admin Initialization Error:', e);
  }
}

const auth = admin.auth();
const db = getFirestore();

export { auth, db };
