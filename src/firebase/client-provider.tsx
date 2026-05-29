'use client';

import React, { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview Client-side Firebase Provider.
 * Safely initializes Firebase instances.
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
    if (typeof window === 'undefined') return null;
    try {
      return initializeFirebase();
    } catch (error) {
      console.error('Firebase Critical Initialization Error:', error);
      return null;
    }
  }, []);

  return (
    <FirebaseProvider 
      firebaseApp={instances?.firebaseApp ?? null} 
      firestore={instances?.firestore ?? null} 
      auth={instances?.auth ?? null}
    >
      {children}
    </FirebaseProvider>
  );
}
