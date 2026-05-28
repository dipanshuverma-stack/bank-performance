"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UPCOMING_EXAMS } from "@/lib/mock-data";
import { Timer, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export function CountdownCard() {
  const [examCountdowns, setExamCountdowns] = useState<any[]>([]);

  useEffect(() => {
    const calculateDays = () => {
      const updated = UPCOMING_EXAMS.map(exam => {
        const diff = new Date(exam.date).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return { ...exam, days };
      });
      setExamCountdowns(updated);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bento-card bg-slate-900 dark:bg-primary/20 border-none shadow-xl shadow-slate-200 dark:shadow-primary/5 group transition-all duration-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 dark:bg-primary p-2 rounded-xl text-primary dark:text-primary-foreground transition-colors">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="font-headline text-lg font-bold tracking-tight text-white dark:text-foreground">Exam Countdown</h3>
          </div>
          <CalendarDays className="w-4 h-4 text-slate-400 dark:text-primary opacity-70" />
        </div>
        
        <div className="space-y-6">
          {examCountdowns.length > 0 ? (
            examCountdowns.map((exam, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 dark:border-primary/20 pb-4 last:border-0 last:pb-0 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-primary/10 flex items-center justify-center text-xl group-hover/item:scale-110 transition-transform">
                    {exam.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white dark:text-foreground">{exam.name}</span>
                    <span className="text-[10px] text-slate-300 dark:text-muted-foreground uppercase tracking-widest font-bold">Adda247 Series</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-headline font-bold tracking-tighter leading-none text-white dark:text-primary">
                    {exam.days > 0 ? `${exam.days}d` : 'Today'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase tracking-widest font-black mt-1">
                    {exam.days > 0 ? 'Remaining' : 'Exam Day'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-white/60 dark:text-muted-foreground text-sm font-bold animate-pulse">
              Syncing exam dates...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}