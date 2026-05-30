/**
 * @fileOverview Centralized utility for logging tactical user actions.
 * Standardized on Firebase Auth for cloud synchronization.
 */

import { doc, collection, addDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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

    // 2. Cloud Uplink (Source of Truth)
    const firebaseApp = getAppInstance();
    if (firebaseApp) {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      
      if (auth && auth.currentUser) {
        const logRef = collection(db, 'users', auth.currentUser.uid, 'auditLogs');
        await addDoc(logRef, {
          ...newLog,
          serverTimestamp: new Date(),
        });
        console.log(`[Firestore] Audit Write Success: users/${auth.currentUser.uid}/auditLogs`);
      }
    }
  } catch (error: any) {
    console.warn("[Audit] Operational Warning:", error.message);
  }
};
