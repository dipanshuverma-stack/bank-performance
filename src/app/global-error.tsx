'use client';

/**
 * @fileOverview Minimalist Root Error Boundary for Next.js 15.
 * Hardened with zero-dependency inline styles to ensure rendering 
 * even during total system failure.
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
        <title>Kernel Protocol Fault</title>
      </head>
      <body style="background-color: #020617; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: system-ui, sans-serif; text-align: center;">
        <div style="padding: 40px; max-width: 500px;">
          <div style="font-size: 64px; margin-bottom: 24px;">🚨</div>
          <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 16px; color: #f87171; letter-spacing: -0.02em;">
            KERNEL CRITICAL
          </h1>
          <p style="color: #94a3b8; margin-bottom: 32px; line-height: 1.6; font-size: 14px;">
            The terminal kernel encountered a fatal exception during initialization. This is usually due to invalid environment variables or hydration conflicts.
          </p>
          <div style="padding: 16px; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; font-size: 11px; color: #f87171; text-align: left; overflow: auto; max-height: 150px; font-family: monospace; margin-bottom: 32px;">
            {error?.message || 'Unknown Protocol Error'}
          </div>
          <button
            onClick={() => reset()}
            style="padding: 16px 32px; background-color: #4f46e5; color: white; border: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; font-size: 12px;"
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
