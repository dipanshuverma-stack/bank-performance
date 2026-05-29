'use client';

/**
 * @fileOverview Root-level error boundary for catching fatal system failures.
 * This component MUST include <html> and <body> tags.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        backgroundColor: '#020617',
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>SYSTEM CRITICAL</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            The terminal kernel has encountered a fatal exception. 
            Operational continuity has been suspended.
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            textAlign: 'left',
            marginBottom: '2rem',
            overflow: 'auto'
          }}>
            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 900, marginBottom: '0.5rem' }}>DIAGNOSTIC DATA:</div>
            <code style={{ fontSize: '11px', color: '#cbd5e1', wordBreak: 'break-all' }}>
              {error.message || 'Unknown Kernel Failure'}
            </code>
          </div>
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              height: '60px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.2)'
            }}
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
