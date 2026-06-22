/**
 * Firebase configuration object.
 * These values are public and safe to be bundled in the client-side code.
 * Ensure these environment variables are set in your deployment platform.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAs-ExampleKey-ReplaceWithRealOne",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-9473636133-97f16.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-9473636133-97f16",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-9473636133-97f16.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "9473636133",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:9473636133:web:example",
  measurementId: "G-8ETG3NV497"
};
