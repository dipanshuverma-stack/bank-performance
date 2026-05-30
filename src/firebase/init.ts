import { getAppInstance } from './config';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * @fileOverview Isolated Firebase initialization to prevent circular dependencies.
 */
export function initializeFirebase() {
  const firebaseApp = getAppInstance();
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  return { firebaseApp, firestore, auth };
}
