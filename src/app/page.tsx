
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1 w-8 bg-primary rounded-full" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Operational Readiness</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            Hello, <span className="text-primary italic">Dipanshu</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md font-medium">Your analytics suggest high cognitive load readiness. Focus on Quants today.</p>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformanceOverview />
        </div>
        
        <CountdownCard />
        
        <div className="space-y-8">
          <QuoteCard />
          <div className="p-8 rounded-3xl bg-card border-2 border-dashed border-border/60 flex items-center justify-between shadow-sm group hover:border-primary/40 transition-all">
             <div>
               <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Improved Accuracy</div>
               <div className="text-4xl font-headline font-bold tracking-tighter text-foreground">+12.5%</div>
             </div>
             <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
               <Activity className="w-7 h-7" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <AdaptiveToDo />
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-primary" />
           </div>
           <span className="font-headline font-bold text-foreground">Elite Performance</span>
        </div>
        <p className="font-medium">&copy; 2024 Dipanshu's Elite. Engineered for the 1%.</p>
      </footer>
    </div>
  );
}
