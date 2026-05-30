"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Target, TrendingUp, BarChart3, Layers, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { logAuditAction } from "@/lib/audit-logger";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

const EMPTY_CHART_DATA = Array.from({ length: 8 }, (_, i) => ({
  name: `P${i + 1}`,
  accuracy: 0,
  score: 0,
  tests: 0
}));

export function PerformanceOverview() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"Prelims" | "Mains">("Prelims");
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
    const savedStage = localStorage.getItem("elite-active-stage") as "Prelims" | "Mains";
    if (savedStage) setStage(savedStage);
  }, []);

  const mocksQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, 'users', user.uid, 'mocks'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);

  const { data: cloudMocks } = useCollection(mocksQuery);

  const activeData = useMemo(() => {
    if (!mounted) return [];
    const local = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    return (user && db) ? (cloudMocks || []) : local;
  }, [mounted, cloudMocks, user, db]);

  const stats = useMemo(() => {
    const stageFiltered = activeData.filter((m: any) => m.stage === stage);
    if (stageFiltered.length === 0) return { avgScore: 0, avgAccuracy: 0, testsTaken: 0 };

    const sumScore = stageFiltered.reduce((acc: number, m: any) => acc + (m.score || 0), 0);
    const sumAcc = stageFiltered.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0);
    
    return {
      avgScore: parseFloat((sumScore / stageFiltered.length).toFixed(1)),
      avgAccuracy: parseFloat((sumAcc / stageFiltered.length).toFixed(1)),
      testsTaken: stageFiltered.length,
    };
  }, [activeData, stage]);

  const chartData = useMemo(() => {
    const stageFiltered = activeData.filter((m: any) => m.stage === stage);
    if (stageFiltered.length === 0) return EMPTY_CHART_DATA;

    return stageFiltered.slice(0, 10).reverse().map((m: any) => ({
      name: m.date.split('/')[0] + '/' + (m.date.split('/')[1] || ''),
      accuracy: m.accuracy,
      score: m.score,
      tests: 1
    }));
  }, [activeData, stage]);

  const handleStageChange = (val: "Prelims" | "Mains") => {
    setStage(val);
    localStorage.setItem("elite-active-stage", val);
    logAuditAction("Strategic", "Stage Toggle", `Phase switched to ${val}`);
  };

  if (!mounted) return null;

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/60 backdrop-blur-3xl shadow-2xl min-w-0">
      <CardHeader className="flex flex-col bg-accent/5 p-6 lg:p-8 gap-6 border-b border-white/5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl lg:text-2xl font-headline font-black tracking-tight">Analytics</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] ml-12">
              <Layers className="w-3 h-3" />
              {stage} Protocol {user && "(Cloud Active)"}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <Tabs value={stage} onValueChange={(val: any) => handleStageChange(val)} className="w-full sm:w-[220px]">
              <TabsList className="grid grid-cols-2 w-full h-10 bg-primary/10 rounded-xl p-1 border border-primary/20">
                <TabsTrigger value="Prelims" className="text-[9px] font-black uppercase tracking-widest rounded-lg transition-all">Prelims</TabsTrigger>
                <TabsTrigger value="Mains" className="text-[9px] font-black uppercase tracking-widest rounded-lg transition-all">Mains</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {[
            { label: "Mock Accuracy", value: `${stats.avgAccuracy}%`, color: "text-foreground", icon: TrendingUp },
            { label: "Mission Volume", value: stats.testsTaken, color: "text-indigo-500", icon: BarChart3 },
            { label: "Peak Score", value: stats.avgScore, color: "text-primary", icon: Target },
            { label: "Sync Status", value: user ? "ONLINE" : "OFFLINE", color: user ? "text-emerald-500" : "text-orange-500", icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-border/60 group hover:border-primary/30 transition-all duration-500 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.label}</span>
                <stat.icon className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
              </div>
              <span className={cn("text-xl lg:text-2xl font-headline font-black tabular-nums tracking-tighter", stat.color)}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-slate-50/40 dark:bg-white/[0.01] rounded-[2.5rem] p-6 lg:p-10 border border-border/40 relative overflow-hidden shadow-inner h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--muted))" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 9, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 9, fontWeight: 700}} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))' }} />
                <Area type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
