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
    }, 2000); 

    if (analytics) {
      console.log('Firebase Analytics initialized for Mission 400.');
    }
    return () => clearTimeout(timer);
  }, [analytics]);

  const faviconSvg = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M50 5C30 5 15 15 15 40C15 70 50 95 50 95C50 95 85 70 85 40C85 15 70 5 50 5Z%22 fill=%22%233b82f6%22/><circle cx=%2235%22 cy=%2240%22 r=%226%22 fill=%22black%22/><circle cx=%2265%22 cy=%2240%22 r=%226%22 fill=%22black%22/></svg>`;

  // Structured Data for AI/Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GhostRecap OS",
    "operatingSystem": "Web",
    "applicationCategory": "FintechApplication",
    "description": "Unified AI-powered Communication Intelligence OS for secure digital conversations.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Sheikh Farid",
      "jobTitle": "System Architect"
    }
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>GhostRecap - Communication Intelligence OS</title>
        <meta name="title" content="GhostRecap - Communication Intelligence OS" />
        <meta name="description" content="GhostRecap is an AI-powered Communication Intelligence OS designed to unify, analyze, automate, and secure digital conversations across WhatsApp, Signal, and Telegram." />
        
        <link rel="icon" type="image/svg+xml" href={faviconSvg} />
        <link rel="apple-touch-icon" href={faviconSvg} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ghostrecap.app" />
        <meta property="og:title" content="GhostRecap OS - Mission 400" />
        <meta property="og:description" content="Secure your digital communications with AI-powered intelligence layer 400." />
        <meta property="og:image" content="https://picsum.photos/seed/ghost-preview/1200/630" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary overflow-x-hidden" suppressHydrationWarning>
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