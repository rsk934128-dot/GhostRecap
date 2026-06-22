'use client';

import { FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';

let appCheckInstance: AppCheck | undefined;

/**
 * Initializes Firebase App Check for production security enforcement.
 * Singleton pattern prevents re-initialization and reCAPTCHA runtime errors.
 */
export function initAppCheck(app: FirebaseApp) {
  if (typeof window === 'undefined') return;
  if (appCheckInstance) return appCheckInstance;

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY;
  
  // Prevent initialization if siteKey is missing or placeholder
  if (!siteKey || siteKey === '6Lc_your_site_key_here' || siteKey.length < 10) {
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
    // Silent catch to prevent Runtime Error: reCAPTCHA placeholder element issue
  }
}
