'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { logAuditAction } from '@/lib/audit-logger';

/**
 * @fileOverview Global interaction tracker that captures tactical touch and scroll events.
 * Implements throttling to maintain log clarity and system performance.
 */

export function InteractionTracker() {
  const pathname = usePathname();
  const lastScrollTime = useRef(0);
  const lastTouchTime = useRef(0);

  useEffect(() => {
    // Throttle scroll logging to once every 30 seconds to avoid audit log fatigue
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current > 30000) {
        logAuditAction("System", "Tactical Browsing", `Active scroll protocol detected on ${pathname}`);
        lastScrollTime.current = now;
      }
    };

    // Throttle touch logging to once every 15 seconds
    const handleTouch = () => {
      const now = Date.now();
      if (now - lastTouchTime.current > 15000) {
        logAuditAction("System", "Screen Interaction", `Touch interaction recorded on ${pathname}`);
        lastTouchTime.current = now;
      }
    };

    // Use passive listeners for zero-latency scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [pathname]);

  return null;
}
