import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { Activity, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1 w-8 bg-primary rounded-full" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            Aspirant <span className="text-primary italic">Terminal</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md font-medium">Global performance matrix and real-time intelligence for SBI/IBPS PO candidates.</p>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceOverview />
        </div>
        
        <div className="space-y-8">
          <CountdownCard />
          <QuoteCard />
        </div>

        {/* Secondary Analytics Cluster */}
        <div className="p-8 rounded-[2rem] bg-indigo-50/50 dark:bg-primary/5 border border-indigo-100/50 dark:border-primary/10 flex flex-col justify-between group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-background shadow-sm flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-primary">Status: Active</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Improved Accuracy</div>
            <div className="text-4xl font-headline font-bold tracking-tighter text-foreground">+12.5%</div>
            <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-relaxed">Your accuracy in Reasoning Puzzles has increased significantly over the last 7 days.</p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-emerald-50/50 dark:bg-success/5 border border-emerald-100/50 dark:border-success/10 flex flex-col justify-between group hover:border-success/30 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-background shadow-sm flex items-center justify-center text-success">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-success">Elite Rank</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Global Percentile</div>
            <div className="text-4xl font-headline font-bold tracking-tighter text-foreground">98.2</div>
            <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-relaxed">Based on recent mock scores, you are performing in the top 2% of candidates nationwide.</p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between group hover:border-border transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-background shadow-sm flex items-center justify-center text-foreground">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Session Intensity</div>
            <div className="text-4xl font-headline font-bold tracking-tighter text-foreground">High</div>
            <p className="text-[11px] text-muted-foreground mt-2 font-bold leading-relaxed">Cognitive load readiness is optimal. High-intensity Quants practice is recommended today.</p>
          </div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-primary" />
           </div>
           <span className="font-headline font-bold text-foreground">Elite Performance Intelligence</span>
        </div>
        <p className="font-medium">&copy; 2024 Dipanshu's Elite. Engineered for the 1%.</p>
      </footer>
    </div>
  );
}