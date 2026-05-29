'use client';

import React from 'react';

/**
 * @fileOverview Failsafe kernel-level error boundary.
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
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚨</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px' }}>SYSTEM CRITICAL</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
            The terminal kernel has encountered a fatal exception.
          </p>
          <pre style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            fontSize: '10px',
            color: '#ef4444',
            textAlign: 'left',
            overflow: 'auto',
            marginBottom: '32px'
          }}>
            {error.message || 'Kernel Failure'}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
