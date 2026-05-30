'use client';

/**
 * @fileOverview Bulletproof Root Error Boundary.
 * Uses zero-dependency inline styles to ensure rendering even during total bundle failure.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ 
        backgroundColor: '#020617', 
        color: '#f8fafc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        margin: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif' 
      }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚨</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.05em' }}>SYSTEM CRITICAL</h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.6' }}>
            The terminal kernel has encountered a fatal exception. Global synchronization has been suspended.
          </p>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '0.75rem', 
            fontSize: '0.75rem', 
            color: '#f87171',
            textAlign: 'left',
            overflow: 'auto',
            maxHeight: '200px',
            fontFamily: 'monospace'
          }}>
            {error.message || 'Kernel Failure'}
          </div>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '2rem',
              padding: '1rem 2.5rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
            }}
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
