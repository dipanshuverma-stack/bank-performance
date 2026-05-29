import { getAppInstance } from './config';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function initializeFirebase() {
  const firebaseApp = getAppInstance();
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export * from './use-memo-firebase';
