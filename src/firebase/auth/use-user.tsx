
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * @fileOverview Hardened user identity hook using Supabase Auth.
 * Aligns Supabase ID to 'uid' for Firestore compatibility.
 */

export interface EliteUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export function useUser() {
  const [user, setUser] = useState<EliteUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const loadedUser = {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name,
            photoURL: session.user.user_metadata?.avatar_url,
          };
          console.log(`[Auth] User Loaded: ${loadedUser.email}`);
          setUser(loadedUser);
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
        const loadedUser = {
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name,
          photoURL: session.user.user_metadata?.avatar_url,
        };
        console.log(`[Auth] User Loaded (${event}): ${loadedUser.email}`);
        setUser(loadedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
