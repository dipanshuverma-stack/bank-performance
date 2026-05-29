
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ReadinessScore({ className }: { className?: string }) {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Analyzing");

  useEffect(() => {
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const syllabus = JSON.parse(localStorage.getItem("elite-syllabus-v2") || "[]");
    
    // Simple readiness formula
    // 40% Accuracy + 40% Syllabus Mastery + 20% Mock Consistency
    
    let totalAcc = mockLogs.length > 0 ? mockLogs.reduce((acc: number, m: any) => acc + m.accuracy, 0) / mockLogs.length : 0;
    
    let totalSub = 0;
    let doneSub = 0;
    syllabus.forEach((s: any) => s.chapters.forEach((c: any) => c.subtopics.forEach((st: any) => {
      totalSub++;
      if (st.completed) doneSub++;
    })));
    let mastery = totalSub > 0 ? (doneSub / totalSub) * 100 : 0;
    
    let consistency = Math.min(mockLogs.length * 5, 20); // Max 20% from count

    const finalScore = Math.round((totalAcc * 0.4) + (mastery * 0.4) + consistency);
    setScore(finalScore);

    if (finalScore < 40) setStatus("Beginner");
    else if (finalScore < 70) setStatus("Improving");
    else if (finalScore < 85) setStatus("Competitive");
    else setStatus("Exam Ready");
  }, []);

  return (
    <Card className={cn("bento-card border-none bg-primary/5 border border-primary/10 overflow-hidden group flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck className="w-5 h-5" /></div>
            <CardTitle className="text-lg font-bold">Readiness Score</CardTitle>
          </div>
          <div className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
            score > 70 ? "bg-success/20 text-success" : "bg-orange-500/20 text-orange-500"
          )}>
            {status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center py-4 flex-1">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary/10" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.42} strokeDashoffset={364.42 - (364.42 * score) / 100} className="text-primary transition-all duration-1000" />
            </svg>
            <div className="absolute text-4xl font-black tracking-tighter">{score}%</div>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-6 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            Operational Capacity vs Target
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 border-t border-primary/10 pt-6">
           <div>
              <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Precision</div>
              <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${score}%` }} />
              </div>
           </div>
           <div>
              <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Endurance</div>
              <div className="h-1 bg-indigo-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${score}%` }} />
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
