'use client';

import { useEffect } from 'react';

/**
 * @fileOverview Standard Error Boundary for page segments.
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-card rounded-[2.5rem] border-2 border-dashed border-destructive/20 m-4">
      <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center text-destructive mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-black tracking-tight text-foreground mb-2 uppercase">Operational Fault</h2>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        A system sub-module has encountered a critical exception. Restarting the protocol may resolve the conflict.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="h-12 px-8 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 transition-transform active:scale-95"
        >
          Reboot Module
        </button>
        <button
          onClick={() => window.location.reload()}
          className="h-12 px-8 bg-accent text-accent-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest transition-transform active:scale-95"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
