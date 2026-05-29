'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Hardened hook for retrieving the current authenticated user.
 * Implements null-safe checks for the auth instance to prevent hydration crashes.
 */

export function useUser() {
  const auth = useAuth();
  
  // Initialize with null-safe access to prevent 'reading properties of null' errors
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is null (e.g. during initialization or server-side render), exit early
    if (!auth) {
      setLoading(false);
      return;
    }

    // Set initial user if auth becomes available
    setUser(auth.currentUser);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
