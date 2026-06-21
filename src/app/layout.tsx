
'use client';

import { useEffect } from 'react';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, firestore, auth, analytics } = initializeFirebase();

  useEffect(() => {
    if (analytics) {
      console.log('Firebase Analytics initialized for Mission 400.');
    }
  }, [analytics]);

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary">
        <FirebaseClientProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
