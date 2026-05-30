'use client';

import { useState, useEffect } from 'react';
import { Query, onSnapshot } from 'firebase/firestore';

export function useCollection<T = any>(query: Query | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`[Firestore] Initiating subscription for query path...`);
    
    const unsubscribe = onSnapshot(query, 
      (snapshot) => {
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
        console.log(`[Firestore] Read Success: ${results.length} units retrieved.`);
        setData(results);
        setLoading(false);
      },
      (error) => {
        console.error(`[Firestore] Read Failure:`, error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading };
}
