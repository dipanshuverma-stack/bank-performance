"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useUser } from "@/firebase";
import { useRealtimeCollection } from "@/hooks/use-database";
import { Activity, Zap, Target, Trophy, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const user = useUser();
  const { data: mocks } = useRealtimeCollection('mocks');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const avgAccuracy = mocks.length > 0 
    ? Math.round(mocks.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0) / mocks.length) 
    : 0;

  if (!mounted) return null;

  return (
    <AppShell>
      <div className="space-y-10 pb-24">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Operational L1</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tighter">
              Elite, <span className="text-primary italic">{user?.displayName || 'Aspirant'}</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm max-w-lg">Neural link stable. Terminal metrics synchronized with cloud-first persistence.</p>
          </div>

          <Card className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-6 flex items-center gap-6 shadow-xl backdrop-blur-xl">
             <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner"><Activity /></div>
             <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-primary/60">Global Accuracy</div>
                <div className="text-3xl font-headline font-black tracking-tighter">{avgAccuracy}%</div>
                <div className="text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-1 mt-0.5"><Zap className="w-2.5 h-2.5" /> Precision Peak</div>
             </div>
          </Card>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Mission Volume", value: mocks.length, icon: Target, color: "text-blue-500" },
            { label: "Highest Hit", value: mocks.length > 0 ? Math.max(...mocks.map((m: any) => m.score)) : 0, icon: Trophy, color: "text-yellow-500" },
            { label: "Consistency", value: "85%", icon: TrendingUp, color: "text-emerald-500" }
          ].map((stat, i) => (
            <Card key={i} className="bento-card bg-card/40 border-white/5 p-8 group">
               <div className="flex justify-between items-start mb-6">
                 <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon /></div>
                 <Badge variant="outline" className="text-[8px] font-black uppercase opacity-40">Stat Unit</Badge>
               </div>
               <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</div>
               <div className="text-4xl font-headline font-black tracking-tighter">{stat.value}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Card className="bento-card bg-slate-900 text-white p-10 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Readiness Protocol</span>
                 </div>
                 <h2 className="text-4xl font-headline font-black tracking-tighter leading-none">Operational <br/> Mastery Score</h2>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60"><span>Saturation</span> <span>{avgAccuracy}%</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                       <div className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]" style={{ width: `${avgAccuracy}%` }} />
                    </div>
                 </div>
              </div>
              <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
           </Card>

           <Card className="bento-card bg-card/60 border-white/5 p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner"><Activity /></div>
                <div>
                   <h3 className="text-xl font-headline font-black tracking-tight">Active Stream</h3>
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-0.5">Real-time persistence updates</p>
                </div>
              </div>
              <div className="space-y-4">
                 {mocks.slice(0, 3).map((m: any) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                       <span className="font-bold text-sm">{m.name}</span>
                       <Badge className="bg-primary/20 text-primary text-[8px] font-black px-3 py-1">ARCHIVED</Badge>
                    </div>
                 ))}
                 {mocks.length === 0 && <div className="py-10 text-center text-[10px] font-black uppercase opacity-20 tracking-widest">No Recent Activity</div>}
              </div>
           </Card>
        </div>
      </div>
    </AppShell>
  );
}
