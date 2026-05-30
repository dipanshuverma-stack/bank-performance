"use client";

import { useEffect, useState } from "react";
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
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Trophy,
  Loader2
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
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const [intelApi, setIntelApi] = useState<CarouselApi>();

  // Profile Subscription
  const userRef = useMemoFirebase(() =>  user && db ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: cloudProfile, loading: profileLoading } = useDoc(userRef);

  // Mocks Subscription
  const mocksQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, 'users', user.uid, 'mocks'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);
  const { data: cloudMocks, loading: mocksLoading } = useCollection(mocksQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Metrics Logic
  const metrics = {
    avgAccuracy: cloudMocks && cloudMocks.length > 0 
      ? Math.round(cloudMocks.reduce((acc: number, m: any) => acc + (m.accuracy || 0), 0) / cloudMocks.length) 
      : 0,
    mocksCount: cloudMocks?.length || 0,
  };

  useEffect(() => {
    if (!intelApi) return;
    const intervalId = setInterval(() => {
      intelApi.scrollNext();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [intelApi]);

  if (!mounted || authLoading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary opacity-40" />
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Tactical Data...</span>
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
               Operational L1
             </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-foreground leading-[1.1] truncate">
            {cloudProfile?.profile?.name ? `Elite, ${cloudProfile.profile.name}` : "Operational"} <br />
            <span className="text-primary italic">Intelligence</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-[9px] text-primary border-primary/30 px-3 py-1 rounded-full font-black uppercase bg-primary/5">
                {cloudProfile?.profile?.targetExam || "SBI PO"}
              </Badge>
              <div className="flex items-center gap-1.5 text-[9px] font-bold px-3 py-1 rounded-full border backdrop-blur-xl text-emerald-500 bg-emerald-500/5 border-emerald-500/20">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                Cloud Link Stable
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
                <Zap className="w-2.5 h-2.5 animate-pulse" /> Precision Peak
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-4 min-w-0 h-full"><CountdownCard /></div>
        <div className="lg:col-span-8 min-w-0 h-full"><QuoteCard className="h-full" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-8 min-w-0">
          <PerformanceOverview />
          <SubjectWisePerformance />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg lg:text-xl font-headline font-black flex items-center gap-2.5 tracking-tight"><BrainCircuit className="w-5 h-5 text-primary" />Strategic Intelligence</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border" onClick={() => intelApi?.scrollPrev()}><ChevronLeft className="w-3.5 h-3.5" /></Button>
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border" onClick={() => intelApi?.scrollNext()}><ChevronRight className="w-3.5 h-3.5" /></Button>
              </div>
            </div>

            <Carousel setApi={setIntelApi} opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                <CarouselItem className="pl-4 md:basis-1/2 flex min-w-0"><AiInsightsPanel className="w-full min-h-[320px]" /></CarouselItem>
                <CarouselItem className="pl-4 md:basis-1/2 flex min-w-0"><ReadinessScore className="w-full min-h-[320px]" /></CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 min-w-0">
            <AdaptiveToDo />
            <div className="space-y-6 flex flex-col min-w-0">
               <div className="p-6 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden group hover:scale-[1.01] transition-all duration-700 shadow-xl border border-white/10 flex-1 min-h-[200px]">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white border border-white/30"><Zap className="w-5 h-5 animate-pulse" /></div>
                    <Badge className="bg-white/20 text-white border-white/30 text-[7px] font-black uppercase px-2 py-0.5 backdrop-blur-md">Active Streak</Badge>
                  </div>
                  <h3 className="text-xl font-headline font-black mb-1 tracking-tight">Consistency Engine</h3>
                  <p className="text-[10px] text-indigo-100 leading-relaxed mb-4 font-medium opacity-90 max-w-[200px]">Maintain Elite Momentum.</p>
                  <div className="space-y-2"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5"><div className="h-full w-[85%] bg-white shadow-[0_0_10px_white]" /></div></div>
                </div>
                <Activity className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
              </div>
              <PersonalBests />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-8 min-w-0">
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
                    <span className="text-xl font-headline font-black text-white">{cloudProfile?.mastery || 0}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.6)]" style={{ width: `${cloudProfile?.mastery || 0}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Readiness</span>
                    <span className="text-xl font-headline font-black text-white">{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.6)]" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 rotate-12" />
          </div>

          <div className="p-6 rounded-[2rem] bg-card border border-border/60 hover:border-primary/40 transition-all duration-700 group shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Target className="w-5 h-5" /></div>
                <div>
                   <h4 className="text-base font-headline font-black tracking-tight">Mission Depth</h4>
                   <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{metrics.mocksCount} Units Archived</p>
                </div>
             </div>
             <Link href="/mocks" className="block w-full">
              <button className="w-full h-11 rounded-xl bg-accent/50 hover:bg-primary hover:text-primary-foreground transition-all text-[8px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 group/btn border border-transparent">Access Archives <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" /></button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
