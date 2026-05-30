'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useEliteAuth } from '@/firebase';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ClientSideWrappers } from '@/components/layout/ClientSideWrappers';

/**
 * @fileOverview Hardened App Shell for Next.js 15.
 * Prevents hydration mismatches by deferring authenticated layout.
 */

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useEliteAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Defer everything to ensure safe client-side hydration
  useEffect(() => {
    setMounted(true);
    setIsOffline(localStorage.getItem("elite-offline-mode") === "true");
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user && !isOffline && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router, mounted, isOffline]);

  // Initial server and client render must be identical to avoid hydration error
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
      </div>
    );
  }

  if (loading && !isOffline) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin opacity-40" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          Synchronizing Tactical Identity...
        </span>
      </div>
    );
  }

  const hasAccess = user || isOffline || pathname === '/login';
  if (!hasAccess && pathname !== '/login') return null;

  return <>{children}</>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <AuthGuard>
      <div className="main-shell bg-background relative flex min-h-screen w-full">
        {!isLoginPage && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {!isLoginPage && <Header />}
          <main className={`scroll-viewport px-4 md:px-8 lg:px-14 flex-1 ${isLoginPage ? 'p-0' : ''}`}>
            <div className={`${isLoginPage ? '' : 'max-w-[1600px] mx-auto page-transition w-full py-6 pb-32 md:pb-12'}`}>
              {children}
            </div>
          </main>
          {!isLoginPage && <BottomNav />}
        </div>
      </div>
      {!isLoginPage && <ClientSideWrappers />}
    </AuthGuard>
  );
}
