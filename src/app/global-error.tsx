'use client';

/**
 * @fileOverview Global fatal error boundary. 
 * Handles errors at the root layout level, providing a clean system reset.
 * This component MUST define its own html and body tags.
 */

export default function GlobalSystemError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        fontFamily: 'sans-serif', 
        backgroundColor: '#020617', 
        color: '#f8fafc',
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1.5rem',
            opacity: 0.5
          }}>⚠️</div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 900, 
            letterSpacing: '-0.05em',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>System Failure</h1>
          <p style={{ 
            fontSize: '0.875rem', 
            opacity: 0.7, 
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            The terminal kernel has encountered a fatal error.
            <br />
            <span style={{ fontSize: '0.7rem', fontStyle: 'italic', opacity: 0.5 }}>
              {error.message || 'Error Digest: ' + error.digest}
            </span>
          </p>
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              height: '4rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.3)'
            }}
          >
            Reset System Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
