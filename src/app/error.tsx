'use client';

import { useEffect } from 'react';

/**
 * @fileOverview Hardened Segment Error Boundary.
 * Ensures the app shell survives module-level crashes without dependency on global styles.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Terminal Operational Fault:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '24px',
      border: '2px dashed rgba(239, 68, 68, 0.2)',
      margin: '40px auto',
      maxWidth: '600px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        marginBottom: '24px'
      }}>
        ⚠️
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px', color: '#f8fafc' }}>OPERATIONAL FAULT</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '320px', marginBottom: '32px' }}>
        A system sub-module has encountered a critical exception. Restarting the protocol may resolve the conflict.
      </p>
      <button
        onClick={() => reset()}
        style={{
          height: '48px',
          padding: '0 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '900',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer'
        }}
      >
        Reboot Module
      </button>
    </div>
  );
}
