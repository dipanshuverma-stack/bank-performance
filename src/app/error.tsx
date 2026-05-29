'use client';

import React, { useEffect } from 'react';

/**
 * @fileOverview Hardened Error Boundary Shell.
 * Designed with zero dependencies to ensure visibility during kernel failure.
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
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#020617',
      color: '#f8fafc',
      padding: '32px',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>OPERATIONAL FAULT</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px', maxWidth: '380px', lineHeight: 1.6 }}>
        A system sub-module has encountered a critical exception. Restarting the protocol may resolve the conflict.
      </p>
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        fontSize: '11px',
        color: '#f87171',
        maxWidth: '100%',
        overflow: 'auto',
        marginBottom: '32px',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        border: '1px solid rgba(248, 113, 113, 0.1)',
        fontFamily: 'monospace'
      }}>
        {error.message || 'Unknown Exception Vector'}
      </div>
      <button
        onClick={() => reset()}
        style={{
          padding: '16px 32px',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 900,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        Reboot Module
      </button>
    </div>
  );
}
