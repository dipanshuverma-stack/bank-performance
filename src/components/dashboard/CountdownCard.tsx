"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UPCOMING_EXAMS } from "@/lib/mock-data";
import { Timer } from "lucide-react";
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
    // Update every hour to keep it fresh
    const interval = setInterval(calculateDays, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bento-card bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Timer className="w-5 h-5" />
          </div>
          <h3 className="font-headline text-lg font-bold tracking-tight">Exam Countdown</h3>
        </div>
        <div className="space-y-5">
          {examCountdowns.length > 0 ? (
            examCountdowns.map((exam, i) => (
              <div key={i} className="flex items-center justify-between border-b border-primary-foreground/10 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl grayscale-[0.2]">{exam.icon}</span>
                  <span className="text-sm font-semibold opacity-90">{exam.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-headline font-bold tracking-tighter leading-none">
                    {exam.days > 0 ? `${exam.days}d` : 'Today'}
                  </span>
                  <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold mt-1">
                    {exam.days > 0 ? 'Remaining' : 'Exam Day'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center opacity-60 text-sm font-medium">
              Calculating precision dates...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
