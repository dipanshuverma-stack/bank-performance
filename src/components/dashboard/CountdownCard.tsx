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
  }, []);

  return (
    <Card className="bento-card bg-primary text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="w-5 h-5" />
          <h3 className="font-headline text-lg font-semibold">Exam Countdown</h3>
        </div>
        <div className="space-y-4">
          {examCountdowns.length > 0 ? (
            examCountdowns.map((exam, i) => (
              <div key={i} className="flex items-center justify-between border-b border-primary-foreground/20 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span>{exam.icon}</span>
                  <span className="text-sm font-medium">{exam.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold">{exam.days}d</span>
                  <span className="text-[10px] opacity-80 uppercase tracking-widest">Remaining</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center opacity-60 text-sm">
              Calculating dates...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
