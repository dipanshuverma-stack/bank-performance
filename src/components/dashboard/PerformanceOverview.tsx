"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERFORMANCE_STATS } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Zap, Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PERIOD_DATA = {
  daily: [
    { name: '06:00', accuracy: 45 },
    { name: '09:00', accuracy: 72 },
    { name: '12:00', accuracy: 65 },
    { name: '15:00', accuracy: 88 },
    { name: '18:00', accuracy: 75 },
    { name: '21:00', accuracy: 82 },
    { name: '00:00', accuracy: 90 },
  ],
  weekly: [
    { name: 'Mon', accuracy: 65 },
    { name: 'Tue', accuracy: 72 },
    { name: 'Wed', accuracy: 68 },
    { name: 'Thu', accuracy: 82 },
    { name: 'Fri', accuracy: 75 },
    { name: 'Sat', accuracy: 88 },
    { name: 'Sun', accuracy: 78 },
  ],
  '15days': [
    { name: 'D1-3', accuracy: 60 },
    { name: 'D4-6', accuracy: 65 },
    { name: 'D7-9', accuracy: 75 },
    { name: 'D10-12', accuracy: 70 },
    { name: 'D13-15', accuracy: 84 },
  ],
  monthly: [
    { name: 'Week 1', accuracy: 62 },
    { name: 'Week 2', accuracy: 70 },
    { name: 'Week 3', accuracy: 78 },
    { name: 'Week 4', accuracy: 85 },
  ],
};

const STATS_BY_PERIOD = {
  daily: { overall: 82, quants: 78, reasoning: 86, growth: "+4.2%" },
  weekly: { overall: 78.4, quants: 72.5, reasoning: 84.2, growth: "+12.5%" },
  '15days': { overall: 75, quants: 68, reasoning: 82, growth: "+18.3%" },
  monthly: { overall: 72, quants: 65, reasoning: 79, growth: "+22.1%" },
};

export function PerformanceOverview() {
  const [period, setPeriod] = useState<keyof typeof PERIOD_DATA>("weekly");

  const currentStats = STATS_BY_PERIOD[period];
  const chartData = PERIOD_DATA[period];

  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden bg-card/50">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between bg-accent/5 py-6 gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Performance Intelligence
          </CardTitle>
          <div className="flex items-center gap-2 text-success font-bold text-[10px] uppercase tracking-widest ml-7">
            <TrendingUp className="w-3.5 h-3.5" />
            {currentStats.growth} precision growth
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 transition-all hover:border-primary/20 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
               <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Average Accuracy</span>
               <Zap className="w-4 h-4 text-yellow-500 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {currentStats.overall}%
            </span>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mb-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="flex flex-col p-6 rounded-3xl bg-indigo-50/50 dark:bg-primary/5 border border-indigo-100/50 dark:border-primary/10 group transition-all hover:border-primary/40">
            <span className="text-[10px] text-primary uppercase font-black tracking-widest mb-3">Quants Mastery</span>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {currentStats.quants}%
            </span>
          </div>

          <div className="flex flex-col p-6 rounded-3xl bg-emerald-50/50 dark:bg-success/5 border border-emerald-100/50 dark:border-success/10 group transition-all hover:border-success/40">
            <span className="text-[10px] text-success uppercase font-black tracking-widest mb-3">Reasoning Logic</span>
            <span className="text-5xl font-headline font-bold text-foreground tabular-nums tracking-tighter">
              {currentStats.reasoning}%
            </span>
          </div>
        </div>

        <div className="h-[320px] w-full mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accuracy Flux / {period.toUpperCase()}</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
                itemStyle={{ color: 'hsl(var(--primary))', fontSize: '12px' }}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '6 6' }}
              />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(var(--primary))" 
                strokeWidth={5}
                fillOpacity={1} 
                fill="url(#colorAcc)" 
                animationDuration={1500}
                activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
