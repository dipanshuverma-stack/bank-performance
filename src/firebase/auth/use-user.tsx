'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Hardened user identity hook.
 * Prevents hydration errors by carefully managing auth lifecycle.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth isn't initialized yet, stay in loading state
    if (!auth) {
      return;
    }

    // Initialize with current value immediately
    setUser(auth.currentUser);
    setLoading(false);

    // Subscribe to future changes
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    }, (error) => {
      console.error("[Auth] Session Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
