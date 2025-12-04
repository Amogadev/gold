import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { FirebaseProvider, useAuth, useFirestore } from './provider';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  
  return { app, auth, db };
}

export {
  initializeFirebase,
  useUser,
  useCollection,
  useDoc,
  FirebaseProvider,
  useAuth,
  useFirestore,
};

export type { FirebaseApp, Auth, Firestore };
