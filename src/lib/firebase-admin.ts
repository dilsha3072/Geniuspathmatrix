import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { applicationDefault } from 'firebase-admin/app';

let app: admin.app.App;
if (!admin.apps.length) {
    try {
      // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
      // automatically provided by App Hosting.
      app = admin.initializeApp({
        credential: applicationDefault(),
      });
    } catch (e) {
      console.error('Firebase Admin Initialization Error:', e);
      // Fallback for local development if GOOGLE_APPLICATION_CREDENTIALS is not set
      if (process.env.NODE_ENV !== 'production') {
        // This will only work if you have the service account file locally
        // and the env var is set in your local .env file.
        // It's a common pattern for local dev vs. cloud deployment.
      } else {
        throw e;
      }
    }
} else {
    app = admin.app();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
