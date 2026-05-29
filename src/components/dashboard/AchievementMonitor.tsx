'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeAchievements } from '@/ai/flows/analyze-achievements-flow';
import { Trophy, Sparkles, Medal, Zap, Flame, Moon, Sun, Target, AlertTriangle, Calendar, Activity } from 'lucide-react';
import React from 'react';

const ICON_MAP: Record<string, any> = {
  Trophy, Sparkles, Medal, Zap, Flame, Moon, Sun, Target, AlertTriangle, Calendar, Activity
};

export function AchievementMonitor() {
  const { toast } = useToast();
  const checking = useRef(false);

  const addNotification = (title: string, description: string, type: 'achievement' | 'alert' | 'reminder') => {
    const saved = localStorage.getItem("elite-notifications") || "[]";
    const notifications = JSON.parse(saved);
    
    // Check if notification already exists to avoid spam
    const exists = notifications.some((n: any) => n.title === title && n.date === new Date().toLocaleDateString());
    if (exists) return;

    const newNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      date: new Date().toLocaleDateString(),
      type,
      read: false
    };
    localStorage.setItem("elite-notifications", JSON.stringify([newNotification, ...notifications]));
    window.dispatchEvent(new Event('elite-new-notification'));
  };

  useEffect(() => {
    const runDiagnostics = async () => {
      if (checking.current) return;
      checking.current = true;

      try {
        const mockLogs = JSON.parse(localStorage.getItem('elite-mock-logs') || '[]');
        const studySessions = JSON.parse(localStorage.getItem('accuracy-logs') || '[]');
        const existing = JSON.parse(localStorage.getItem('elite-unlocked-achievements') || '[]');
        const profile = JSON.parse(localStorage.getItem('elite-user-profile') || '{}');

        // 1. Logic-Based Notifications (System Alerts)
        
        // Target Exam Proximity
        if (profile.targetDate) {
          const diff = new Date(profile.targetDate).getTime() - Date.now();
          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
          if (days > 0 && days <= 7) {
            addNotification(
              "Objective Proximity Alert",
              `Your target exam is just ${days} days away. Initiate Final Revision Protocol.`,
              'alert'
            );
          }
        }

        // Performance Deviation
        if (mockLogs.length >= 3) {
          const recentAcc = mockLogs.slice(0, 3).reduce((acc: number, m: any) => acc + m.accuracy, 0) / 3;
          if (recentAcc < 70) {
            addNotification(
              "Performance Deviation Detected",
              "Recent accuracy has dropped below 70%. Recommended: Review Mistake Journal.",
              'alert'
            );
          }
        }

        // Inactivity Check
        const allLogs = [...mockLogs, ...studySessions];
        if (allLogs.length > 0) {
          const lastLog = new Date(allLogs[0].date).getTime();
          const inactiveHours = (Date.now() - lastLog) / (1000 * 60 * 60);
          if (inactiveHours > 48) {
             addNotification(
               "Operational Continuity Alert",
               "No activity recorded for 48 hours. Maintain streak to prevent skill decay.",
               'reminder'
             );
          }
        }

        // 2. AI-Driven Achievements
        const result = await analyzeAchievements({
          mockLogs,
          studySessions,
          existingAchievements: existing,
        });

        if (result.newlyUnlocked && result.newlyUnlocked.length > 0) {
          const updatedAchievements = [...existing];
          
          result.newlyUnlocked.forEach((ach) => {
            if (!existing.includes(ach.id)) {
              updatedAchievements.push(ach.id);
              const Icon = ICON_MAP[ach.icon] || Trophy;

              toast({
                title: "Achievement Unlocked!",
                description: (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{ach.title}</div>
                      <div className="text-xs text-muted-foreground">{ach.description}</div>
                    </div>
                  </div>
                ),
              });

              addNotification(`Elite Milestone: ${ach.title}`, ach.description, 'achievement');
            }
          });

          localStorage.setItem('elite-unlocked-achievements', JSON.stringify(updatedAchievements));
        }
      } catch (error) {
        console.warn("Diagnostics Engine Error:", error);
      } finally {
        checking.current = false;
      }
    };

    runDiagnostics();
    const interval = setInterval(runDiagnostics, 1000 * 60 * 5); // Run every 5 mins
    return () => clearInterval(interval);
  }, [toast]);

  return null;
}
