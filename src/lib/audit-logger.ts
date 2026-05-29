/**
 * @fileOverview Centralized utility for logging tactical user actions.
 * Dispatches a global event to ensure the UI stays synchronized.
 */

export interface AuditLog {
  id: string;
  category: string;
  action: string;
  timestamp: string;
  details: string;
}

export const logAuditAction = (category: string, action: string, details: string) => {
  if (typeof window === 'undefined') return;

  try {
    const savedLogs = localStorage.getItem("elite-audit-logs");
    const logs: AuditLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      action,
      details,
      timestamp: new Date().toLocaleString(),
    };

    // Keep only the most recent 50 logs for performance
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    localStorage.setItem("elite-audit-logs", JSON.stringify(updatedLogs));
    
    // Notify the system that a new log is available
    window.dispatchEvent(new Event('elite-audit-updated'));
  } catch (error) {
    console.warn("Audit Logger Error:", error);
  }
};
