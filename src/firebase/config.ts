import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * @fileOverview Hardened Firebase Configuration.
 * Optimized for dual-mode execution (Client & Server).
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

/**
 * Safely retrieves or initializes the Firebase App instance.
 * Returns null if credentials are missing or invalid to prevent kernel panic.
 */
export function getAppInstance(): FirebaseApp | null {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('your_')) {
    return null;
  }
  try {
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (error) {
    console.error("[Firebase] Kernel Init Error:", error);
    return null;
  }
}

const appInstance = getAppInstance();

export const app = appInstance;
export const auth = appInstance ? getAuth(appInstance) : null;
export const db = appInstance ? getFirestore(appInstance) : null;

if (appInstance) {
  console.log("[Firebase] Core Persistence Kernel Initialized.");
} else {
  console.warn("[Firebase] Operational Warning: Cloud Sync suspended due to missing credentials.");
}
