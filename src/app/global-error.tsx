'use client';

/**
 * @fileOverview Bulletproof Root Error Boundary for Next.js 15.
 * Hardened with zero-dependency inline styles to ensure rendering 
 * even during total resource failure or hydration mismatches.
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
        <title>Terminal Critical Failure</title>
      </head>
      <body style={{ 
        backgroundColor: '#020617', 
        color: '#f8fafc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        margin: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center'
      }}>
        <div style={{ padding: '20px', maxWidth: '500px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚨</div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.05em', color: '#f87171' }}>
            KERNEL CRITICAL
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6', fontSize: '14px' }}>
            The terminal kernel has encountered a fatal exception. Global synchronization has been suspended to protect the data vault.
          </p>
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '8px', 
            fontSize: '11px', 
            color: '#f87171',
            textAlign: 'left',
            overflow: 'auto',
            maxHeight: '150px',
            fontFamily: 'monospace',
            marginBottom: '32px'
          }}>
            {error?.message || 'Unknown Kernel Failure'}
          </div>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 32px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
