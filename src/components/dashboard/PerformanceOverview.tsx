
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

const EMPTY_CHART_DATA = Array.from({ length: 5 }, (_, i) => ({
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
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const refreshData = () => {
      const mockLogsRaw = localStorage.getItem("elite-mock-logs");
      const mockLogs = mockLogsRaw ? JSON.parse(mockLogsRaw) : [];

      const stageFiltered = mockLogs.filter((m: any) => m.stage === stage);

      if (stageFiltered.length > 0) {
        const sumScore = stageFiltered.reduce((acc: number, m: any) => acc + (m.score || 0), 0);
        const sumAcc = stageFiltered.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0);
        
        const avgScore = (sumScore / stageFiltered.length).toFixed(1);
        const avgAccuracy = (sumAcc / stageFiltered.length).toFixed(1);

        const mappedChartData = stageFiltered.slice(0, 7).reverse().map((m: any) => ({
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
    return () => window.removeEventListener('storage', refreshData);
  }, [mounted, stage, period]);

  const MemoizedAreaChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.1} />
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
          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
          itemStyle={{ fontSize: '11px', fontWeight: '800' }}
        />
        <Area 
          isAnimationActive={true}
          animationDuration={1000}
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
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.1} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} />
        <Tooltip cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }} contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'hsl(var(--card))' }} />
        <Bar isAnimationActive={true} dataKey="tests" name="Tests Taken" radius={[6, 6, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.2)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ), [chartData]);

  if (!mounted) return null;

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/50">
      <CardHeader className="flex flex-col bg-accent/5 py-6 px-6 gap-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl md:text-2xl font-headline font-bold">Performance Intel</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest ml-7">
              <Layers className="w-3.5 h-3.5" />
              {stage} Phase Active
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Tabs value={stage} onValueChange={(val: any) => setStage(val)} className="w-full sm:w-[240px]">
              <TabsList className="grid grid-cols-2 w-full h-11 bg-primary/10 rounded-2xl p-1 border border-primary/20">
                <TabsTrigger value="Prelims" className="text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Prelims
                </TabsTrigger>
                <TabsTrigger value="Mains" className="text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                  Mains
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-1 bg-accent/20 rounded-xl p-1 h-11">
              {["daily", "weekly", "monthly"].map((p) => (
                <Button 
                  key={p} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "h-9 px-3 text-[9px] font-black uppercase rounded-lg",
                    period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {p[0]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Accuracy", value: `${stats.avgAccuracy}%`, color: "text-foreground", icon: TrendingUp },
            { label: "Avg Score", value: stats.avgScore, color: "text-primary", icon: Target },
            { label: "Tests Logged", value: stats.testsTaken, color: "text-emerald-500", icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-border/40 group hover:border-primary/20 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-muted-foreground/30" />
              </div>
              <span className={cn("text-3xl font-headline font-black tabular-nums tracking-tighter", stat.color)}>
                {stat.value}
              </span>
              <div className="mt-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                Current {stage} Metrics
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-slate-50/20 dark:bg-white/[0.01] rounded-[2.5rem] p-4 md:p-8 border border-border/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Trajectory Analysis</div>
             <div className="flex items-center gap-2 bg-accent/20 p-1 rounded-2xl w-full md:w-auto">
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("performance")} 
                className={cn(
                  "flex-1 md:flex-none h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  activeView === 'performance' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-accent'
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
                  activeView === 'volume' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-accent'
                )}
               >
                 <BarChart3 className="w-4 h-4 mr-2" /> Frequency
               </Button>
             </div>
          </div>
          
          <div className="w-full h-[280px] md:h-[320px]">
            {activeView === "performance" ? MemoizedAreaChart : MemoizedBarChart}
          </div>

          {stats.testsTaken === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-8 text-center">
              <Layers className="w-14 h-14 text-primary/20 mb-4 animate-pulse" />
              <div className="text-base font-black text-foreground mb-1 uppercase tracking-tight">Stage Data Missing</div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest max-w-[200px] leading-relaxed">
                Archive a {stage} mock test in the vault to initiate strategy tracking
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
