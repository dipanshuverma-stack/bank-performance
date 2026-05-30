'use client';

import React from 'react';

/**
 * @fileOverview Segment-level error boundary.
 * Atomic Recovery Shell: No external dependencies.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '40px',
      textAlign: 'center',
      backgroundColor: '#020617',
      color: '#f8fafc',
      borderRadius: '24px',
      border: '1px solid #1e293b',
      margin: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚠️</div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px', letterSpacing: '0.1em' }}>MODULE FAULT</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px', maxWidth: '400px', lineHeight: 1.6 }}>
        {error?.message || "A strategic component encountered a runtime exception."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '14px 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '0.1em'
        }}
      >
        Reboot Module
      </button>
    </div>
  );
}
