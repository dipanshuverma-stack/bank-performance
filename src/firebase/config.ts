import { initializeApp, getApps, getApp } from "firebase/app";

/**
 * @fileOverview Hardened Firebase Configuration.
 * Repaired: Removed restrictive validation logic that was blocking initialization.
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
    const key = firebaseConfig.apiKey;
    
    // Minimal validation to allow standard environment loading
    if (!key || key === "undefined" || key === "") {
      console.warn("[Firebase] Operational Warning: No API Key detected in environment. Cloud sync disabled.");
      return null;
    }
    
    if (getApps().length > 0) {
      return getApp();
    }
    
    const app = initializeApp(firebaseConfig);
    console.log("[Firebase] Identity & Persistence Kernel Initialized.");
    return app;
  } catch (error) {
    console.error('[Firebase] SDK Initialization Protocol Fault:', error);
    return null;
  }
};
