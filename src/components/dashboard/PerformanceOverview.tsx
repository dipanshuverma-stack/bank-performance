"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Target, TrendingUp, Zap, Calendar, BarChart3, LineChart, Activity } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PERIOD_DATA = {
  daily: [
    { name: '06:00', accuracy: 45, score: 32, tests: 0 },
    { name: '09:00', accuracy: 72, score: 65, tests: 1 },
    { name: '12:00', accuracy: 65, score: 58, tests: 0 },
    { name: '15:00', accuracy: 88, score: 82, tests: 1 },
    { name: '18:00', accuracy: 75, score: 70, tests: 1 },
    { name: '21:00', accuracy: 82, score: 78, tests: 0 },
    { name: '00:00', accuracy: 90, score: 85, tests: 0 },
  ],
  weekly: [
    { name: 'Mon', accuracy: 65, score: 55, tests: 2 },
    { name: 'Tue', accuracy: 72, score: 62, tests: 3 },
    { name: 'Wed', accuracy: 68, score: 60, tests: 1 },
    { name: 'Thu', accuracy: 82, score: 75, tests: 4 },
    { name: 'Fri', accuracy: 75, score: 68, tests: 2 },
    { name: 'Sat', accuracy: 88, score: 80, tests: 5 },
    { name: 'Sun', accuracy: 78, score: 72, tests: 2 },
  ],
  '15days': [
    { name: 'D1-3', accuracy: 60, score: 52, tests: 8 },
    { name: 'D4-6', accuracy: 65, score: 58, tests: 6 },
    { name: 'D7-9', accuracy: 75, score: 68, tests: 10 },
    { name: 'D10-12', accuracy: 70, score: 65, tests: 7 },
    { name: 'D13-15', accuracy: 84, score: 78, tests: 12 },
  ],
  monthly: [
    { name: 'Week 1', accuracy: 62, score: 55, tests: 15 },
    { name: 'Week 2', accuracy: 70, score: 64, tests: 18 },
    { name: 'Week 3', accuracy: 78, score: 70, tests: 22 },
    { name: 'Week 4', accuracy: 85, score: 79, tests: 25 },
  ],
};

const STATS_BY_PERIOD = {
  daily: { avgScore: 64.5, avgAccuracy: 73.8, testsTaken: 3, growth: "+4.2%" },
  weekly: { avgScore: 67.4, avgAccuracy: 75.4, testsTaken: 19, growth: "+12.5%" },
  '15days': { avgScore: 64.2, avgAccuracy: 70.8, testsTaken: 43, growth: "+18.3%" },
  monthly: { avgScore: 66.1, avgAccuracy: 73.7, testsTaken: 80, growth: "+22.1%" },
};

export function PerformanceOverview() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<keyof typeof PERIOD_DATA>("weekly");
  const [activeView, setActiveView] = useState<"performance" | "volume">("performance");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentStats = STATS_BY_PERIOD[period];
  const chartData = PERIOD_DATA[period];

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
            {currentStats.growth} overall improvement
          </div>
        </div>
        
        <Tabs defaultValue="weekly" className="w-full md:w-auto" onValueChange={(v) => setPeriod(v as any)}>
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
              {currentStats.avgAccuracy}%
            </span>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mb-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="flex flex-col p-6 rounded-3xl bg-indigo-50/50 dark:bg-primary/5 border border-indigo-100/50 dark:border-primary/10 group transition-all hover:border-primary/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-primary uppercase font-black tracking-widest">Avg Score</span>
              <Zap className="w-4 h-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {currentStats.avgScore}
            </span>
          </div>

          <div className="flex flex-col p-6 rounded-3xl bg-emerald-50/50 dark:bg-success/5 border border-emerald-100/50 dark:border-success/10 group transition-all hover:border-success/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-success uppercase font-black tracking-widest">Tests Taken</span>
              <BarChart3 className="w-4 h-4 text-success opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {currentStats.testsTaken}
            </span>
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
