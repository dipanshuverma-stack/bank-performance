'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEliteAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';

/**
 * @fileOverview Hardened Authentication Guard.
 * Mandatory checkpoint for all dashboard routes.
 */

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useEliteAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, mounted, pathname, router]);

  if (!mounted || (loading && pathname !== '/login')) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Elite Terminal</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Initializing Neural Link...</span>
        </div>
      </div>
    );
  }

  // Prevent flash of content for protected routes
  if (!user && pathname !== '/login') return null;

  return <>{children}</>;
}
