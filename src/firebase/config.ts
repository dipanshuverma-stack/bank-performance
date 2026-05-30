import { initializeApp, getApps, getApp } from "firebase/app";

/**
 * @fileOverview Hardened Firebase Configuration.
 * Implements defensive checks for environment variables to prevent kernel-level crashes.
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
    // Strictly validate that the key is not missing or a placeholder
    if (!key || key === "" || key === "undefined" || key.includes("YOUR_") || key.includes("MISSING")) {
      console.warn("[Firebase] Operational Warning: No valid API Key detected. Cloud sync suspended.");
      return null;
    }
    
    if (getApps().length > 0) return getApp();
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.warn('[Firebase] SDK Initialization Protocol Fault:', error);
    return null;
  }
};
