
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}

export {
  initializeFirebase,
  FirebaseProvider,
  useUser,
  useCollection,
  useDoc,
  useFirebaseApp,
  useAuth,
  useFirestore,
};

export type { FirebaseApp, Auth, Firestore };
