
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { firebaseConfig } from './config';
import { initAppCheck } from './app-check';

let analytics: Analytics | undefined;

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  analytics?: Analytics;
} {
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  if (typeof window !== 'undefined') {
    // Enforce App Check on the client side
    initAppCheck(firebaseApp);

    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(firebaseApp);
      }
    });
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
