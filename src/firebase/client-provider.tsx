
'use client';

import { useEffect, useState } from 'react';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

// This provider is responsible for initializing Firebase on the client side.
// It should be used as a wrapper around the root layout of the application.
// It ensures that Firebase is initialized only once.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    let app: FirebaseApp;
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    
    const auth = getAuth(app);
    const db = getFirestore(app);

    if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
        // Must be the same port as specified in firebase.json
        const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
        console.log(`Connecting to Firebase emulators at ${host}`);
        try {
            connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
        } catch (e) {
            console.warn('Auth emulator already connected or error:', e);
        }
        try {
            connectFirestoreEmulator(db, host, 8080);
        } catch (e) {
            console.warn('Firestore emulator already connected or error:', e);
        }
    } else {
        console.log('Connecting to production Firebase services');
    }

    setFirebase({ app, auth, db });
  }, []);

  if (!firebase) {
    // You can return a loading spinner here
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading Firebase...</div>
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebase.app}
      auth={firebase.auth}
      db={firebase.db}
    >
      {children}
    </FirebaseProvider>
  );
}
