"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Brain, TrendingUp, Clock, Target, ShieldAlert } from "lucide-react";
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
      // 1. Accuracy Trend Insight
      const latestAcc = mockLogs[0].accuracy;
      const prevAcc = mockLogs[1]?.accuracy || latestAcc;
      const diff = latestAcc - prevAcc;
      
      newInsights.push({
        category: "Tactical",
        message: diff >= 0 ? `${mockLogs[0].examType} Precision Peak` : "Accuracy Stabilization Needed",
        metric: diff >= 0 ? `+${diff}% Gain` : `${diff}% Drop`,
        icon: TrendingUp,
        color: diff >= 0 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
      });

      // 2. Volume/Focus Insight
      const mainsCount = mockLogs.filter((m: any) => m.stage === 'Mains').length;
      newInsights.push({
        category: "Focus",
        message: mainsCount > 0 ? "Mains Rigor Maintained" : "Prelims-Heavy Profile",
        metric: `${mainsCount} Mains Logged`,
        icon: Target,
        color: "text-blue-500 bg-blue-500/10"
      });
    }

    if (accuracyLogs.length > 0) {
      // 3. Speed Insight
      const recentSession = accuracyLogs[0];
      newInsights.push({
        category: "Momentum",
        message: `High Focus: ${recentSession.topic}`,
        metric: "Active Unit",
        icon: Zap,
        color: "text-yellow-500 bg-yellow-500/10"
      });
    }

    // Default Fallbacks if low data
    if (newInsights.length < 3) {
      newInsights.push({
        category: "Revision",
        message: profile.targetExam ? `${profile.targetExam} Strategy Active` : "Standard Exam Protocol",
        metric: "Active Mode",
        icon: ShieldAlert,
        color: "text-indigo-500 bg-indigo-500/10"
      });
    }

    setInsights(newInsights.slice(0, 3));
  }, []);

  return (
    <Card className={cn("bento-card bg-card/50 flex flex-col border-primary/10 shadow-2xl h-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-headline font-black tracking-tight">Strategic Intel</CardTitle>
          </div>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
            {hasData ? "Live Data" : "Protocol Mode"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-accent/30 to-transparent border border-white/5 hover:border-primary/20 transition-all group">
            <div className={cn("p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300", insight.color)}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{insight.category}</span>
                {insight.metric && (
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                    {insight.metric}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold truncate text-foreground">{insight.message}</p>
            </div>
          </div>
        ))}
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center gap-2">
           <Brain className="w-3.5 h-3.5 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Continuous Strategy Recalibration</span>
        </div>
      </CardContent>
    </Card>
  );
}
