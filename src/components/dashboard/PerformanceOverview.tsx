"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERFORMANCE_STATS } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, BookOpen } from "lucide-react";

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
    <Card className="bento-card col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Accuracy Insight
        </CardTitle>
        <div className="flex items-center gap-2 text-success font-medium text-sm">
          <TrendingUp className="w-4 h-4" />
          +{PERFORMANCE_STATS.improvementRate}% this week
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Avg Accuracy</span>
            <span className="text-3xl font-headline font-bold text-slate-900">{PERFORMANCE_STATS.overallAccuracy}%</span>
          </div>
          <div className="flex flex-col p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <span className="text-xs text-indigo-600 uppercase font-bold tracking-tighter">Quants Level</span>
            <span className="text-3xl font-headline font-bold text-indigo-900">{PERFORMANCE_STATS.quantsAccuracy}%</span>
          </div>
          <div className="flex flex-col p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs text-emerald-600 uppercase font-bold tracking-tighter">Reasoning Level</span>
            <span className="text-3xl font-headline font-bold text-emerald-900">{PERFORMANCE_STATS.reasoningAccuracy}%</span>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#6366F1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAcc)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
