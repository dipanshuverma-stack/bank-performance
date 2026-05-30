'use client';

import React from 'react';

/**
 * @fileOverview Segment-level error boundary for Next.js 15.
 * Atomic Recovery Shell: Uses minimalist styling to ensure recovery.
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
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#020617',
      color: '#f8fafc',
      borderRadius: '24px',
      border: '1px solid #1e293b',
      margin: '20px auto',
      maxWidth: '500px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
      <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>MODULE FAULT</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px', lineHeight: 1.5 }}>
        {error?.message || "An isolated component encountered a runtime exception."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Reload Module
      </button>
    </div>
  );
}
