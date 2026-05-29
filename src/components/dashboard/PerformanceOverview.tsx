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
import { Target, TrendingUp, Zap, BarChart3, LineChart, Activity, CheckCircle2, XCircle, Clock, Brain } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const EMPTY_CHART_DATA = Array.from({ length: 5 }, (_, i) => ({
  name: `P${i + 1}`,
  accuracy: 0,
  score: 0,
  tests: 0
}));

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
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const accuracyLogs = JSON.parse(localStorage.getItem("accuracy-logs") || "[]");

    if (mockLogs.length > 0) {
      const totalCorrect = mockLogs.reduce((acc: number, m: any) => acc + (m.correct || 0), 0);
      const totalWrong = mockLogs.reduce((acc: number, m: any) => acc + (m.wrong || 0), 0);
      const sumScore = mockLogs.reduce((acc: number, m: any) => acc + (m.score || 0), 0);
      const sumAcc = mockLogs.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0);
      
      const avgScore = (sumScore / mockLogs.length).toFixed(1);
      const avgAccuracy = (sumAcc / mockLogs.length).toFixed(1);
      
      const quants = mockLogs.filter((m: any) => m.examType?.includes("Quants") || m.quantsCorrect > 0);
      const reasoning = mockLogs.filter((m: any) => m.examType?.includes("Reasoning") || m.reasoningCorrect > 0);
      
      const qAcc = quants.length > 0 ? (quants.reduce((acc: number, m: any) => acc + m.accuracy, 0) / quants.length) : 0;
      const rAcc = reasoning.length > 0 ? (reasoning.reduce((acc: number, m: any) => acc + m.accuracy, 0) / reasoning.length) : 0;

      const mappedChartData = mockLogs.slice(-7).reverse().map((m: any) => ({
        name: m.date.split('/')[0] + '/' + m.date.split('/')[1],
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

  const MemoizedAreaChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.2} />
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
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
          itemStyle={{ fontSize: '11px', fontWeight: '800' }}
        />
        <Area 
          isAnimationActive={false} // Performance boost
          name="Accuracy %" 
          type="monotone" 
          dataKey="accuracy" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorAcc)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  ), [chartData]);

  const MemoizedBarChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.2} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700}} />
        <Tooltip cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'hsl(var(--card))' }} />
        <Bar isAnimationActive={false} dataKey="tests" name="Tests Taken" radius={[4, 4, 0, 0]}>
          {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.3)'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ), [chartData]);

  if (!mounted) return null;

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/50">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between bg-accent/5 py-4 px-6 gap-4 border-b">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-headline font-bold">Performance Intel</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-success font-black text-[10px] uppercase tracking-widest ml-7">
            <TrendingUp className="w-3.5 h-3.5" />
            Operational Ready
          </div>
        </div>
        
        <Tabs defaultValue="weekly" className="w-full md:w-auto" onValueChange={setPeriod}>
          <TabsList className="grid grid-cols-4 w-full h-9 bg-accent/20 rounded-xl p-1">
            <TabsTrigger value="daily" className="text-[9px] font-black uppercase tracking-tighter rounded-lg">D</TabsTrigger>
            <TabsTrigger value="weekly" className="text-[9px] font-black uppercase tracking-tighter rounded-lg">W</TabsTrigger>
            <TabsTrigger value="15days" className="text-[9px] font-black uppercase tracking-tighter rounded-lg">15D</TabsTrigger>
            <TabsTrigger value="monthly" className="text-[9px] font-black uppercase tracking-tighter rounded-lg">M</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Accuracy", value: `${stats.avgAccuracy}%`, color: "text-foreground" },
            { label: "Avg Score", value: stats.avgScore, color: "text-primary" },
            { label: "Mocks", value: stats.testsTaken, color: "text-success" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-border/40">
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">{stat.label}</span>
              <span className={`text-2xl md:text-3xl font-headline font-bold ${stat.color} tabular-nums tracking-tighter`}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="h-[300px] w-full mt-2 bg-slate-50/20 dark:bg-white/[0.01] rounded-3xl p-4 border border-border/40">
          <div className="flex items-center justify-end gap-2 mb-4">
             <Button variant="ghost" size="sm" onClick={() => setActiveView("performance")} className={`h-7 px-3 text-[9px] font-black uppercase tracking-widest rounded-lg ${activeView === 'performance' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
               <LineChart className="w-3 h-3 mr-1.5" /> Flux
             </Button>
             <Button variant="ghost" size="sm" onClick={() => setActiveView("volume")} className={`h-7 px-3 text-[9px] font-black uppercase tracking-widest rounded-lg ${activeView === 'volume' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
               <BarChart3 className="w-3 h-3 mr-1.5" /> Vol
             </Button>
          </div>
          {activeView === "performance" ? MemoizedAreaChart : MemoizedBarChart}
        </div>
      </CardContent>
    </Card>
  );
}
