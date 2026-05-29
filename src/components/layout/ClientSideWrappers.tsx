'use client';

import dynamic from 'next/dynamic';

/**
 * @fileOverview A wrapper for client-only tactical systems.
 * Handles the loading of components that require 'window' or 'localStorage'
 * without interrupting the Server Component hierarchy of the root layout.
 */

const QuickActions = dynamic(() => import('@/components/dashboard/QuickActions').then(mod => mod.QuickActions), { ssr: false });
const AchievementMonitor = dynamic(() => import('@/components/dashboard/AchievementMonitor').then(mod => mod.AchievementMonitor), { ssr: false });
const InteractionTracker = dynamic(() => import('@/components/layout/InteractionTracker').then(mod => mod.InteractionTracker), { ssr: false });

export function ClientSideWrappers() {
  return (
    <>
      <QuickActions />
      <AchievementMonitor />
      <InteractionTracker />
    </>
  );
}
