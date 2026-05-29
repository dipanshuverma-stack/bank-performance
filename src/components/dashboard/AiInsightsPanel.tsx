"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Brain, TrendingUp, Target, ShieldAlert, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Insight {
  category: "Tactical" | "Focus" | "Revision" | "Momentum";
  message: string;
  metric?: string;
  icon: any;
  color: string;
}

export function AiInsightsPanel({ className }: { className?: string }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const accuracyLogs = JSON.parse(localStorage.getItem("accuracy-logs") || "[]");
    const profile = JSON.parse(localStorage.getItem("elite-user-profile") || "{}");

    const newInsights: Insight[] = [];

    if (mockLogs.length > 0) {
      setHasData(true);
      const latestAcc = mockLogs[0].accuracy;
      const prevAcc = mockLogs[1]?.accuracy || latestAcc;
      const diff = latestAcc - prevAcc;
      
      newInsights.push({
        category: "Tactical",
        message: diff >= 0 ? `${mockLogs[0].examType} Precision Peak` : "Accuracy Stabilization Needed",
        metric: diff >= 0 ? `+${diff}% GAIN` : `${diff}% DROP`,
        icon: TrendingUp,
        color: diff >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
      });

      const mainsCount = mockLogs.filter((m: any) => m.stage === 'Mains').length;
      newInsights.push({
        category: "Focus",
        message: mainsCount > 0 ? "Mains Rigor Maintained" : "Prelims-Heavy Profile",
        metric: `${mainsCount} MAINS LOG`,
        icon: Target,
        color: "text-blue-500 bg-blue-500/10"
      });
    }

    if (accuracyLogs.length > 0) {
      const recentSession = accuracyLogs[0];
      newInsights.push({
        category: "Momentum",
        message: `${recentSession.topic}`,
        metric: "ACTIVE UNIT",
        icon: Zap,
        color: "text-yellow-500 bg-yellow-500/10"
      });
    }

    if (newInsights.length < 3) {
      newInsights.push({
        category: "Revision",
        message: profile.targetExam ? `${profile.targetExam} Strategy Active` : "Standard Exam Protocol",
        metric: "LIVE MODE",
        icon: ShieldAlert,
        color: "text-indigo-500 bg-indigo-500/10"
      });
    }

    setInsights(newInsights.slice(0, 3));
  }, []);

  return (
    <Card className={cn("bento-card bg-card/40 flex flex-col border-white/5 shadow-2xl h-full backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-xl font-headline font-black tracking-tight text-foreground">
              Deep Strategic <span className="text-primary italic">Intel</span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/80">Analysis Active</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {insights.map((insight, idx) => (
          <div key={idx} className="relative group p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-white/5 hover:border-primary/20 transition-all duration-500">
            <div className="flex items-start gap-4">
              <div className={cn("p-2.5 rounded-xl shrink-0 transition-all duration-500 group-hover:scale-110 shadow-sm", insight.color)}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                    {insight.category}
                  </span>
                  {insight.metric && (
                    <span className="text-[8px] font-mono font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/10">
                      {insight.metric}
                    </span>
                  )}
                </div>
                <p className="text-sm font-extrabold truncate text-foreground/90 tracking-tight">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 group cursor-default">
           <div className="relative">
             <Brain className="w-4 h-4 text-primary group-hover:animate-bounce" />
             <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
           </div>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
             Continuous Strategy Recalibration
           </span>
        </div>
      </CardContent>
    </Card>
  );
}
