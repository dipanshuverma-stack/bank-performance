
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReadinessScore({ className }: { className?: string }) {
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Analyzing");
  const [activeStage, setActiveStage] = useState<"Prelims" | "Mains">("Prelims");

  useEffect(() => {
    const calculateReadiness = () => {
      const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
      const syllabus = JSON.parse(localStorage.getItem("elite-syllabus-v2") || "[]");
      const savedStage = localStorage.getItem("elite-active-stage") as "Prelims" | "Mains" || "Prelims";
      
      setActiveStage(savedStage);

      // Filter logs by active stage for accuracy component
      const stageLogs = mockLogs.filter((m: any) => m.stage === savedStage);
      let totalAcc = stageLogs.length > 0 ? stageLogs.reduce((acc: number, m: any) => acc + m.accuracy, 0) / stageLogs.length : 0;
      
      let totalSub = 0;
      let doneSub = 0;
      syllabus.forEach((s: any) => s.chapters.forEach((c: any) => c.subtopics.forEach((st: any) => {
        totalSub++;
        if (st.completed) doneSub++;
      })));
      let mastery = totalSub > 0 ? (doneSub / totalSub) * 100 : 0;
      
      let consistency = Math.min(stageLogs.length * 5, 20);

      const finalScore = Math.round((totalAcc * 0.4) + (mastery * 0.4) + consistency);
      setScore(finalScore);

      if (finalScore < 40) setStatus("Beginner");
      else if (finalScore < 70) setStatus("Improving");
      else if (finalScore < 85) setStatus("Competitive");
      else setStatus("Exam Ready");
    };

    calculateReadiness();
    window.addEventListener('storage', calculateReadiness);
    window.addEventListener('elite-stage-changed', calculateReadiness);
    return () => {
      window.removeEventListener('storage', calculateReadiness);
      window.removeEventListener('elite-stage-changed', calculateReadiness);
    };
  }, []);

  return (
    <Card className={cn("bento-card border-none bg-primary/5 border border-primary/20 overflow-hidden group flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-xl text-primary shadow-sm"><ShieldCheck className="w-5 h-5" /></div>
            <CardTitle className="text-lg font-headline font-bold">Readiness Score</CardTitle>
          </div>
          <div className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm",
            score > 70 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
          )}>
            {activeStage}: {status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        <div className="flex flex-col items-center justify-center py-6 flex-1">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse-ring" />
            
            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
              <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary/10" />
              <circle 
                cx="72" 
                cy="72" 
                r="64" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={402.12} 
                strokeDashoffset={402.12 - (402.12 * score) / 100} 
                className="text-primary transition-all duration-1000 stroke-[10px]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <div className="text-5xl font-headline font-black tracking-tighter text-foreground leading-none">{score}%</div>
              <div className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1">Operational</div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-accent/30 px-4 py-1.5 rounded-full border border-border/50">
            <Zap className="w-3.5 h-3.5 text-success animate-pulse" />
            {activeStage} Protocol Active
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-4 border-t border-primary/10 pt-6">
           <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <span>Precision</span>
                <span className="text-primary">{score}%</span>
              </div>
              <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${score}%` }} />
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <span>Endurance</span>
                <span className="text-indigo-500">{score}%</span>
              </div>
              <div className="h-1.5 bg-indigo-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${score}%` }} />
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
