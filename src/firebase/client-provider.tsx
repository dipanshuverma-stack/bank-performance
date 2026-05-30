'use client';

import React, { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview Client-side Firebase Provider.
 * Safely initializes Firebase instances while maintaining structural hydration parity.
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
    // structural stability: return consistent shape even if null
    if (typeof window === 'undefined') {
      return { firebaseApp: null, firestore: null, auth: null };
    }
    try {
      return initializeFirebase();
    } catch (error) {
      console.error('[Firebase] Critical Initialization Error:', error);
      return { firebaseApp: null, firestore: null, auth: null };
    }
  }, []);

  // Structural Stability: Always render the provider to avoid hydration mismatches
  return (
    <FirebaseProvider 
      firebaseApp={instances.firebaseApp} 
      firestore={instances.firestore} 
      auth={instances.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
