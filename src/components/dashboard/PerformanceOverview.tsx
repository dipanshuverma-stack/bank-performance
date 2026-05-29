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
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Target, TrendingUp, BarChart3, LineChart, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logAuditAction } from "@/lib/audit-logger";

const EMPTY_CHART_DATA = Array.from({ length: 8 }, (_, i) => ({
  name: `P${i + 1}`,
  accuracy: 0,
  score: 0,
  tests: 0
}));

export function PerformanceOverview() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState("weekly");
  const [stage, setStage] = useState<"Prelims" | "Mains">("Prelims");
  const [activeView, setActiveView] = useState<"performance" | "volume">("performance");
  
  const [stats, setStats] = useState({
    avgScore: 0,
    avgAccuracy: 0,
    testsTaken: 0,
    growth: "0%",
  });

  const [chartData, setChartData] = useState<any[]>(EMPTY_CHART_DATA);

  useEffect(() => {
    setMounted(true);
    const savedStage = localStorage.getItem("elite-active-stage") as "Prelims" | "Mains";
    if (savedStage) {
      setStage(savedStage);
    }
  }, []);

  const handleStageChange = (val: "Prelims" | "Mains") => {
    setStage(val);
    localStorage.setItem("elite-active-stage", val);
    logAuditAction("Strategic", "Stage Toggle", `Phase switched to ${val} via Overview`);
    window.dispatchEvent(new Event('elite-stage-changed'));
  };

  useEffect(() => {
    if (!mounted) return;

    const refreshData = () => {
      const mockLogsRaw = localStorage.getItem("elite-mock-logs");
      const mockLogs = mockLogsRaw ? JSON.parse(mockLogsRaw) : [];
      const currentStage = localStorage.getItem("elite-active-stage") as "Prelims" | "Mains" || stage;

      const stageFiltered = mockLogs.filter((m: any) => m.stage === currentStage);

      if (stageFiltered.length > 0) {
        const sumScore = stageFiltered.reduce((acc: number, m: any) => acc + (m.score || 0), 0);
        const sumAcc = stageFiltered.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0);
        
        const avgScore = (sumScore / stageFiltered.length).toFixed(1);
        const avgAccuracy = (sumAcc / stageFiltered.length).toFixed(1);

        const mappedChartData = stageFiltered.slice(0, 10).reverse().map((m: any) => ({
          name: m.date.split('/')[0] + '/' + m.date.split('/')[1],
          accuracy: m.accuracy,
          score: m.score,
          tests: 1
        }));

        setStats({
          avgScore: parseFloat(avgScore),
          avgAccuracy: parseFloat(avgAccuracy),
          testsTaken: stageFiltered.length,
          growth: "Active"
        });

        setChartData(mappedChartData.length > 0 ? mappedChartData : EMPTY_CHART_DATA);
      } else {
        setStats({
          avgScore: 0,
          avgAccuracy: 0,
          testsTaken: 0,
          growth: "No Data"
        });
        setChartData(EMPTY_CHART_DATA);
      }
    };

    refreshData();
    window.addEventListener('storage', refreshData);
    window.addEventListener('elite-stage-changed', refreshData);
    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('elite-stage-changed', refreshData);
    };
  }, [mounted, stage, period]);

  const MemoizedAreaChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--muted))" opacity={0.15} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800}} 
          dy={15} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800}} 
          domain={[0, 100]} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 40px -10px rgb(0 0 0 / 0.2)', backgroundColor: 'hsl(var(--card))', padding: '16px' }}
          itemStyle={{ fontSize: '12px', fontWeight: '900', color: 'hsl(var(--primary))' }}
        />
        <Area 
          isAnimationActive={true}
          animationDuration={1500}
          name="Accuracy %" 
          type="monotone" 
          dataKey="accuracy" 
          stroke="hsl(var(--primary))" 
          strokeWidth={6} 
          fillOpacity={1} 
          fill="url(#colorAcc)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [chartData]);

  const MemoizedBarChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--muted))" opacity={0.15} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800}} dy={15} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800}} />
        <Tooltip cursor={{ fill: 'hsl(var(--primary))', opacity: 0.08 }} contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: 'hsl(var(--card))' }} />
        <Bar isAnimationActive={true} animationDuration={1200} dataKey="tests" name="Tests Taken" radius={[10, 10, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.3)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ), [chartData]);

  if (!mounted) return null;

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/60 backdrop-blur-3xl shadow-2xl">
      <CardHeader className="flex flex-col bg-accent/5 p-10 gap-10 border-b border-white/5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Target className="w-7 h-7" />
              </div>
              <CardTitle className="text-3xl xl:text-4xl font-headline font-black tracking-tight">Performance Analytics</CardTitle>
            </div>
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.3em] ml-16">
              <Layers className="w-4 h-4" />
              {stage} Protocol Engaged
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full xl:w-auto">
            <Tabs value={stage} onValueChange={(val: any) => handleStageChange(val)} className="w-full sm:w-[320px]">
              <TabsList className="grid grid-cols-2 w-full h-14 bg-primary/10 rounded-[1.5rem] p-1.5 border border-primary/20">
                <TabsTrigger value="Prelims" className="text-xs font-black uppercase tracking-widest rounded-2xl transition-all data-[state=active]:shadow-lg">
                  Prelims
                </TabsTrigger>
                <TabsTrigger value="Mains" className="text-xs font-black uppercase tracking-widest rounded-2xl transition-all data-[state=active]:shadow-lg">
                  Mains
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 bg-accent/20 rounded-2xl p-1.5 h-14">
              {["daily", "weekly", "monthly"].map((p) => (
                <Button 
                  key={p} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "h-11 px-5 text-[10px] font-black uppercase rounded-xl transition-all",
                    period === p ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {p[0]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-10 xl:p-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {[
            { label: "Mean Accuracy", value: `${stats.avgAccuracy}%`, color: "text-foreground", icon: TrendingUp },
            { label: "Peak Score", value: stats.avgScore, color: "text-primary", icon: Target },
            { label: "Mission Volume", value: stats.testsTaken, color: "text-emerald-500", icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-border/60 group hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs text-muted-foreground uppercase font-black tracking-[0.3em]">{stat.label}</span>
                <stat.icon className="w-6 h-6 text-muted-foreground/20 group-hover:text-primary transition-colors" />
              </div>
              <span className={cn("text-5xl xl:text-6xl font-headline font-black tabular-nums tracking-tighter", stat.color)}>
                {stat.value}
              </span>
              <div className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
                Archived {stage} Telemetry
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-slate-50/40 dark:bg-white/[0.02] rounded-[4rem] p-10 xl:p-16 border border-border/40 relative overflow-hidden shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-14">
             <div className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60">Strategy Trajectory Analysis</div>
             <div className="flex items-center gap-3 bg-accent/20 p-2 rounded-[1.75rem] w-full md:w-auto shadow-sm">
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("performance")} 
                className={cn(
                  "flex-1 md:flex-none h-12 px-8 text-xs font-black uppercase tracking-widest rounded-2xl transition-all",
                  activeView === 'performance' ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/40' : 'text-muted-foreground hover:bg-white/10'
                )}
               >
                 <LineChart className="w-5 h-5 mr-3" /> Precision
               </Button>
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("volume")} 
                className={cn(
                  "flex-1 md:flex-none h-12 px-8 text-xs font-black uppercase tracking-widest rounded-2xl transition-all",
                  activeView === 'volume' ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/40' : 'text-muted-foreground hover:bg-white/10'
                )}
               >
                 <BarChart3 className="w-5 h-5 mr-3" /> Mission Count
               </Button>
             </div>
          </div>
          
          <div className="w-full h-[400px] xl:h-[500px]">
            {activeView === "performance" ? MemoizedAreaChart : MemoizedBarChart}
          </div>

          {stats.testsTaken === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl z-10 p-12 text-center">
              <Layers className="w-24 h-24 text-primary/10 mb-8 animate-pulse" />
              <div className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">Insufficient Stage Data</div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest max-w-[320px] leading-loose opacity-60">
                Log a {stage} standardized mock test in the vault to activate performance telemetry
              </p>
              <Button asChild variant="outline" className="mt-10 rounded-2xl h-14 px-10 border-2 font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                <a href="/mocks">Initiate Log Protocol</a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}