"use client";

import { useEffect, useState } from "react";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { Activity, ShieldCheck, Zap, BookOpen, Trophy, Sparkles, BrainCircuit } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    syllabusMastery: 0,
    avgAccuracy: 0,
    mocksCount: 0,
  });

  useEffect(() => {
    setMounted(true);
    
    const syllabusSaved = localStorage.getItem("elite-syllabus-v2");
    if (syllabusSaved) {
      try {
        const syllabus = JSON.parse(syllabusSaved);
        let total = 0;
        let done = 0;
        syllabus.forEach((s: any) => {
          s.chapters.forEach((c: any) => {
            c.subtopics.forEach((st: any) => {
              total++;
              if (st.completed) done++;
            });
          });
        });
        setMetrics(prev => ({ ...prev, syllabusMastery: total > 0 ? Math.round((done / total) * 100) : 0 }));
      } catch (e) {}
    }

    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    if (mockLogs.length > 0) {
      const avgAcc = mockLogs.reduce((acc: number, m: any) => acc + m.accuracy, 0) / mockLogs.length;
      setMetrics(prev => ({ 
        ...prev, 
        avgAccuracy: Math.round(avgAcc),
        mocksCount: mockLogs.length 
      }));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <Sparkles className="w-3 h-3" />
               Command Center
             </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-headline font-black tracking-tight text-foreground">
            Operational <span className="text-primary italic">Terminal</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md font-medium">Real-time performance intelligence for SBI/IBPS PO candidates.</p>
        </div>
      </header>

      {/* Primary Hero Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceOverview />
        </div>
        
        <div className="space-y-8">
          <PersonalBests />
          <CountdownCard />
        </div>

        {/* Intelligence Metrics */}
        <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Preparation</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Syllabus Mastery</div>
            <div className="text-5xl font-headline font-bold tracking-tighter text-foreground">{metrics.syllabusMastery}%</div>
            <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-relaxed">Percentage of sub-topics completed across Reasoning and Quants domains.</p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Precision</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Global Accuracy</div>
            <div className="text-5xl font-headline font-bold tracking-tighter text-foreground">{metrics.avgAccuracy}%</div>
            <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-relaxed">Calculated based on your historical mock logs and archived performance metrics.</p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10 flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-500 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">Endurance</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Mocks Archived</div>
            <div className="text-5xl font-headline font-bold tracking-tighter text-foreground">{metrics.mocksCount}</div>
            <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-relaxed">Total count of standardized mock tests successfully logged in your terminal.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <AdaptiveToDo />
        </div>
        <div className="space-y-8">
          <QuoteCard />
          <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 flex flex-col justify-center items-center text-center space-y-4">
             <BrainCircuit className="w-12 h-12 text-primary opacity-20" />
             <h3 className="text-xl font-headline font-bold">Operational Status</h3>
             <p className="text-sm text-muted-foreground max-w-xs font-medium">Your preparation intensity is currently ranked as <span className="text-primary font-bold">Tier 1 Elite</span>. Focus on DI speed today.</p>
          </div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-border/40 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-primary" />
           </div>
           <span className="font-headline font-bold text-foreground">Elite Performance Intelligence</span>
        </div>
        <p className="font-medium font-body">&copy; 2024 Dipanshu's Elite. Engineered for the 1%.</p>
      </footer>
    </div>
  );
}
