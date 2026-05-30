'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * @fileOverview Hardened user identity hook.
 * Standardized on Firebase Auth for Firestore compatibility.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("[Auth] Auth instance not available. Check your Firebase configuration.");
      setLoading(false); // Ensure loading is released even if auth is missing
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log(`[Auth] State Change: ${u ? 'Authenticated (' + u.uid + ')' : 'Unauthenticated'}`);
      setUser(u);
      setLoading(false);
    }, (error) => {
      console.error("[Auth] Session Protocol Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
