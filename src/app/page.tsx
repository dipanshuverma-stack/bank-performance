"use client";

import { useEffect, useState, useMemo } from "react";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { PersonalBests } from "@/components/dashboard/PersonalBests";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { Activity, ShieldCheck, Trophy, Sparkles, BookOpen, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    
    // Combined local storage reads for efficiency
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

    // Auto-Welcome Notification logic
    if (!hasSeenWelcome) {
      const savedNotifs = JSON.parse(localStorage.getItem("elite-notifications") || "[]");
      const welcomeNotif = {
        id: "welcome-" + Date.now(),
        title: "Elite Terminal Active",
        description: "System online. Initial diagnostic sequence complete.",
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
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1 w-6 bg-primary rounded-full" />
             <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
               <Sparkles className="w-3 h-3" />
               Strategic Command
             </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tight text-foreground">
            {profile?.name ? `Hello, ${profile.name}` : "Elite Command"} <span className="text-primary italic">Center</span>
          </h1>
          <div className="text-muted-foreground mt-1 max-w-md font-medium">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] text-primary border-primary/20 h-5">{profile?.targetExam || "SBI PO"}</Badge>
              {metrics.daysLeft > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-indigo-500 font-bold">
                  <Calendar className="w-3 h-3" />
                  {metrics.daysLeft}d left
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-2xl p-3 shadow-sm">
           <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Activity className="w-4 h-4" /></div>
           <div className="hidden sm:block">
              <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Readiness</div>
              <div className="text-xs font-bold">{metrics.avgAccuracy}% Accuracy</div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceOverview />
          <AiInsightsPanel />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdaptiveToDo />
            <ReadinessScore />
          </div>
        </div>
        
        <div className="space-y-6">
          <CountdownCard />
          <PersonalBests />
          <QuoteCard />
          
          <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm group hover:border-indigo-500/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Streak</div>
            </div>
            <h3 className="text-base font-bold mb-1">Consistency Check</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">System requires a precision session today to maintain active status.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {[
          { label: "Syllabus Mastery", val: `${metrics.syllabusMastery}%`, icon: BookOpen, color: "text-indigo-500" },
          { label: "Global Accuracy", val: `${metrics.avgAccuracy}%`, icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Mocks Archived", val: metrics.mocksCount, icon: Trophy, color: "text-purple-500" },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-border/40 group transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
               <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">{item.label}</div>
            <div className="text-4xl font-headline font-bold tracking-tighter text-foreground">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
