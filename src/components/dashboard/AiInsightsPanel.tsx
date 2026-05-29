
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap, Brain, TrendingUp, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Insight {
  category: "Productivity" | "Strategy" | "Revision" | "Speed";
  message: string;
  icon: any;
  color: string;
}

export function AiInsightsPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Simulated deep behavior analysis based on local logs
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const accuracyLogs = JSON.parse(localStorage.getItem("accuracy-logs") || "[]");
    
    const newInsights: Insight[] = [
      {
        category: "Strategy",
        message: "Attempting Reasoning first has historically increased your score by 12%.",
        icon: TrendingUp,
        color: "text-emerald-500 bg-emerald-500/10"
      },
      {
        category: "Productivity",
        message: "Your focus intensity peaks between 8 AM - 11 AM. Schedule hard Quants then.",
        icon: Clock,
        color: "text-blue-500 bg-blue-500/10"
      },
      {
        category: "Revision",
        message: "Arithmetic revision for Profit & Loss is overdue by 3 days based on mock trends.",
        icon: Brain,
        color: "text-purple-500 bg-purple-500/10"
      },
      {
        category: "Speed",
        message: "DI solving speed in Caselets improved 14% this week. Maintain current momentum.",
        icon: Zap,
        color: "text-yellow-500 bg-yellow-500/10"
      }
    ];

    setInsights(newInsights);
  }, []);

  return (
    <Card className="bento-card bg-card/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-headline font-bold">Deep Strategic Insights</CardTitle>
          </div>
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-primary border-primary/20">AI Analytics active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-accent/20 border border-border/40 group hover:border-primary/20 transition-all">
            <div className={`p-2 rounded-xl shrink-0 ${insight.color}`}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{insight.category}</div>
              <p className="text-sm font-bold leading-relaxed text-foreground">{insight.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
