"use client";

import { useEffect, useState } from "react";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { 
  Activity, 
  Trophy, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Wifi
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
  }, []);

  useEffect(() => {
    if (!intelApi) return;
    const intervalId = setInterval(() => {
      intelApi.scrollNext();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [intelApi]);

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-24">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 px-2">
        <div className="space-y-4 max-w-3xl min-w-0">
          <div className="flex items-center gap-4">
             <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.4em] flex items-center gap-3">
               <Sparkles className="w-3.5 h-3.5 animate-pulse" />
               Terminal V3.0
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-black tracking-tighter text-foreground leading-[1.1] truncate">
            {profile?.name ? `Elite, ${profile.name}` : "Operational"} <br />
            <span className="text-primary italic">Intelligence</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge variant="outline" className="text-[10px] text-primary border-primary/30 px-4 py-1.5 rounded-full font-black uppercase bg-primary/5">
                {profile?.targetExam || "SBI PO"}
              </Badge>
              {metrics.daysLeft > 0 && (
                <div className="flex items-center gap-2 text-[10px] text-indigo-500 font-bold bg-indigo-500/5 px-4 py-1.5 rounded-full border border-indigo-500/20 backdrop-blur-xl">
                  <Calendar className="w-4 h-4" />
                  {metrics.daysLeft} Days to Objective
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-xl">
                <Wifi className="w-4 h-4 animate-pulse" />
                Uplink Active
              </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl hover:border-primary/40 transition-all group min-w-0 xl:min-w-[320px]">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-700 shrink-0 shadow-inner">
             <Activity className="w-6 h-6" />
           </div>
           <div className="space-y-0.5 min-w-0">
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Global Accuracy</div>
              <div className="text-3xl md:text-4xl font-headline font-black tracking-tighter text-foreground">{metrics.avgAccuracy}%</div>
              <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3 h-3 animate-pulse" /> High Performance
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-8 space-y-10 min-w-0">
          <PerformanceOverview />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl lg:text-2xl font-headline font-black flex items-center gap-3 tracking-tight">
                <BrainCircuit className="w-6 h-6 text-primary" />
                Strategic Intelligence
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-9 h-9 rounded-xl border-2 hover:bg-primary/5 transition-all shadow-md" 
                  onClick={() => intelApi?.scrollPrev()}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-9 h-9 rounded-xl border-2 hover:bg-primary/5 transition-all shadow-md" 
                  onClick={() => intelApi?.scrollNext()}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Carousel 
              setApi={setIntelApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 flex items-stretch">
                <CarouselItem className="pl-4 basis-[90%] md:basis-1/2 flex min-w-0">
                  <AiInsightsPanel className="h-full w-full min-h-[380px]" />
                </CarouselItem>
                <CarouselItem className="pl-4 basis-[90%] md:basis-1/2 flex min-w-0">
                  <ReadinessScore className="h-full w-full min-h-[380px]" />
                </CarouselItem>
                <CarouselItem className="pl-4 basis-[90%] md:basis-1/2 flex min-w-0">
                  <QuoteCard className="h-full w-full min-h-[380px]" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
            <AdaptiveToDo />
            <div className="space-y-8 flex flex-col min-w-0">
               <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group hover:scale-[1.01] transition-all duration-700 shadow-2xl shadow-indigo-500/30 border border-white/10 flex-1 min-h-[300px]">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white border border-white/30">
                      <Zap className="w-6 h-6 animate-pulse" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-[8px] font-black uppercase px-3 py-1 backdrop-blur-md">Active Streak</Badge>
                  </div>
                  <h3 className="text-2xl font-headline font-black mb-3 tracking-tight">Consistency Engine</h3>
                  <p className="text-xs text-indigo-100 leading-relaxed mb-6 font-medium opacity-90 max-w-[240px]">Maintain Elite Momentum. Complete units to secure status.</p>
                  <div className="space-y-3">
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-inner">
                       <div className="h-full w-[85%] bg-white shadow-[0_0_10px_white]" />
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                      <span className="opacity-70">Progress</span>
                      <span className="text-white">85% Complete</span>
                    </div>
                  </div>
                </div>
                <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <PersonalBests />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-10 min-w-0">
          <CountdownCard />
          
          <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Operational Mastery</div>
              </div>
              <h3 className="text-2xl font-headline font-black text-white mb-8 tracking-tight">Status Matrix</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Saturation</span>
                    <span className="text-2xl font-headline font-black text-white">{metrics.syllabusMastery}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.6)]" style={{ width: `${metrics.syllabusMastery}%` }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Readiness</span>
                    <span className="text-2xl font-headline font-black text-white">{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.6)]" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/[0.08] transition-all group/milestone">
                 <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover/milestone:scale-105 transition-transform">
                    <Trophy className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Current Rank</div>
                    <div className="text-lg font-black text-white tracking-tight">Tier 1 Candidate</div>
                 </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-12 -right-12 w-48 h-48 text-white/5 rotate-12" />
          </div>

          <div className="p-8 rounded-[2.5rem] bg-card border border-border/60 hover:border-primary/40 transition-all duration-700 group shadow-2xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-lg font-headline font-black tracking-tight">Mission Depth</h4>
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{metrics.mocksCount} Units Archived</p>
                </div>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed mb-8 font-medium opacity-90">Analysis suggests high success probability based on recent metrics.</p>
             <button className="w-full h-12 rounded-xl bg-accent/50 hover:bg-primary hover:text-primary-foreground transition-all text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 group/btn border border-transparent hover:shadow-xl hover:shadow-primary/20">
                Access Archives <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
