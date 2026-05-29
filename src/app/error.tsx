'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

/**
 * @fileOverview Root error boundary for the Elite Performance Terminal.
 * Provides tactical feedback and recovery options for runtime exceptions.
 */

export default function TerminalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the tactical console for diagnostic reporting
    console.error('Terminal Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center text-destructive animate-pulse shadow-inner border border-destructive/20">
        <AlertTriangle className="w-10 h-10" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-headline font-black tracking-tight text-foreground">Kernel Panic Detected</h2>
        <p className="text-muted-foreground max-w-md mx-auto font-medium text-sm md:text-base leading-relaxed">
          The terminal has encountered an unhandled exception. 
          Operational state has been paused to prevent Hybrid Vault corruption.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-accent/50 border border-border/50 font-mono text-[10px] text-left max-w-xl w-full overflow-auto shadow-inner">
        <div className="text-destructive font-black uppercase mb-1.5 tracking-widest">Diagnostic Output:</div>
        <div className="opacity-80 leading-relaxed whitespace-pre-wrap">{error.message || 'Unknown system error encountered.'}</div>
        {error.digest && <div className="mt-3 opacity-40 border-t border-border/20 pt-2 font-black">DIGEST: {error.digest}</div>}
      </div>

      <Button
        onClick={() => reset()}
        className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
      >
        <RefreshCcw className="w-5 h-5 mr-3" /> Reboot Module
      </Button>
    </div>
  );
}
