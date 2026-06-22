
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { firebaseConfig } from './config';
import { initAppCheck } from './app-check';

let firebaseApp: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let auth: Auth | undefined;
let analytics: Analytics | undefined;

/**
 * Initializes and returns Firebase instances using a Singleton pattern.
 * Ensures services are only initialized once to prevent runtime errors like reCAPTCHA collisions.
 */
export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  analytics?: Analytics;
} {
  if (!firebaseApp) {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);

    if (typeof window !== 'undefined') {
      // Initialize App Check (idempotent)
      initAppCheck(firebaseApp);

      // Initialize Analytics if supported
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(firebaseApp!);
        }
      });
    }
  }

  return { firebaseApp, firestore, auth, analytics };
}

/**
 * Global helper to log GA4 events.
 */
export const logAnalyticsEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './firestore/use-memo-firebase';
export * from './error-emitter';
export * from './errors';
