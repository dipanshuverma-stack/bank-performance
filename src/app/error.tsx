'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * @fileOverview Resilience module for standard runtime errors within the terminal UI.
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log tactical failure for diagnostics
    console.error('Terminal Runtime Exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
        <AlertTriangle className="w-10 h-10" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-headline font-black tracking-tight text-foreground">Operational Fault</h2>
        <p className="text-muted-foreground max-w-md mx-auto font-medium text-sm">
          A module in the terminal has failed to execute. System integrity is being maintained.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-accent/50 border border-border/50 font-mono text-[10px] text-left max-w-xl w-full overflow-auto shadow-sm">
        <div className="text-destructive font-black uppercase mb-1.5 tracking-widest">Diagnostic Output:</div>
        <div className="opacity-80 leading-relaxed whitespace-pre-wrap">{error.message || 'No detailed trace available.'}</div>
      </div>

      <Button
        onClick={() => reset()}
        className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
      >
        <RefreshCcw className="w-5 h-5 mr-2" /> Recover Module
      </Button>
    </div>
  );
}
