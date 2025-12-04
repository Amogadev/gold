
'use client';

import { useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
  } | null>(null);

  useEffect(() => {
    const services = initializeFirebase();
    setFirebase(services);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {firebase ? (
          <FirebaseProvider
            firebaseApp={firebase.app}
            auth={firebase.auth}
            db={firebase.db}
          >
            {children}
          </FirebaseProvider>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        )}
        <Toaster />
      </body>
    </html>
  );
}
