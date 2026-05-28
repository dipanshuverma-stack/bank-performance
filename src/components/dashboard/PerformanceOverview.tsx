"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERFORMANCE_STATS } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Zap } from "lucide-react";

const data = [
  { name: 'Mon', accuracy: 65 },
  { name: 'Tue', accuracy: 72 },
  { name: 'Wed', accuracy: 68 },
  { name: 'Thu', accuracy: 82 },
  { name: 'Fri', accuracy: 75 },
  { name: 'Sat', accuracy: 88 },
  { name: 'Sun', accuracy: 78 },
];

export function PerformanceOverview() {
  return (
    <Card className="bento-card col-span-1 lg:col-span-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-accent/5 py-4">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Accuracy Insight
        </CardTitle>
        <div className="flex items-center gap-2 text-success font-bold text-xs uppercase tracking-widest">
          <TrendingUp className="w-4 h-4" />
          +{PERFORMANCE_STATS.improvementRate}% growth
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 transition-all hover:border-primary/20 group">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Average</span>
               <Zap className="w-3 h-3 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-4xl font-headline font-bold text-slate-900 dark:text-white tabular-nums">{PERFORMANCE_STATS.overallAccuracy}%</span>
          </div>
          <div className="flex flex-col p-4 rounded-2xl bg-indigo-50/50 dark:bg-primary/5 border border-indigo-100/50 dark:border-primary/10">
            <span className="text-[10px] text-indigo-600 dark:text-primary uppercase font-black tracking-widest mb-2">Quants</span>
            <span className="text-4xl font-headline font-bold text-indigo-900 dark:text-white tabular-nums">{PERFORMANCE_STATS.quantsAccuracy}%</span>
          </div>
          <div className="flex flex-col p-4 rounded-2xl bg-emerald-50/50 dark:bg-success/5 border border-emerald-100/50 dark:border-success/10">
            <span className="text-[10px] text-emerald-600 dark:text-success uppercase font-black tracking-widest mb-2">Reasoning</span>
            <span className="text-4xl font-headline font-bold text-emerald-900 dark:text-white tabular-nums">{PERFORMANCE_STATS.reasoningAccuracy}%</span>
          </div>
        </div>

        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600}} 
                domain={[0, 100]} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid hsl(var(--border))', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(var(--primary))" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorAcc)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
