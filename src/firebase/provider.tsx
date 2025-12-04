'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp, Auth, Firestore } from '@/firebase';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  auth: null,
  db: null,
});

export const FirebaseProvider = ({
  children,
  firebaseApp,
  auth,
  db,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  db: Firestore;
}) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => useContext(FirebaseContext).firebaseApp;
export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return { auth: context.auth };
};
export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return { db: context.db };
};
