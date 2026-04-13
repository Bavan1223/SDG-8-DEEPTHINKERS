/* ============================================================
   AgriAgent – Firebase Admin Config
   Initialises Firebase Admin SDK for backend use
   ============================================================ */

import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let app: admin.app.App;

/**
 * Returns an initialised Firebase Admin app (singleton).
 * Supports service account file or environment variable.
 */
export function getFirebaseAdmin(): admin.app.App {
  if (app) return app;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath && fs.existsSync(path.resolve(serviceAccountPath))) {
    // Load from file
    const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountPath), 'utf-8'));
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId:  process.env.FIREBASE_PROJECT_ID,
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Load from inline env JSON (for CI/CD)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId:  process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // Fallback: emulator / demo mode
    console.warn('⚠️  Firebase Admin: No credentials found. Running in demo mode.');
    app = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID ?? 'agriagent-demo',
    });
  }

  return app;
}

/** Firestore DB instance */
export function getFirestore(): admin.firestore.Firestore {
  return getFirebaseAdmin().firestore();
}
