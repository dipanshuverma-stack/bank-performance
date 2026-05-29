"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BrainCircuit, LineChart as LineIcon } from 'lucide-react';

export function SubjectWisePerformance() {
  const [stage, setStage] = useState<"Prelims" | "Mains">("Prelims");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const refresh = () => {
      const saved = localStorage.getItem("elite-mock-logs");
      const logs = saved ? JSON.parse(saved) : [];
      const filtered = logs
        .filter((m: any) => m.stage === stage)
        .slice(0, 10)
        .reverse()
        .map((m: any) => ({
          name: m.date.split('/')[0] + '/' + (m.date.split('/')[1] || ''),
          quants: m.subjectScores?.quants || 0,
          reasoning: m.subjectScores?.reasoning || 0,
          english: m.subjectScores?.english || 0,
          ga: m.subjectScores?.ga || 0,
        }));
      setChartData(filtered);
    };

    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('elite-stage-changed', refresh);
    
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('elite-stage-changed', refresh);
    };
  }, [stage]);

  return (
    <Card className="bento-card border-none bg-card/40 backdrop-blur-3xl shadow-xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-accent/5 p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-inner">
            <LineIcon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-headline font-black tracking-tight">Subject Intelligence</CardTitle>
            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-0.5 opacity-60">Sectional Diagnostic Plot</p>
          </div>
        </div>
        <Tabs value={stage} onValueChange={(v: any) => setStage(v)} className="w-full sm:w-[200px]">
          <TabsList className="grid grid-cols-2 bg-primary/10 rounded-xl border border-primary/20 h-10 p-1">
            <TabsTrigger value="Prelims" className="text-[9px] font-black uppercase tracking-widest rounded-lg">Prelims</TabsTrigger>
            <TabsTrigger value="Mains" className="text-[9px] font-black uppercase tracking-widest rounded-lg">Mains</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="hsl(var(--muted))" opacity={0.1} />
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
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    backgroundColor: 'hsl(var(--card))', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    padding: '12px' 
                  }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '25px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quants" 
                  name="Quants" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="reasoning" 
                  name="Reasoning" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="english" 
                  name="English" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
                {stage === "Mains" && (
                  <Line 
                    type="monotone" 
                    dataKey="ga" 
                    name="GA" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-30">
              <BrainCircuit className="w-14 h-14 mb-4 text-primary animate-pulse" />
              <p className="text-xs font-black uppercase tracking-[0.4em]">Sectional Data Empty</p>
              <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">Log detailed mock scores to activate intelligence</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}