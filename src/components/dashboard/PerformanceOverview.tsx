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
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--muted))" opacity={0.1} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
          dy={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
          domain={[0, 100]} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 30px -10px rgb(0 0 0 / 0.15)', backgroundColor: 'hsl(var(--card))', padding: '12px' }}
          itemStyle={{ fontSize: '11px', fontWeight: '800', color: 'hsl(var(--primary))' }}
        />
        <Area 
          isAnimationActive={true}
          animationDuration={1500}
          name="Accuracy %" 
          type="monotone" 
          dataKey="accuracy" 
          stroke="hsl(var(--primary))" 
          strokeWidth={4} 
          fillOpacity={1} 
          fill="url(#colorAcc)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [chartData]);

  const MemoizedBarChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="hsl(var(--muted))" opacity={0.1} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} />
        <Tooltip cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'hsl(var(--card))' }} />
        <Bar isAnimationActive={true} animationDuration={1200} dataKey="tests" name="Tests Taken" radius={[6, 6, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.25)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ), [chartData]);

  if (!mounted) return null;

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/60 backdrop-blur-3xl shadow-2xl">
      <CardHeader className="flex flex-col bg-accent/5 p-8 lg:p-10 gap-8 border-b border-white/5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Target className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl lg:text-3xl font-headline font-black tracking-tight">Performance Analytics</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] ml-14">
              <Layers className="w-3.5 h-3.5" />
              {stage} Protocol Engaged
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <Tabs value={stage} onValueChange={(val: any) => handleStageChange(val)} className="w-full sm:w-[260px]">
              <TabsList className="grid grid-cols-2 w-full h-11 bg-primary/10 rounded-[1.25rem] p-1 border border-primary/20">
                <TabsTrigger value="Prelims" className="text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Prelims
                </TabsTrigger>
                <TabsTrigger value="Mains" className="text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Mains
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-1.5 bg-accent/20 rounded-xl p-1 h-11">
              {["D", "W", "M"].map((p, i) => (
                <Button 
                  key={p} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPeriod(["daily", "weekly", "monthly"][i])}
                  className={cn(
                    "h-9 px-4 text-[9px] font-black uppercase rounded-lg transition-all",
                    period === ["daily", "weekly", "monthly"][i] ? "bg-card text-foreground shadow-md" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {[
            { label: "Mean Accuracy", value: `${stats.avgAccuracy}%`, color: "text-foreground", icon: TrendingUp },
            { label: "Peak Score", value: stats.avgScore, color: "text-primary", icon: Target },
            { label: "Mission Volume", value: stats.testsTaken, color: "text-emerald-500", icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-border/60 group hover:border-primary/30 transition-all duration-500 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.label}</span>
                <stat.icon className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
              </div>
              <span className={cn("text-3xl lg:text-4xl font-headline font-black tabular-nums tracking-tighter", stat.color)}>
                {stat.value}
              </span>
              <div className="mt-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
                Archived Telemetry
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-slate-50/40 dark:bg-white/[0.02] rounded-[3rem] p-8 lg:p-12 border border-border/40 relative overflow-hidden shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Trajectory Analysis</div>
             <div className="flex items-center gap-2 bg-accent/20 p-1.5 rounded-[1.25rem] w-full md:w-auto shadow-sm">
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("performance")} 
                className={cn(
                  "flex-1 md:flex-none h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activeView === 'performance' ? 'bg-primary text-primary-foreground shadow-xl' : 'text-muted-foreground hover:bg-white/10'
                )}
               >
                 <LineChart className="w-4 h-4 mr-2" /> Precision
               </Button>
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("volume")} 
                className={cn(
                  "flex-1 md:flex-none h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activeView === 'volume' ? 'bg-primary text-primary-foreground shadow-xl' : 'text-muted-foreground hover:bg-white/10'
                )}
               >
                 <BarChart3 className="w-4 h-4 mr-2" /> Volume
               </Button>
             </div>
          </div>
          
          <div className="w-full h-[300px] lg:h-[400px]">
            {activeView === "performance" ? MemoizedAreaChart : MemoizedBarChart}
          </div>

          {stats.testsTaken === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl z-10 p-10 text-center">
              <Layers className="w-16 h-16 text-primary/10 mb-6 animate-pulse" />
              <div className="text-xl font-black text-foreground mb-3 uppercase tracking-tighter">Insufficient Data</div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest max-w-[280px] leading-loose opacity-60">
                Log a standardized mock test to activate performance telemetry
              </p>
              <Button asChild variant="outline" className="mt-8 rounded-xl h-12 px-8 border-2 font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                <a href="/mocks">Initiate Log Protocol</a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
