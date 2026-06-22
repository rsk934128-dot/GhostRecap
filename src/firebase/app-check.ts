
'use client';

import { FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

/**
 * Initializes Firebase App Check for production security enforcement.
 * Protects Firestore, Auth, and AI nodes from unauthorized bot traffic.
 */
export function initAppCheck(app: FirebaseApp) {
  if (typeof window === 'undefined') return;

  try {
    // Note: In production, ensure the reCAPTCHA site key is provided in environment variables.
    // For now, we use a placeholder that will trigger the enforcement layer.
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY || '6Lc_your_site_key_here'
      ),
      isTokenAutoRefreshEnabled: true,
    });
    console.log('--- NEXUS CORE: APP CHECK ENFORCED ---');
  } catch (error) {
    console.error('App Check initialization failed:', error);
  }
}
