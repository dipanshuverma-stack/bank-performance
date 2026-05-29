'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Terminal Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center text-destructive border border-destructive/20">
        <AlertTriangle className="w-10 h-10" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-headline font-black tracking-tight text-foreground">Kernel Panic</h2>
        <p className="text-muted-foreground max-w-md mx-auto font-medium text-sm">
          The terminal has encountered an unhandled exception. 
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-accent/50 border border-border/50 font-mono text-[10px] text-left max-w-xl w-full overflow-auto">
        <div className="text-destructive font-black uppercase mb-1.5 tracking-widest">Diagnostic:</div>
        <div className="opacity-80 leading-relaxed whitespace-pre-wrap">{error.message || 'Unknown system error.'}</div>
      </div>

      <Button
        onClick={() => reset()}
        className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20"
      >
        <RefreshCcw className="w-5 h-5 mr-2" /> Reboot Module
      </Button>
    </div>
  );
}
