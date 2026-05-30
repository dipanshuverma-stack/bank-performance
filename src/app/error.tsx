'use client';

import React from 'react';

/**
 * @fileOverview Segment-level error boundary.
 * Corrected: Minimalist shell to ensure Next.js recovery.
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
      padding: '80px 20px',
      textAlign: 'center',
      backgroundColor: 'rgba(2, 6, 23, 0.8)',
      borderRadius: '32px',
      border: '2px dashed rgba(239, 68, 68, 0.2)',
      margin: '40px auto',
      maxWidth: '600px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        marginBottom: '24px'
      }}>
        ⚠️
      </div>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 900,
        marginBottom: '12px',
        color: '#f8fafc',
        letterSpacing: '-0.01em'
      }}>SEGMENT FAULT</h2>
      <p style={{
        color: '#94a3b8',
        fontSize: '14px',
        maxWidth: '350px',
        marginBottom: '32px',
        lineHeight: 1.5
      }}>
        {error?.message || "An isolated module has encountered a runtime exception."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          height: '52px',
          padding: '0 32px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '14px',
          fontWeight: 900,
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer'
        }}
      >
        Reset Module
      </button>
    </div>
  );
}
