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
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  BookOpen, 
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
import { cn } from "@/lib/utils";
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
  const [readinessApi, setReadinessApi] = useState<CarouselApi>();

  useEffect(() => {
    setMounted(true);
    
    const savedProfile = localStorage.getItem("elite-user-profile");
    const syllabusSaved = localStorage.getItem("elite-syllabus-v2");
    const mockLogsSaved = localStorage.getItem("elite-mock-logs");

    let days = 0;
    if (savedProfile) {
      const prof = JSON.parse(savedProfile);
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

  useEffect(() => {
    if (!intelApi) return;
    const intervalId = setInterval(() => {
      intelApi.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [intelApi]);

  useEffect(() => {
    if (!readinessApi) return;
    const intervalId = setInterval(() => {
      readinessApi.scrollNext();
    }, 6000);
    return () => clearInterval(intervalId);
  }, [readinessApi]);

  if (!mounted) return null;

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-1">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.4em] flex items-center gap-2">
               <Sparkles className="w-3.5 h-3.5 animate-pulse" />
               Elite Command Terminal
             </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-headline font-black tracking-tighter text-foreground leading-none">
            {profile?.name ? `Elite, ${profile.name}` : "Operational"} <span className="text-primary italic">Status</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-6">
              <Badge variant="outline" className="text-[11px] text-primary border-primary/20 px-5 py-2 rounded-full font-black uppercase bg-primary/5 shadow-sm">
                {profile?.targetExam || "SBI PO"}
              </Badge>
              {metrics.daysLeft > 0 && (
                <div className="flex items-center gap-2.5 text-[11px] text-indigo-500 font-bold bg-indigo-500/5 px-5 py-2 rounded-full border border-indigo-500/10 backdrop-blur-md shadow-sm">
                  <Calendar className="w-4 h-4" />
                  {metrics.daysLeft} Days to Objective
                </div>
              )}
              <div className="flex items-center gap-2.5 text-[11px] text-emerald-500 font-bold bg-emerald-500/5 px-5 py-2 rounded-full border border-emerald-500/10 backdrop-blur-md shadow-sm">
                <Wifi className="w-4 h-4 animate-pulse" />
                System Active
              </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-card/40 backdrop-blur-2xl border rounded-[2.5rem] p-6 shadow-2xl hover:border-primary/40 transition-all group lg:min-w-[340px] border-white/5">
           <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shrink-0 shadow-inner">
             <Activity className="w-8 h-8" />
           </div>
           <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Global Accuracy</div>
              <div className="text-3xl md:text-4xl font-headline font-black tracking-tighter text-foreground">{metrics.avgAccuracy}%</div>
              <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 animate-pulse" /> High Performance
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-10">
          <PerformanceOverview />
          
          <div className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-headline font-black flex items-center gap-4 tracking-tight">
                <BrainCircuit className="w-7 h-7 text-primary" />
                Strategic Intelligence
              </h3>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-10 h-10 rounded-2xl border-2 hover:bg-primary/5 transition-all" 
                  onClick={() => intelApi?.scrollPrev()}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-10 h-10 rounded-2xl border-2 hover:bg-primary/5 transition-all" 
                  onClick={() => intelApi?.scrollNext()}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <Carousel 
              setApi={setIntelApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-6 flex items-stretch">
                <CarouselItem className="pl-6 basis-[90%] md:basis-[500px] flex">
                  <AiInsightsPanel className="h-full w-full" />
                </CarouselItem>
                <CarouselItem className="pl-6 basis-[90%] md:basis-[500px] flex">
                  <ReadinessScore className="h-full w-full" />
                </CarouselItem>
                <CarouselItem className="pl-6 basis-[90%] md:basis-[500px] flex">
                  <QuoteCard className="h-full w-full" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <AdaptiveToDo />
            <div className="space-y-8 lg:space-y-10">
               <div className="p-10 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-indigo-500/30 border border-white/10">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-lg border border-white/20">
                      <Zap className="w-9 h-9 animate-pulse" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/20 text-[10px] font-black uppercase px-4 py-1.5 backdrop-blur-md">Active Streak</Badge>
                  </div>
                  <h3 className="text-3xl font-headline font-black mb-4 tracking-tight">Consistency Protocol</h3>
                  <p className="text-sm text-indigo-100 leading-relaxed mb-8 font-medium opacity-90">Maintain Elite Momentum. Complete one focused accuracy unit to secure your daily growth milestone.</p>
                  <div className="space-y-3">
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <div className="h-full w-[85%] bg-white animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="opacity-70">Session Progress</span>
                      <span className="text-white">85% Complete</span>
                    </div>
                  </div>
                </div>
                <Activity className="absolute -bottom-10 -right-10 w-56 h-56 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <PersonalBests />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-10">
          <CountdownCard />
          
          <div className="p-10 rounded-[3.5rem] bg-slate-900 border border-white/5 relative overflow-hidden group shadow-2xl shadow-black/20">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <div className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Operational Mastery</div>
              </div>
              <h3 className="text-3xl font-headline font-black text-white mb-10 tracking-tight">Performance <span className="text-primary">Matrix</span></h3>
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Syllabus Saturation</span>
                    <span className="text-3xl font-headline font-black text-white">{metrics.syllabusMastery}%</span>
                  </div>
                  <div className="h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_20px_rgba(var(--primary),0.6)]" style={{ width: `${metrics.syllabusMastery}%` }} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Objective Readiness</span>
                    <span className="text-3xl font-headline font-black text-white">{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.6)]" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-14 p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-5 hover:bg-white/[0.08] transition-all cursor-default group/milestone">
                 <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover/milestone:scale-110 transition-transform">
                    <Trophy className="w-7 h-7" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Milestones</div>
                    <div className="text-base font-bold text-white tracking-tight">Tier 2 Candidate Status</div>
                 </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-10 -right-10 w-56 h-56 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="p-10 rounded-[3.5rem] bg-card border border-border/40 hover:border-primary/40 transition-all duration-500 group shadow-xl hover:shadow-2xl hover:shadow-primary/5">
             <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                   <h4 className="text-xl font-headline font-bold tracking-tight">Operational Depth</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{metrics.mocksCount} Missions Archived</p>
                </div>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-medium opacity-80">Your historical performance suggests a 14% improvement in Reasoning speed over the last 15 days. Protocol maintained.</p>
             <button className="w-full h-14 rounded-2xl bg-accent/50 hover:bg-primary hover:text-primary-foreground transition-all text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group/btn border border-transparent hover:shadow-xl hover:shadow-primary/20">
                View Full Logs <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl font-headline font-black flex items-center gap-4 tracking-tight">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Readiness Architecture
          </h3>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-2xl border-2 hover:bg-primary/5 transition-all" 
              onClick={() => readinessApi?.scrollPrev()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10 rounded-2xl border-2 hover:bg-primary/5 transition-all" 
              onClick={() => readinessApi?.scrollNext()}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Carousel 
          setApi={setReadinessApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-6 pb-6 flex items-stretch">
            {[
              { label: "Syllabus Mastery", val: `${metrics.syllabusMastery}%`, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10", desc: "Adda247 Matrix Progress" },
              { label: "Global Accuracy", val: `${metrics.avgAccuracy}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "All-time Precision Score" },
              { label: "Mocks Archived", val: metrics.mocksCount, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Operational Units Completed" },
            ].map((item, i) => (
              <CarouselItem key={i} className="pl-6 basis-[88%] md:basis-1/3 flex">
                <div className="p-12 rounded-[3.5rem] bg-card border border-border/40 group hover:-translate-y-3 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10 h-full w-full flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className={cn("p-5 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-inner", item.bg)}>
                      <item.icon className={cn("w-9 h-9", item.color)} />
                    </div>
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{item.label}</div>
                  </div>
                  <div className="text-6xl font-headline font-black tracking-tighter text-foreground mb-4">{item.val}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 mt-auto">{item.desc}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}