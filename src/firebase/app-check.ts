'use client';

import { FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';

let appCheckInstance: AppCheck | undefined;

/**
 * Initializes Firebase App Check for production security enforcement.
 * Protects Firestore, Auth, and AI nodes from unauthorized bot traffic.
 * Implements a singleton pattern to prevent re-initialization errors and reCAPTCHA runtime crashes.
 */
export function initAppCheck(app: FirebaseApp) {
  // Guard for SSR and duplicate initialization
  if (typeof window === 'undefined') return;
  if (appCheckInstance) return appCheckInstance;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY;
  
  // Guard against missing or placeholder keys to prevent reCAPTCHA runtime errors
  if (!siteKey || siteKey === '6Lc_your_site_key_here' || siteKey.length < 10) {
    console.warn('--- App Check: Skipping enforcement due to missing or invalid site key. ---');
    return;
  }

  // Ensure reCAPTCHA container is not required if using Enterprise provider
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    console.log('--- NEXUS CORE: APP CHECK ENFORCED ---');
    return appCheckInstance;
  } catch (error) {
    // Gracefully handle if App Check is already initialized
    console.warn('App Check initialization skipped or failed:', error);
  }
}