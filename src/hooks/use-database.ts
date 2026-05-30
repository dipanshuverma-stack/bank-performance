'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  QueryConstraint,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';

/**
 * @fileOverview Professional Real-time Data Hook.
 * Automatically scopes queries to the active user and handles real-time sync.
 */

export function useRealtimeCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const db = useFirestore();
  const user = useUser();

  useEffect(() => {
    if (!db || !user) {
      setData([]);
      setLoading(false);
      return;
    }

    const colRef = collection(db, 'users', user.uid, collectionName);
    const q = query(colRef, ...constraints);

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
        console.log(`[Firestore] Read Success: ${collectionName} (${items.length} units)`);
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`[Firestore] Read Failure: ${collectionName}`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, user, collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}
