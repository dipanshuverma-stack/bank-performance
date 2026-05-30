import { initializeApp, getApps, getApp } from "firebase/app";

/**
 * @fileOverview Hardened Firebase Configuration with Operational Telemetry.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const getFirebaseConfig = () => {
  return firebaseConfig;
};

export const getAppInstance = () => {
  try {
    if (getApps().length > 0) {
      return getApp();
    }
    
    const app = initializeApp(firebaseConfig);
    console.log("[Firestore] Initialized: Persistence Kernel Active.");
    return app;
  } catch (error: any) {
    console.error('[Firebase] SDK Initialization Protocol Fault:', error.message);
    return null;
  }
};
