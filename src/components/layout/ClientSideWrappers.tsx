'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const QuickActions = dynamic(() => import('@/components/dashboard/QuickActions').then(mod => mod.QuickActions), { ssr: false });
const AchievementMonitor = dynamic(() => import('@/components/dashboard/AchievementMonitor').then(mod => mod.AchievementMonitor), { ssr: false });
const InteractionTracker = dynamic(() => import('@/components/layout/InteractionTracker').then(mod => mod.InteractionTracker), { ssr: false });

export function ClientSideWrappers() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
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
