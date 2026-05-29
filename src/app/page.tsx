"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { SubjectWisePerformance } from "@/components/dashboard/SubjectWisePerformance";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { 
  Activity, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Trophy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    syllabusMastery: 0,
    avgAccuracy: 0,
    mocksCount: 0,
    daysLeft: 0,
  });

  const [intelApi, setIntelApi] = useState<CarouselApi>();

  useEffect(() => {
    setMounted(true);
    
    // Performance optimization: batch reads from localStorage
    const loadTelemetry = () => {
      const savedProfile = localStorage.getItem("elite-user-profile");
      const syllabusSaved = localStorage.getItem("elite-syllabus-v2");
      const mockLogsSaved = localStorage.getItem("elite-mock-logs");

      let days = 0;
      if (savedProfile) {
        try {
          const prof = JSON.parse(savedProfile);
          setProfile(prof);
          if (prof.targetDate) {
            const diff = new Date(prof.targetDate).getTime() - Date.now();
            days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
          }
        } catch(e) {}
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
    };

    loadTelemetry();
    window.addEventListener('storage', loadTelemetry);
    return () => window.removeEventListener('storage', loadTelemetry);
  }, []);

  useEffect(() => {
    if (!intelApi) return;
    const intervalId = setInterval(() => {
      intelApi.scrollNext();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [intelApi]);

  if (!mounted) return (
    <div className="space-y-8 py-10">
      <Skeleton className="h-20 w-3/4 bg-card" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-8 h-[500px] bg-card rounded-[2rem]" />
        <Skeleton className="lg:col-span-4 h-[500px] bg-card rounded-[2rem]" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div className="space-y-3 max-w-3xl min-w-0">
          <div className="flex items-center gap-3">
             <div className="h-1 w-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
             <span className="text-[9px] text-primary font-black uppercase tracking-[0.3em] flex items-center gap-2">
               <Sparkles className="w-3 h-3 animate-pulse" />
               Terminal V3.0
             </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-foreground leading-[1.1] truncate">
            {profile?.name ? `Elite, ${profile.name}` : "Operational"} <br />
            <span className="text-primary italic">Intelligence</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-[9px] text-primary border-primary/30 px-3 py-1 rounded-full font-black uppercase bg-primary/5">
                {profile?.targetExam || "SBI PO"}
              </Badge>
              {metrics.daysLeft > 0 && (
                <div className="flex items-center gap-1.5 text-[9px] text-indigo-500 font-bold bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/20 backdrop-blur-xl">
                  <Calendar className="w-3.5 h-3.5" />
                  {metrics.daysLeft}d to Goal
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-bold bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-xl">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                Live Sync
              </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-card/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-xl hover:border-primary/40 transition-all group min-w-0 xl:min-w-[280px]">
           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-all duration-700 shrink-0 shadow-inner">
             <Activity className="w-5 h-5" />
           </div>
           <div className="space-y-0 min-w-0">
              <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Global Accuracy</div>
              <div className="text-2xl md:text-3xl font-headline font-black tracking-tighter text-foreground">{metrics.avgAccuracy}%</div>
              <div className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 animate-pulse" /> High Precision
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-8 min-w-0">
          <PerformanceOverview />
          
          <SubjectWisePerformance />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg lg:text-xl font-headline font-black flex items-center gap-2.5 tracking-tight">
                <BrainCircuit className="w-5 h-5 text-primary" />
                Strategic Intelligence
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg border hover:bg-primary/5 shadow-sm" 
                  onClick={() => intelApi?.scrollPrev()}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg border hover:bg-primary/5 shadow-sm" 
                  onClick={() => intelApi?.scrollNext()}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <Carousel 
              setApi={setIntelApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                <CarouselItem className="pl-4 md:basis-1/2 flex min-w-0">
                 <AiInsightsPanel className="w-full min-h-[320px]" />
                </CarouselItem>
                <CarouselItem className="pl-4 md:basis-1/2 flex min-w-0">
                  <ReadinessScore className="w-full min-h-[320px]" />
                </CarouselItem>
                <CarouselItem className="pl-4 md:basis-1/2 flex min-w-0">
                  <QuoteCard className="w-full min-h-[320px]" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 min-w-0">
            <AdaptiveToDo />
            <div className="space-y-6 flex flex-col min-w-0">
               <div className="p-6 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden group hover:scale-[1.01] transition-all duration-700 shadow-xl border border-white/10 flex-1 min-h-[200px]">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white border border-white/30">
                      <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-[7px] font-black uppercase px-2 py-0.5 backdrop-blur-md">Active Streak</Badge>
                  </div>
                  <h3 className="text-xl font-headline font-black mb-1 tracking-tight">Consistency Engine</h3>
                  <p className="text-[10px] text-indigo-100 leading-relaxed mb-4 font-medium opacity-90 max-w-[200px]">Maintain Elite Momentum. Complete units to secure status.</p>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <div className="h-full w-[85%] bg-white shadow-[0_0_10px_white]" />
                    </div>
                    <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest">
                      <span className="opacity-70">Progress</span>
                      <span className="text-white">85% Complete</span>
                    </div>
                  </div>
                </div>
                <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <PersonalBests />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-8 min-w-0">
          <CountdownCard />
          
          <div className="p-6 rounded-[2rem] bg-slate-900 border border-white/10 relative overflow-hidden group shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Operational Mastery</div>
              </div>
              <h3 className="text-xl font-headline font-black text-white mb-6 tracking-tight">Status Matrix</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Saturation</span>
                    <span className="text-xl font-headline font-black text-white">{metrics.syllabusMastery}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.6)]" style={{ width: `${metrics.syllabusMastery}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Readiness</span>
                    <span className="text-xl font-headline font-black text-white">{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.6)]" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/[0.08] transition-all group/milestone">
                 <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover/milestone:scale-105 transition-transform">
                    <Trophy className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Current Rank</div>
                    <div className="text-base font-black text-white tracking-tight">Tier 1 Candidate</div>
                 </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 rotate-12" />
          </div>

          <div className="p-6 rounded-[2rem] bg-card border border-border/60 hover:border-primary/40 transition-all duration-700 group shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-base font-headline font-black tracking-tight">Mission Depth</h4>
                   <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{metrics.mocksCount} Units Archived</p>
                </div>
             </div>
             <p className="text-[10px] text-muted-foreground leading-relaxed mb-6 font-medium opacity-90">Analysis suggests high success probability based on recent metrics.</p>
             <Link href="/mocks" className="block w-full">
              <button className="w-full h-11 rounded-xl bg-accent/50 hover:bg-primary hover:text-primary-foreground transition-all text-[8px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 group/btn border border-transparent hover:shadow-lg">
                  Access Archives <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}