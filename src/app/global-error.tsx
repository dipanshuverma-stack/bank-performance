'use client';

import React from 'react';

/**
 * @fileOverview Root Error Boundary.
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
        <title>Terminal Critical</title>
      </head>
      <body style={{
        backgroundColor: '#020617',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center'
      }}>
        <div style={{ padding: '40px', maxWidth: '500px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚨</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', color: '#f87171', letterSpacing: '-0.02em' }}>
            TERMINAL CRITICAL
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6, fontSize: '15px' }}>
            The application kernel encountered a fatal execution fault.
          </p>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            fontSize: '12px',
            color: '#f87171',
            fontFamily: 'monospace',
            marginBottom: '40px',
            textAlign: 'left',
            overflowX: 'auto'
          }}>
            {error?.message || 'Unknown Tactical Error'}
          </div>
          <button
            onClick={() => reset()}
            style={{
              padding: '16px 40px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.1em'
            }}
          >
            Reboot Terminal
          </button>
        </div>
      </body>
    </html>
  );
}
