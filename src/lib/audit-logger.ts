/**
 * @fileOverview Centralized utility for logging tactical user actions.
 * Integrates Supabase Identity with Firebase Firestore storage.
 */

import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { supabase } from '@/lib/supabase';
import { getAppInstance } from '@/firebase/config';

export interface AuditLog {
  id: string;
  category: string;
  action: string;
  timestamp: string;
  createdAt: number;
  details: string;
}

export const logAuditAction = async (category: string, action: string, details: string) => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const twelveHoursAgo = now - (12 * 60 * 60 * 1000);
  const timestamp = new Date(now).toLocaleString();
  
  const newLog: AuditLog = {
    id: Math.random().toString(36).substr(2, 9),
    category,
    action,
    details,
    timestamp,
    createdAt: now,
  };

  try {
    // 1. Local Persistence (Buffer)
    const savedLogs = localStorage.getItem("elite-audit-logs");
    let logs: AuditLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    const purgedLogs = logs.filter(l => l.createdAt && l.createdAt > twelveHoursAgo);
    localStorage.setItem("elite-audit-logs", JSON.stringify([newLog, ...purgedLogs].slice(0, 50)));
    window.dispatchEvent(new Event('elite-audit-updated'));

    // 2. Cloud Uplink (Hybrid: Supabase Auth -> Firestore DB)
    const firebaseApp = getAppInstance();
    if (firebaseApp) {
      const db = getFirestore(firebaseApp);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const logRef = collection(db, 'users', session.user.id, 'auditLogs');
        await addDoc(logRef, {
          ...newLog,
          serverTimestamp: new Date(),
        });
        console.log(`[Firestore] Hybrid Audit Success: users/${session.user.id}/auditLogs`);
      }
    }
  } catch (error: any) {
    console.warn("[Audit] Operational Warning:", error.message);
  }
};
