'use client';

import React from 'react';

/**
 * @fileOverview Bulletproof Root Error Boundary.
 * Ensures the terminal remains diagnostic even if the root layout crashes.
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
        fontFamily: 'sans-serif',
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '400px' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🚨</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.1em' }}>SYSTEM CRITICAL</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
            The terminal kernel has encountered a fatal exception. Global synchronization has been suspended.
          </p>
          <pre style={{
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            fontSize: '10px',
            color: '#ef4444',
            textAlign: 'left',
            overflow: 'auto',
            marginBottom: '32px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error.message || 'Kernel Failure'}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
