'use client';

import { FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';

let appCheckInstance: AppCheck | undefined;

/**
 * Initializes Firebase App Check for production security enforcement.
 * Protects Firestore, Auth, and AI nodes from unauthorized bot traffic.
 * Implements a singleton pattern to prevent re-initialization errors.
 */
export function initAppCheck(app: FirebaseApp) {
  if (typeof window === 'undefined') return;
  if (appCheckInstance) return appCheckInstance;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY;
  
  // Guard against missing or placeholder keys to prevent reCAPTCHA runtime errors
  if (!siteKey || siteKey === '6Lc_your_site_key_here' || siteKey.length < 10) {
    console.warn('--- App Check: Skipping enforcement due to missing or invalid site key. ---');
    return;
  }

  // Ensure DOM is ready for reCAPTCHA
  const placeholderExists = document.body;
  if (!placeholderExists) return;

  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    console.log('--- NEXUS CORE: APP CHECK ENFORCED ---');
    return appCheckInstance;
  } catch (error) {
    // Gracefully handle if App Check is already initialized or fails to load
    console.warn('App Check initialization skipped or failed:', error);
  }
}
