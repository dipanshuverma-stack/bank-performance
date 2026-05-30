import { getAppInstance } from './config';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

/**
 * @fileOverview Isolated Firebase initialization with defensive guards.
 * Repaired: Added safety checks to prevent crashes on null app instances.
 */
export function initializeFirebase() {
  const firebaseApp = getAppInstance();
  
  if (!firebaseApp) {
    return { firebaseApp: null, firestore: null, auth: null };
  }

  try {
    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    return { firebaseApp, firestore, auth };
  } catch (error) {
    console.error("[Firebase] Service Initialization Error:", error);
    return { firebaseApp, firestore: null, auth: null };
  }
}
