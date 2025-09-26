import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { applicationDefault } from 'firebase-admin/app';

// This function ensures the Firebase Admin app is initialized only once.
function getAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
        // automatically provided by App Hosting.
        return admin.initializeApp({
            credential: applicationDefault(),
        });
    } catch (e) {
        console.error('Firebase Admin Initialization Error:', e);
        // This block will re-throw the error, ensuring that we don't proceed
        // with an uninitialized app.
        throw new Error('Failed to initialize Firebase Admin SDK. Ensure GOOGLE_APPLICATION_CREDENTIALS are set.');
    }
}

const app = getAdminApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
