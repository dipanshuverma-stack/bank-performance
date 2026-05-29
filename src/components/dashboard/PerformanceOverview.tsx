
"use client";

import { useState, useEffect } from "react";
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
import { Target, TrendingUp, Zap, BarChart3, LineChart, Activity, CheckCircle2, XCircle, Clock, Brain } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Empty baseline data structure
const EMPTY_CHART_DATA = [
  { name: 'P1', accuracy: 0, score: 0, tests: 0 },
  { name: 'P2', accuracy: 0, score: 0, tests: 0 },
  { name: 'P3', accuracy: 0, score: 0, tests: 0 },
  { name: 'P4', accuracy: 0, score: 0, tests: 0 },
  { name: 'P5', accuracy: 0, score: 0, tests: 0 },
];

export function PerformanceOverview() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState("weekly");
  const [activeView, setActiveView] = useState<"performance" | "volume">("performance");
  
  const [stats, setStats] = useState({
    avgScore: 0,
    avgAccuracy: 0,
    testsTaken: 0,
    growth: "0%",
    totalCorrect: 0,
    totalWrong: 0,
    avgPracticeTime: "0:00",
    quantsAccuracy: 0,
    reasoningAccuracy: 0
  });

  const [chartData, setChartData] = useState(EMPTY_CHART_DATA);

  useEffect(() => {
    setMounted(true);
    
    // Load real data from localStorage
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const accuracyLogs = JSON.parse(localStorage.getItem("accuracy-logs") || "[]");

    if (mockLogs.length > 0) {
      const totalCorrect = mockLogs.reduce((acc: number, m: any) => acc + (m.correct || 0), 0);
      const totalWrong = mockLogs.reduce((acc: number, m: any) => acc + (m.wrong || 0), 0);
      const avgScore = (mockLogs.reduce((acc: number, m: any) => acc + (m.score || 0), 0) / mockLogs.length).toFixed(1);
      const avgAccuracy = (mockLogs.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0) / mockLogs.length).toFixed(1);
      
      // Subject accuracy calc
      const quants = mockLogs.filter((m: any) => m.examType.includes("Quants") || m.quantsCorrect > 0);
      const reasoning = mockLogs.filter((m: any) => m.examType.includes("Reasoning") || m.reasoningCorrect > 0);
      
      const qAcc = quants.length > 0 ? (quants.reduce((acc: number, m: any) => acc + m.accuracy, 0) / quants.length) : 0;
      const rAcc = reasoning.length > 0 ? (reasoning.reduce((acc: number, m: any) => acc + m.accuracy, 0) / reasoning.length) : 0;

      // Map mock logs to chart data (simple chronological mapping)
      const mappedChartData = mockLogs.slice(-7).reverse().map((m: any, i: number) => ({
        name: m.date.split('/')[0] + '/' + m.date.split('/')[1], // Short date
        accuracy: m.accuracy,
        score: m.score,
        tests: 1
      }));

      setStats(prev => ({
        ...prev,
        avgScore: parseFloat(avgScore),
        avgAccuracy: parseFloat(avgAccuracy),
        testsTaken: mockLogs.length,
        totalCorrect,
        totalWrong,
        quantsAccuracy: Math.round(qAcc),
        reasoningAccuracy: Math.round(rAcc)
      }));

      if (mappedChartData.length > 0) {
        setChartData(mappedChartData);
      }
    }

    if (accuracyLogs.length > 0) {
      const avgTime = accuracyLogs.reduce((acc: number, l: any) => acc + l.time, 0) / accuracyLogs.length;
      const mins = Math.floor(avgTime / 60);
      const secs = Math.floor(avgTime % 60);
      setStats(prev => ({
        ...prev,
        avgPracticeTime: `${mins}:${secs.toString().padStart(2, '0')}`
      }));
    }
  }, [period]);

  if (!mounted) return null;

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/50">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between bg-accent/5 py-6 gap-4 border-b">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-headline font-bold">Performance Intelligence</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-success font-bold text-[10px] uppercase tracking-widest ml-7">
            <TrendingUp className="w-3.5 h-3.5" />
            {stats.growth} improvement found
          </div>
        </div>
        
        <Tabs defaultValue="weekly" className="w-full md:w-auto" onValueChange={setPeriod}>
          <TabsList className="grid grid-cols-4 w-full h-10 bg-accent/20 rounded-xl p-1">
            <TabsTrigger value="daily" className="text-[10px] font-black uppercase tracking-tighter rounded-lg data-[state=active]:bg-card">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="text-[10px] font-black uppercase tracking-tighter rounded-lg data-[state=active]:bg-card">Weekly</TabsTrigger>
            <TabsTrigger value="15days" className="text-[10px] font-black uppercase tracking-tighter rounded-lg data-[state=active]:bg-card">15 Days</TabsTrigger>
            <TabsTrigger value="monthly" className="text-[10px] font-black uppercase tracking-tighter rounded-lg data-[state=active]:bg-card">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:border-primary/20 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
               <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Avg Accuracy</span>
               <Activity className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {stats.avgAccuracy}%
            </span>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mb-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="flex flex-col p-6 rounded-3xl bg-indigo-50/50 dark:bg-primary/5 border border-indigo-100/50 dark:border-primary/10 group transition-all hover:border-primary/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-primary uppercase font-black tracking-widest">Avg Score</span>
              <Zap className="w-4 h-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {stats.avgScore}
            </span>
          </div>

          <div className="flex flex-col p-6 rounded-3xl bg-emerald-50/50 dark:bg-success/5 border border-emerald-100/50 dark:border-success/10 group transition-all hover:border-success/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-success uppercase font-black tracking-widest">Tests Taken</span>
              <BarChart3 className="w-4 h-4 text-success opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {stats.testsTaken}
            </span>
          </div>
        </div>

        {/* Extended Mastery Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 border-y border-border/40 py-8 bg-slate-50/30 dark:bg-white/[0.01]">
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-border/50">
             <CheckCircle2 className="w-5 h-5 text-success mb-2" />
             <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Total Correct</span>
             <span className="text-2xl font-headline font-bold text-foreground">{stats.totalCorrect}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-border/50">
             <XCircle className="w-5 h-5 text-destructive mb-2" />
             <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Total Mistakes</span>
             <span className="text-2xl font-headline font-bold text-foreground">{stats.totalWrong}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-border/50">
             <Clock className="w-5 h-5 text-primary mb-2" />
             <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Avg Efficiency</span>
             <span className="text-2xl font-headline font-bold text-foreground">{stats.avgPracticeTime}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-4">
             <Brain className="w-5 h-5 text-purple-500 mb-2" />
             <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Domain Mastery</span>
             <div className="flex gap-2 items-center">
                <span className="text-xs font-bold text-blue-500">Q:{stats.quantsAccuracy}%</span>
                <div className="w-[1px] h-3 bg-border" />
                <span className="text-xs font-bold text-purple-500">R:{stats.reasoningAccuracy}%</span>
             </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("performance")}
                className={`rounded-xl h-9 px-4 font-bold text-[10px] uppercase tracking-widest ${activeView === 'performance' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                <LineChart className="w-3.5 h-3.5 mr-2" />
                Performance Flux
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveView("volume")}
                className={`rounded-xl h-9 px-4 font-bold text-[10px] uppercase tracking-widest ${activeView === 'volume' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                <BarChart3 className="w-3.5 h-3.5 mr-2" />
                Volume Metrics
              </Button>
            </div>
            <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-accent/20 px-3 py-1 rounded-full">
              {period.toUpperCase()} TIMELINE
            </div>
          </div>

          <div className="h-[350px] w-full mt-6 bg-slate-50/30 dark:bg-white/[0.02] rounded-3xl p-6 border border-border/40">
            <ResponsiveContainer width="100%" height="100%">
              {activeView === "performance" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
                    domain={[0, 100]} 
                    dx={-15}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                      padding: '16px',
                      backgroundColor: 'hsl(var(--card))',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{ fontSize: '11px', fontWeight: '800' }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '6 6' }}
                  />
                  <Area 
                    name="Accuracy %"
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAcc)" 
                    animationDuration={1500}
                    activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                  />
                  <Area 
                    name="Score Trend"
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} 
                    dx={-15}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'hsl(var(--card))'
                    }}
                  />
                  <Bar dataKey="tests" name="Tests Taken" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.3)'} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
