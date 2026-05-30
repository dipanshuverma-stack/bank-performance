'use client';

import { useEffect } from 'react';

/**
 * @fileOverview Segment Error Boundary.
 * Ensures the app shell survives module-level crashes.
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
      padding: '4rem 2rem',
      textAlign: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '2.5rem',
      border: '2px dashed rgba(239, 68, 68, 0.2)',
      margin: '2rem auto',
      maxWidth: '600px'
    }}>
      <div style={{
        width: '4rem',
        height: '4rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        marginBottom: '1.5rem'
      }}>
        ⚠️
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', color: '#f8fafc' }}>OPERATIONAL FAULT</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '320px', marginBottom: '2rem' }}>
        A system sub-module has encountered a critical exception. Restarting the protocol may resolve the conflict.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => reset()}
          style={{
            height: '3rem',
            padding: '0 2rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '1rem',
            fontWeight: '900',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer'
          }}
        >
          Reboot Module
        </button>
      </div>
    </div>
  );
}
