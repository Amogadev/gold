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

// A map to store initialized Firebase services to avoid re-initialization.
const services = new Map();

function initializeFirebase() {
  if (services.has('firebase')) {
    return services.get('firebase');
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const firebaseServices = { app, auth, db };
  
  services.set('firebase', firebaseServices);
  
  return firebaseServices;
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
