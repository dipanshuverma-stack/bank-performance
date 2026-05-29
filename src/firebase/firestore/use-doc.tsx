'use client';

import { useState, useEffect } from 'react';
import { DocumentReference, onSnapshot } from 'firebase/firestore';

export function useDoc<T = any>(ref: DocumentReference | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    return onSnapshot(ref, (snapshot) => {
      setData(snapshot.exists() ? (snapshot.data() as T) : null);
      setLoading(false);
    });
  }, [ref?.path]);

  return { data, loading };
}
