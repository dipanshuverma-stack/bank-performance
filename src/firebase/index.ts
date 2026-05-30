'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './config';
import { Firestore } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';

/**
 * @fileOverview Unified Firebase/Supabase Context.
 * Centralized identity (Supabase) and persistence (Firestore) provider.
 */

interface EliteUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface FirebaseContextProps {
  user: EliteUser | null;
  loading: boolean;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextProps>({
  user: null,
  loading: true,
  db: null,
});

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EliteUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name,
            photoURL: session.user.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("[Auth] Supabase Session Error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name,
          photoURL: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useEliteAuth = () => useContext(FirebaseContext);
export const useFirestore = () => useContext(FirebaseContext).db;
export const useUser = () => useContext(FirebaseContext).user;

// Re-export tactical hooks for unified access
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useMemoFirebase } from './use-memo-firebase';
