
"use client";

import { useEffect, useState } from "react";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { Activity, ShieldCheck, Trophy, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    syllabusMastery: 0,
    avgAccuracy: 0,
    mocksCount: 0,
  });

  useEffect(() => {
    setMounted(true);
    
    // Profile
    const savedProfile = localStorage.getItem("elite-user-profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    // Syllabus
    const syllabusSaved = localStorage.getItem("elite-syllabus-v2");
    if (syllabusSaved) {
      try {
        const syllabus = JSON.parse(syllabusSaved);
        let total = 0; let done = 0;
        syllabus.forEach((s: any) => s.chapters.forEach((c: any) => c.subtopics.forEach((st: any) => {
          total++; if (st.completed) done++;
        })));
        setMetrics(prev => ({ ...prev, syllabusMastery: total > 0 ? Math.round((done / total) * 100) : 0 }));
      } catch (e) {}
    }

    // Mocks
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    if (mockLogs.length > 0) {
      const avgAcc = mockLogs.reduce((acc: number, m: any) => acc + m.accuracy, 0) / mockLogs.length;
      setMetrics(prev => ({ ...prev, avgAccuracy: Math.round(avgAcc), mocksCount: mockLogs.length }));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1 w-8 bg-primary rounded-full" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <Sparkles className="w-3.5 h-3.5" />
               Operational Terminal
             </span>
          </div>
          <h1 className="text-3xl md:text-6xl font-headline font-black tracking-tighter text-foreground">
            {profile?.name ? `Welcome, ${profile.name}` : "Elite Command"} <span className="text-primary italic">Center</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md font-medium">Real-time performance intelligence for <Badge variant="outline" className="text-primary border-primary/20">{profile?.targetExam || "SBI/IBPS PO"}</Badge> candidates.</p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-3xl p-4 shadow-sm">
           <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><Activity className="w-5 h-5" /></div>
           <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Session Status</div>
              <div className="text-sm font-bold">Ready for Deployment</div>
           </div>
        </div>
      </header>

      {/* Hero Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PerformanceOverview />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdaptiveToDo />
            <ReadinessScore />
          </div>
        </div>
        
        <div className="space-y-8">
          <CountdownCard />
          <PersonalBests />
          <QuoteCard />
          
          <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm group hover:border-indigo-500/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Warning</div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Subject Displacement</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">You've studied Reasoning for 85% of your total time this week. Quants readiness is dropping.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>

      {/* Detailed Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
        <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-border/40 group transition-all duration-500">
          <div className="flex justify-between items-start mb-4">
             <BookOpen className="w-6 h-6 text-indigo-500" />
             <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Preparation</div>
          </div>
          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Syllabus Mastery</div>
          <div className="text-5xl font-headline font-bold tracking-tighter text-foreground">{metrics.syllabusMastery}%</div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-border/40 group transition-all duration-500">
          <div className="flex justify-between items-start mb-4">
             <ShieldCheck className="w-6 h-6 text-emerald-500" />
             <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Precision</div>
          </div>
          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Global Accuracy</div>
          <div className="text-5xl font-headline font-bold tracking-tighter text-foreground">{metrics.avgAccuracy}%</div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/[0.02] border border-border/40 group transition-all duration-500">
          <div className="flex justify-between items-start mb-4">
             <Trophy className="w-6 h-6 text-purple-500" />
             <div className="text-[10px] font-black uppercase tracking-widest text-purple-500">Endurance</div>
          </div>
          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Mocks Archived</div>
          <div className="text-5xl font-headline font-bold tracking-tighter text-foreground">{metrics.mocksCount}</div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-border/40 text-center text-sm text-muted-foreground font-medium">
        <p>&copy; 2025 Elite Performance Terminal. Engineered for the Competitive Edge.</p>
      </footer>
    </div>
  );
}
