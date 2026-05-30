import { initializeApp, getApps, getApp } from "firebase/app";

// Standardizing on environment variables for Cloud Uplink.
// Fallback keys are strictly for non-authenticated local-only debugging.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy_MISSING_KEY_PLEASE_CONFIGURE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "elite-perf-terminal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "elite-perf-terminal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "elite-perf-terminal.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:ffffffffffffffff"
};

export const getFirebaseConfig = () => {
  return firebaseConfig;
};

export const getAppInstance = () => {
  try {
    if (getApps().length > 0) return getApp();
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('[Firebase] SDK Initialization Protocol Fault:', error);
    // Return existing app if re-initialization is attempted incorrectly
    if (getApps().length > 0) return getApp();
    throw error;
  }
};
