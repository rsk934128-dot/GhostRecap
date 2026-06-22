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
  // Fixed: Added extra check for defined DOM before initializing to prevent placeholder error
  const placeholderExists = document.getElementById('recaptcha-container') || document.body;

  if (!siteKey || siteKey === '6Lc_your_site_key_here' || !placeholderExists) {
    console.warn('--- App Check: Skipping enforcement due to missing site key or DOM context. ---');
    return;
  }

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
