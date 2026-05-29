
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDummyKey",
  authDomain: "elite-perf-terminal.firebaseapp.com",
  projectId: "elite-perf-terminal",
  storageBucket: "elite-perf-terminal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

export const getFirebaseConfig = () => {
  return firebaseConfig;
};

export const getAppInstance = () => {
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
};
