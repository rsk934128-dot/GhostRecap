
'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';
import { SplashScreen } from '@/components/SplashScreen';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, firestore, auth, analytics } = initializeFirebase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds splash duration

    if (analytics) {
      console.log('Firebase Analytics initialized for Mission 400.');
    }
    return () => clearTimeout(timer);
  }, [analytics]);

  return (
    <html lang="en" className="dark">
      <head>
        {/* Primary Meta Tags */}
        <title>GhostRecap - Communication Intelligence OS</title>
        <meta name="title" content="GhostRecap - Communication Intelligence OS" />
        <meta name="description" content="Unified AI-powered intelligence for secure digital conversations across WhatsApp, Signal, and Telegram." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GhostRecap OS" />
        <meta property="og:description" content="Secure your digital communications with AI-powered intelligence layer 400." />
        <meta property="og:image" content="https://picsum.photos/seed/ghost1/1200/630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="GhostRecap OS" />
        <meta property="twitter:description" content="Communication Intelligence OS for secure orchestration." />
        <meta property="twitter:image" content="https://picsum.photos/seed/ghost1/1200/630" />

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
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary overflow-x-hidden">
        <FirebaseClientProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
          {isLoading && <SplashScreen />}
          <div className={isLoading ? "hidden" : "block"}>
            {children}
          </div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
