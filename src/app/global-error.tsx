'use client';

import React from 'react';

/**
 * @fileOverview Root Error Boundary for Next.js 15.
 * Replaces the entire layout during a fatal crash.
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
      <head>
        <title>Kernel Panic</title>
      </head>
      <body style={{
        backgroundColor: '#020617',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}>
        <div style={{ padding: '40px', maxWidth: '500px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚨</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', color: '#f87171' }}>
            TERMINAL CRITICAL
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>
            The application kernel encountered a fatal error.
          </p>
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#f87171',
            fontFamily: 'monospace',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            {error?.message || 'Unknown Execution Fault'}
          </div>
          <button
            onClick={() => reset()}
            style={{
              padding: '16px 32px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reboot Terminal
          </button>
        </div>
      </body>
    </html>
  );
}
