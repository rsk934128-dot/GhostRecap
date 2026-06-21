
'use client';

import { useEffect } from 'react';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';
import Script from 'next/script';
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
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8ETG3NV497"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8ETG3NV497');
          `}
        </Script>
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
