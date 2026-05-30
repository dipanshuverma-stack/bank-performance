/**
 * @fileOverview Centralized utility for logging tactical user actions.
 * Dispatches a global event and syncs to Firestore if authenticated.
 * Implements a 12-hour auto-purge protocol for local logs.
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

export const logAuditAction = (category: string, action: string, details: string) => {
  // Ensure we are in a browser context
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
    // 1. Local Storage Write (Instant/Always Available)
    const savedLogs = localStorage.getItem("elite-audit-logs");
    let logs: AuditLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    
    // Purge old logs (older than 12h) and limit total count
    const purgedLogs = logs.filter(l => l.createdAt && l.createdAt > twelveHoursAgo);
    const updatedLogs = [newLog, ...purgedLogs].slice(0, 50);
    
    localStorage.setItem("elite-audit-logs", JSON.stringify(updatedLogs));
    
    // Notify local listeners for real-time UI updates
    window.dispatchEvent(new Event('elite-audit-updated'));

    // 2. Server Write (Async/Uplink)
    const firebaseApp = getAppInstance();
    if (firebaseApp) {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      
      if (auth && auth.currentUser) {
        const logRef = collection(db, 'users', auth.currentUser.uid, 'auditLogs');
        addDoc(logRef, {
          ...newLog,
          serverTimestamp: new Date(),
        }).catch(err => console.warn("Cloud Audit Sync Failed:", err));
      }
    }
  } catch (error) {
    console.warn("Audit Logger Operational Warning:", error);
  }
};
