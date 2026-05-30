'use client';

import React, { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview Client-side Firebase Provider.
 * Safely initializes Firebase instances only on the client.
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
    if (!mounted) return null;
    try {
      return initializeFirebase();
    } catch (error) {
      console.error('Firebase Critical Initialization Error:', error);
      return null;
    }
  }, [mounted]);

  // If not mounted yet, render children without provider to avoid SSR mismatches
  // But wrap them in a stable structure
  if (!mounted) {
    return <>{children}</>;
  }

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
