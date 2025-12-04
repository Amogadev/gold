'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp, Auth, Firestore } from '@/firebase';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  auth: null,
  db: null,
  loading: true,
});

export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firebase, setFirebase] = useState<ReturnType<
    typeof initializeFirebase
  > | null>(null);

  useEffect(() => {
    const services = initializeFirebase();
    setFirebase(services);
  }, []);

  const value = useMemo(
    () => ({
      firebaseApp: firebase?.app || null,
      auth: firebase?.auth || null,
      db: firebase?.db || null,
      loading: !firebase,
    }),
    [firebase]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {value.loading ? (
        <div className="flex min-h-screen items-center justify-center">
          Loading Firebase...
        </div>
      ) : (
        children
      )}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return { auth: context.auth, loading: context.loading };
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return { db: context.db, loading: context.loading };
};
