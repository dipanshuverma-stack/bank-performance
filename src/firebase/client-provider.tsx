'use client';

import React, { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview Client-side Firebase Provider.
 * Safely initializes Firestore instances while Supabase handles Auth.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const instances = useMemo(() => {
    if (typeof window === 'undefined') {
      return { firebaseApp: null, firestore: null };
    }
    try {
      const { firebaseApp, firestore } = initializeFirebase();
      return { firebaseApp, firestore };
    } catch (error) {
      console.error('[Firebase] Critical Initialization Error:', error);
      return { firebaseApp: null, firestore: null };
    }
  }, []);

  // Ensure providers are stable during hydration
  return (
    <FirebaseProvider 
      firebaseApp={instances.firebaseApp} 
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
