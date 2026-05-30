'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { EliteUser, useUser } from './auth/use-user';

interface FirebaseContextProps {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  user: EliteUser | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextProps>({
  firebaseApp: null,
  firestore: null,
  user: null,
  loading: true,
});

export function FirebaseProvider({
  children,
  firebaseApp,
  firestore,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
}) {
  const { user, loading } = useUser();

  return (
    <FirebaseContext.Provider value={{ firebaseApp, firestore, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirestore() {
  const { firestore } = useFirebase();
  return firestore;
}

export function useEliteAuth() {
  const { user, loading } = useFirebase();
  return { user, loading };
}

// Deprecated useAuth to maintain backward compatibility during transition
export function useAuth() {
  return null; // Firebase Auth is no longer used directly
}
