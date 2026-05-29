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
    <div className="space-y-16 pb-32">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 px-2">
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-4">
             <div className="h-2 w-12 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.6)]" />
             <span className="text-xs text-primary font-black uppercase tracking-[0.5em] flex items-center gap-3">
               <Sparkles className="w-4 h-4 animate-pulse" />
               Operational Terminal V3.0
             </span>
          </div>
          <h1 className="text-5xl md:text-8xl xl:text-9xl font-headline font-black tracking-tighter text-foreground leading-[0.9]">
            {profile?.name ? `Elite, ${profile.name}` : "Operational"} <br />
            <span className="text-primary italic">Intelligence</span>
          </h1>
          <div className="flex flex-wrap items-center gap-5 mt-10">
              <Badge variant="outline" className="text-xs text-primary border-primary/30 px-8 py-3 rounded-full font-black uppercase bg-primary/5 shadow-md">
                {profile?.targetExam || "SBI PO"}
              </Badge>
              {metrics.daysLeft > 0 && (
                <div className="flex items-center gap-3 text-xs text-indigo-500 font-bold bg-indigo-500/5 px-8 py-3 rounded-full border border-indigo-500/20 backdrop-blur-xl shadow-md">
                  <Calendar className="w-5 h-5" />
                  {metrics.daysLeft} Days to Objective
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-emerald-500 font-bold bg-emerald-500/5 px-8 py-3 rounded-full border border-emerald-500/20 backdrop-blur-xl shadow-md">
                <Wifi className="w-5 h-5 animate-pulse" />
                Uplink Active
              </div>
          </div>
        </div>

        <div className="flex items-center gap-10 bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 shadow-2xl hover:border-primary/40 transition-all group xl:min-w-[450px]">
           <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-700 shrink-0 shadow-inner">
             <Activity className="w-12 h-12" />
           </div>
           <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Global Accuracy</div>
              <div className="text-5xl xl:text-6xl font-headline font-black tracking-tighter text-foreground">{metrics.avgAccuracy}%</div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" /> High Performance Protocol
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16">
        <div className="xl:col-span-8 space-y-16">
          <PerformanceOverview />
          
          <div className="space-y-10">
            <div className="flex items-center justify-between px-6">
              <h3 className="text-3xl xl:text-4xl font-headline font-black flex items-center gap-6 tracking-tight">
                <BrainCircuit className="w-10 h-10 text-primary" />
                Strategic Intelligence
              </h3>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-14 h-14 rounded-3xl border-2 hover:bg-primary/5 transition-all shadow-lg" 
                  onClick={() => intelApi?.scrollPrev()}
                >
                  <ChevronLeft className="w-7 h-7" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-14 h-14 rounded-3xl border-2 hover:bg-primary/5 transition-all shadow-lg" 
                  onClick={() => intelApi?.scrollNext()}
                >
                  <ChevronRight className="w-7 h-7" />
                </Button>
              </div>
            </div>

            <Carousel 
              setApi={setIntelApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-10 flex items-stretch">
                <CarouselItem className="pl-10 basis-[95%] md:basis-[600px] flex">
                  <AiInsightsPanel className="h-full w-full min-h-[480px]" />
                </CarouselItem>
                <CarouselItem className="pl-10 basis-[95%] md:basis-[600px] flex">
                  <ReadinessScore className="h-full w-full min-h-[480px]" />
                </CarouselItem>
                <CarouselItem className="pl-10 basis-[95%] md:basis-[600px] flex">
                  <QuoteCard className="h-full w-full min-h-[480px]" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-16">
            <AdaptiveToDo />
            <div className="space-y-12">
               <div className="p-14 rounded-[4rem] bg-indigo-600 text-white relative overflow-hidden group hover:scale-[1.03] transition-all duration-700 shadow-2xl shadow-indigo-500/40 border border-white/20">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white shadow-xl border border-white/30">
                      <Zap className="w-12 h-12 animate-pulse" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs font-black uppercase px-6 py-2 backdrop-blur-md">Active Streak</Badge>
                  </div>
                  <h3 className="text-4xl font-headline font-black mb-6 tracking-tight">Consistency Engine</h3>
                  <p className="text-lg text-indigo-100 leading-relaxed mb-10 font-medium opacity-95 max-w-md">Maintain Elite Momentum. Complete your daily accuracy units to secure candidate status.</p>
                  <div className="space-y-5">
                    <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-inner">
                       <div className="h-full w-[85%] bg-white animate-pulse shadow-[0_0_20px_white]" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                      <span className="opacity-70">Strategic Progress</span>
                      <span className="text-white">85% Complete</span>
                    </div>
                  </div>
                </div>
                <Activity className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12 group-hover:scale-125 transition-transform duration-1000" />
              </div>
              <PersonalBests />
            </div>
          </div>
        </div>
        
        <div className="xl:col-span-4 space-y-16">
          <CountdownCard />
          
          <div className="p-14 rounded-[4.5rem] bg-slate-900 border border-white/10 relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-4 h-4 rounded-full bg-primary animate-ping" />
                <div className="text-xs font-black text-primary uppercase tracking-[0.5em]">Operational Mastery</div>
              </div>
              <h3 className="text-4xl font-headline font-black text-white mb-14 tracking-tight">Status <span className="text-primary italic">Matrix</span></h3>
              <div className="space-y-14">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Syllabus Saturation</span>
                    <span className="text-4xl font-headline font-black text-white">{metrics.syllabusMastery}%</span>
                  </div>
                  <div className="h-5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_30px_rgba(var(--primary),0.8)]" style={{ width: `${metrics.syllabusMastery}%` }} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Objective Readiness</span>
                    <span className="text-4xl font-headline font-black text-white">{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_30px_rgba(16,185,129,0.8)]" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-20 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-8 hover:bg-white/[0.08] transition-all cursor-default group/milestone shadow-xl">
                 <div className="w-20 h-20 bg-primary/20 rounded-[1.5rem] flex items-center justify-center text-primary group-hover/milestone:scale-110 transition-transform">
                    <Trophy className="w-10 h-10" />
                 </div>
                 <div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Active Milestones</div>
                    <div className="text-2xl font-black text-white tracking-tight">Tier 1 Candidate Status</div>
                 </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-20 -right-20 w-96 h-80 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="p-14 rounded-[4.5rem] bg-card border border-border/60 hover:border-primary/40 transition-all duration-700 group shadow-2xl hover:shadow-primary/5">
             <div className="flex items-center gap-8 mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all duration-500">
                  <Target className="w-10 h-10" />
                </div>
                <div>
                   <h4 className="text-2xl font-headline font-black tracking-tight">Mission Depth</h4>
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{metrics.mocksCount} Units Archived</p>
                </div>
             </div>
             <p className="text-base text-muted-foreground leading-relaxed mb-12 font-medium opacity-90">Analysis suggests a high probability of success for upcoming PO Preliminary missions based on recent Reasoning speed metrics.</p>
             <button className="w-full h-16 rounded-[2rem] bg-accent/50 hover:bg-primary hover:text-primary-foreground transition-all text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group/btn border border-transparent hover:shadow-2xl hover:shadow-primary/30">
                Access Archives <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}