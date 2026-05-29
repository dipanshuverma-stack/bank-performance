'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

/**
 * @fileOverview Hardened client-side wrapper to isolate background tactical systems.
 * Prevents SSR violations in Next.js 15 Server Components.
 */

const QuickActions = dynamic(() => import('@/components/dashboard/QuickActions').then(mod => mod.QuickActions), { ssr: false });
const AchievementMonitor = dynamic(() => import('@/components/dashboard/AchievementMonitor').then(mod => mod.AchievementMonitor), { ssr: false });
const InteractionTracker = dynamic(() => import('@/components/layout/InteractionTracker').then(mod => mod.InteractionTracker), { ssr: false });

export function ClientSideWrappers() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <QuickActions />
      <AchievementMonitor />
      <InteractionTracker />
    </>
  );
}
