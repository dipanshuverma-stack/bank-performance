"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Flame, Target, Trophy, CheckCircle2, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  goal: number;
  current: number;
  unlocked: boolean;
  color: string;
}

export function AchievementPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const accuracyLogs = JSON.parse(localStorage.getItem("accuracy-logs") || "[]");
    
    // 1. Total Questions Solved
    const totalQuestions = mockLogs.reduce((acc: number, m: any) => acc + (m.correct || 0) + (m.wrong || 0), 0);
    
    // 2. Highest Accuracy
    const maxAccuracy = mockLogs.length > 0 ? Math.max(...mockLogs.map((m: any) => m.accuracy)) : 0;
    
    // 3. Mock Count
    const mockCount = mockLogs.length;

    // 4. Streak (Simplified logic based on logs)
    const dates = new Set([...mockLogs, ...accuracyLogs].map((l: any) => l.date));
    const streak = dates.size; // This is a simple activity count for demo purposes

    const milestones: Achievement[] = [
      {
        id: "streak_7",
        title: "7-Day Momentum",
        description: "Maintain a study streak for 7 consecutive days",
        icon: Flame,
        goal: 7,
        current: streak,
        unlocked: streak >= 7,
        color: "text-orange-500",
      },
      {
        id: "questions_1000",
        title: "Problem Solver",
        description: "Solve over 1,000 questions in total",
        icon: Target,
        goal: 1000,
        current: totalQuestions,
        unlocked: totalQuestions >= 1000,
        color: "text-blue-500",
      },
      {
        id: "accuracy_95",
        title: "Precision Pillar",
        description: "Achieve 95% accuracy in a single mock test",
        icon: Medal,
        goal: 95,
        current: maxAccuracy,
        unlocked: maxAccuracy >= 95,
        color: "text-emerald-500",
      },
      {
        id: "mocks_50",
        title: "Mock Veteran",
        description: "Complete 50 standardized mock examinations",
        icon: Trophy,
        goal: 50,
        current: mockCount,
        unlocked: mockCount >= 50,
        color: "text-yellow-500",
      },
    ];

    setAchievements(milestones);
  }, []);

  return (
    <Card className="bento-card border-none bg-slate-950/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-headline font-bold text-white tracking-tight">Elite Achievements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className={cn(
                "relative p-4 rounded-2xl border transition-all duration-500 overflow-hidden",
                ach.unlocked 
                  ? "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                  : "bg-white/5 border-white/5 opacity-60 grayscale"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl bg-background border border-white/10", ach.color)}>
                    <ach.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{ach.description}</p>
                  </div>
                </div>
                {ach.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Progress</span>
                  <span className={ach.unlocked ? "text-primary" : "text-slate-400"}>
                    {ach.current} / {ach.goal}
                  </span>
                </div>
                <Progress 
                  value={(ach.current / ach.goal) * 100} 
                  className="h-1.5 bg-white/5" 
                />
              </div>
              
              {ach.unlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-3xl" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
