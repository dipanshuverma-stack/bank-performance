'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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
    // 1. Initial Session Check
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

    // 2. Listen for Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[Auth] Supabase Event: ${event}`);
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

  return { user, loading };
}
