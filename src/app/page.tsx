"use client";

import { useEffect, useState } from "react";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { Activity, ShieldCheck, Trophy, Sparkles, BookOpen, AlertCircle, Calendar, ArrowRight, BrainCircuit } from "lucide-react";
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
    const hasSeenWelcome = localStorage.getItem("elite-welcome-notif");

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
      const mockLogs = JSON.parse(mockLogsSaved);
      if (mockLogs.length > 0) {
        avgAcc = Math.round(mockLogs.reduce((acc: number, m: any) => acc + m.accuracy, 0) / mockLogs.length);
        mockCount = mockLogs.length;
      }
    }

    setMetrics({
      syllabusMastery: mastery,
      avgAccuracy: avgAcc,
      mocksCount: mockCount,
      daysLeft: days
    });

    if (!hasSeenWelcome) {
      const savedNotifs = JSON.parse(localStorage.getItem("elite-notifications") || "[]");
      const welcomeNotif = {
        id: "welcome-" + Date.now(),
        title: "Elite Terminal Active",
        description: "System online. Fluid momentum scrolling enabled.",
        date: new Date().toLocaleDateString(),
        type: 'achievement',
        read: false
      };
      localStorage.setItem("elite-notifications", JSON.stringify([welcomeNotif, ...savedNotifs]));
      localStorage.setItem("elite-welcome-notif", "true");
      window.dispatchEvent(new Event('elite-new-notification'));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1 w-6 bg-primary rounded-full" />
             <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
               <Sparkles className="w-3 h-3" />
               Strategic Command
             </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight text-foreground leading-none">
            {profile?.name ? `Hello, ${profile.name}` : "Elite Command"} <span className="text-primary italic">Center</span>
          </h1>
          <div className="text-muted-foreground mt-3 flex items-center gap-3">
              <Badge variant="outline" className="text-[10px] text-primary border-primary/20 px-3 py-1 rounded-full font-black uppercase">
                {profile?.targetExam || "SBI PO"}
              </Badge>
              {metrics.daysLeft > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-indigo-500 font-bold bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                  <Calendar className="w-3.5 h-3.5" />
                  {metrics.daysLeft} days to objective
                </span>
              )}
          </div>
        </div>
        <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md border rounded-3xl p-4 shadow-sm hover:border-primary/30 transition-all group">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
             <Activity className="w-6 h-6" />
           </div>
           <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Operational Accuracy</div>
              <div className="text-xl font-headline font-black">{metrics.avgAccuracy}%</div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PerformanceOverview />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                Strategic Intelligence
              </h3>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                Swipe to browse <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="swipe-row scrollbar-hide">
              <div className="swipe-item w-[85%] md:w-[480px]">
                <AiInsightsPanel />
              </div>
              <div className="swipe-item w-[85%] md:w-[480px]">
                <ReadinessScore />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdaptiveToDo />
            <div className="space-y-8">
               <QuoteCard />
               <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Streak Monitor</div>
                </div>
                <h3 className="text-lg font-bold mb-2">Consistency Protocol</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">System requires a precision session today to maintain active status and protect your growth momentum.</p>
                <div className="w-full h-1 bg-indigo-500/10 rounded-full overflow-hidden">
                   <div className="h-full w-3/4 bg-indigo-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <CountdownCard />
          <PersonalBests />
          
          <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/5 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Elite Status</div>
              <h3 className="text-xl font-headline font-bold text-white mb-4">Operational Mastery</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Syllabus Completion</span>
                    <span>{metrics.syllabusMastery}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${metrics.syllabusMastery}%` }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Target Readiness</span>
                    <span>{metrics.avgAccuracy}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${metrics.avgAccuracy}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <Trophy className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-bold px-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Global Readiness Matrix
        </h3>
        <div className="swipe-row scrollbar-hide">
          {[
            { label: "Syllabus Mastery", val: `${metrics.syllabusMastery}%`, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { label: "Global Accuracy", val: `${metrics.avgAccuracy}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Mocks Archived", val: metrics.mocksCount, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((item, i) => (
            <div key={i} className="swipe-item w-[80%] md:w-1/3 p-8 rounded-[2.5rem] bg-card border border-border/40 group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className={cn("p-3 rounded-2xl", item.bg)}>
                   <item.icon className={cn("w-6 h-6", item.color)} />
                 </div>
              </div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">{item.label}</div>
              <div className="text-4xl font-headline font-black tracking-tight text-foreground">{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
