/**
 * @fileOverview Centralized utility for logging tactical user actions.
 * Dispatches a global event and syncs to Firestore if authenticated.
 * Reinforced with null-safe initialization to prevent runtime crashes.
 */

import { doc, collection, addDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAppInstance } from '@/firebase/config';

export interface AuditLog {
  id: string;
  category: string;
  action: string;
  timestamp: string;
  details: string;
}

export const logAuditAction = (category: string, action: string, details: string) => {
  // Ensure we are in a browser context
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toLocaleString();
  const newLog: AuditLog = {
    id: Math.random().toString(36).substr(2, 9),
    category,
    action,
    details,
    timestamp,
  };

  try {
    // 1. Local Storage Write (Instant/Always Available)
    const savedLogs = localStorage.getItem("elite-audit-logs");
    const logs: AuditLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    localStorage.setItem("elite-audit-logs", JSON.stringify(updatedLogs));
    
    // Notify local listeners for real-time UI updates
    window.dispatchEvent(new Event('elite-audit-updated'));

    // 2. Server Write (Async/Uplink)
    // Safely retrieve instances using the centralized config protocol
    const firebaseApp = getAppInstance();
    if (firebaseApp) {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      
      // Reinforced null-safe check for both auth and currentUser
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
