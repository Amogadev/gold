import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import {
  useFirebaseApp,
  useAuth,
  useFirestore,
  FirebaseProvider,
} from './provider';

import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

function initializeFirebase() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

export {
  initializeFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
  FirebaseProvider,
  useUser,
  useCollection,
  useDoc,
};

export type { FirebaseApp, Auth, Firestore };
