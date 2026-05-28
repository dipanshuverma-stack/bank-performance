'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeAchievements } from '@/ai/flows/analyze-achievements-flow';
import { Trophy, Sparkles, Medal, Zap, Flame, Moon, Sun, Target } from 'lucide-react';
import React from 'react';

const ICON_MAP: Record<string, any> = {
  Trophy, Sparkles, Medal, Zap, Flame, Moon, Sun, Target
};

export function AchievementMonitor() {
  const { toast } = useToast();
  const checking = useRef(false);

  useEffect(() => {
    const checkAchievements = async () => {
      if (checking.current) return;
      checking.current = true;

      try {
        const mockLogs = JSON.parse(localStorage.getItem('elite-mock-logs') || '[]');
        const studySessions = JSON.parse(localStorage.getItem('accuracy-logs') || '[]');
        const existing = JSON.parse(localStorage.getItem('elite-unlocked-achievements') || '[]');

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
                variant: "default",
              });
            }
          });

          localStorage.setItem('elite-unlocked-achievements', JSON.stringify(updatedAchievements));
        }
      } catch (error) {
        console.error("Achievement Monitor Error:", error);
      } finally {
        checking.current = false;
      }
    };

    // Check on mount and then every 5 minutes
    checkAchievements();
    const interval = setInterval(checkAchievements, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [toast]);

  return null;
}
