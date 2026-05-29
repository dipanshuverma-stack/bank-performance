'use client';

import React, { useEffect } from 'react';

/**
 * @fileOverview Hardened resilience module for standard runtime errors.
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Only log error in development or as a tactical audit
    console.error('Terminal Runtime Exception:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#020617',
      color: '#f8fafc',
      padding: '24px',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Operational Fault</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', maxWidth: '320px' }}>
        A system sub-module has encountered an exception. Restarting the module may resolve the conflict.
      </p>
      <pre style={{
        padding: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        fontSize: '10px',
        color: '#ef4444',
        maxWidth: '100%',
        overflow: 'auto',
        marginBottom: '24px',
        textAlign: 'left',
        whiteSpace: 'pre-wrap'
      }}>
        {error.message || 'Unknown Exception'}
      </pre>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 900,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}
      >
        Reboot Module
      </button>
    </div>
  );
}
