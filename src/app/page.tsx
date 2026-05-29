"use client";

import { useEffect, useState } from "react";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { Activity, ShieldCheck, Trophy, Sparkles, BookOpen, AlertCircle, Calendar, ArrowRight, BrainCircuit, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    syllabusMastery: 0,
    avgAccuracy: 0,
    mocksCount: 0,
    daysLeft: 0,
  });

  useEffect(() => {
    setMounted(true);
    
    const savedProfile = localStorage.getItem("elite-user-profile");
    const syllabusSaved = localStorage.getItem("elite-syllabus-v2");
    const mockLogsSaved = localStorage.getItem("elite-mock-logs");

    let days = 0;
    let prof = null;
    if (savedProfile) {
      prof = JSON.parse(savedProfile);
      setProfile(prof);
      if (prof.targetDate) {
        const diff = new Date(prof.targetDate).getTime() - Date.now();
        days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
    }

    let mastery = 0;
    if (syllabusSaved) {
      try {
        const syllabus = JSON.parse(syllabusSaved);
        let total = 0; let done = 0;
        syllabus.forEach((s: any) => s.chapters.forEach((c: any) => c.subtopics.forEach((st: any) => {
          total++; if (st.completed) done++;
        })));
        mastery = total > 0 ? Math.round((done / total) * 100) : 0;
      } catch (e) {}
    }

    let avgAcc = 0;
    let mockCount = 0;
    if (mockLogsSaved) {
      try {
        const mockLogs = JSON.parse(mockLogsSaved);
        if (mockLogs.length > 0) {
          avgAcc = Math.round(mockLogs.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0) / mockLogs.length);
          mockCount = mockLogs.length;
        }
      } catch (e) {}
    }

    setMetrics({
      syllabusMastery: mastery,
      avgAccuracy: avgAcc,
      mocksCount: mockCount,
      daysLeft: days
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <div className="h-1.5 w-8 bg-primary rounded-full" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <Sparkles className="w-3 h-3" />
               Elite Command Terminal
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter text-foreground leading-none">
            {profile?.name ? `Elite, ${profile.name}` : "Operational"} <span className="text-primary italic">Status</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge variant="outline" className="text-[11px] text-primary border-primary/20 px-4 py-1.5 rounded-full font-black uppercase bg-primary/5">
                {profile?.targetExam || "SBI PO"}
              </Badge>
              {metrics.daysLeft > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-indigo-500 font-bold bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/10 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  {metrics.daysLeft} Days to Objective
                </div>
              )}
              <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-bold bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4" />
                System Active
              </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-card/40 backdrop-blur-xl border rounded-[2rem] p-6 shadow-2xl hover:border-primary/30 transition-all group lg:min-w-[320px]">
           <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
             <Activity className="w-8 h-8" />
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Global Accuracy</div>
              <div className="text-3xl font-headline font-black tracking-tighter">{metrics.avgAccuracy}%</div>
              <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3" /> High Performance
              </div>
           </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Intelligence & Primary Metrics */}
        <div className="lg:col-span-8 space-y-8">
          <PerformanceOverview />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold font-headline flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" />
                Strategic Intelligence
              </h3>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Swipe to Browse <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </div>
            {/* Fluid Snap Row for Intelligence Modules */}
            <div className="swipe-row">
              <div className="swipe-item w-[88%] md:w-[480px]">
                <AiInsightsPanel />
              </div>
              <div className="swipe-item w-[88%] md:w-[480px]">
                <ReadinessScore />
              </div>
              <div className="swipe-item w-[88%] md:w-[480px]">
                <QuoteCard />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdaptiveToDo />
            <div className="space-y-8">
               <div className="p-10 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <Zap className="w-8 h-8" />
                    </div>
                    <Badge className="bg-white/20 text-white border-none text-[10px] font-black uppercase">Active Streak</Badge>
                  </div>
                  <h3 className="text-2xl font-headline font-black mb-3">Consistency Protocol</h3>
                  <p className="text-sm text-indigo-100 leading-relaxed mb-6 font-medium">Your current momentum is high. Complete one focused precision unit today to maintain Elite Status.</p>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                     <div className="h-full w-[85%] bg-white animate-pulse" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Progress: 85%</div>
                </div>
                <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12" />
              </div>
              <PersonalBests />
            </div>
          </div>
        </div>
        
        {/* Right Column - Schedule & Milestones */}
        <div className="lg:col-span-4 space-y-8">
          <CountdownCard />
          
          <div className="p-10 rounded-[3rem] bg-slate-900 border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <div className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Operational Mastery</div>
              </div>
              <h3 className="text-2xl font-headline font-black text-white mb-8">Performance <span className="text-primary">Matrix</span></h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Syllabus Saturation</span>
                    <span className="text-2xl font-headline font-black text-white">{metrics.syllabusMastery}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]" style={{ width: `${metrics.syllabusMastery}%` }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Objective Readiness</span>
                    <span className="text-2xl font-headline font-black text-white">{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Trophy className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Milestones</div>
                    <div className="text-sm font-bold text-white">Tier 2 Candidate Status</div>
                 </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="p-8 rounded-[3rem] bg-card border border-border/40 hover:border-primary/30 transition-all duration-500 group shadow-lg">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-lg font-bold font-headline">Operational Depth</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{metrics.mocksCount} Missions Archived</p>
                </div>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">Your historical data suggests a 14% improvement in Reasoning speed over the last 15 days.</p>
             <button className="w-full h-12 rounded-2xl bg-accent/50 hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
                View Full Logs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>

      {/* Footer Metrics Snap Row */}
      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-bold font-headline px-2 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Readiness Architecture
        </h3>
        <div className="swipe-row">
          {[
            { label: "Syllabus Mastery", val: `${metrics.syllabusMastery}%`, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10", desc: "Adda247 Matrix Progress" },
            { label: "Global Accuracy", val: `${metrics.avgAccuracy}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "All-time Precision Score" },
            { label: "Mocks Archived", val: metrics.mocksCount, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Operational Units Completed" },
          ].map((item, i) => (
            <div key={i} className="swipe-item w-[85%] md:w-1/3 p-10 rounded-[3rem] bg-card border border-border/40 group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-primary/5">
              <div className="flex justify-between items-start mb-6">
                 <div className={cn("p-4 rounded-[1.25rem] transition-transform duration-500 group-hover:scale-110", item.bg)}>
                   <item.icon className={cn("w-8 h-8", item.color)} />
                 </div>
                 <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.label}</div>
              </div>
              <div className="text-5xl font-headline font-black tracking-tighter text-foreground mb-2">{item.val}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}