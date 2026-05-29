'use client';

import React, { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * @fileOverview Client-side Firebase Provider.
 * Safely initializes Firebase instances on the client to avoid serialization
 * and hydration errors in Next.js 15.
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

  // Initialize Firebase once on the client and memoize the instances.
  const instances = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (error) {
      console.error('Firebase Critical Initialization Error:', error);
      return null;
    }
  }, []);

  if (!mounted || !instances) {
    return <>{children}</>;
  }

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
