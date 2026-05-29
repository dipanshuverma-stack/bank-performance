"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Timer as TimerIcon, 
  BookOpen, 
  Settings,
  Activity,
  ChevronRight,
  Trophy,
  BrainCircuit,
  AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Mock Analytics", href: "/mocks", icon: Trophy },
    { name: "Accuracy Console", href: "/accuracy", icon: TimerIcon },
    { name: "Syllabus Roadmap", href: "/syllabus", icon: BookOpen },
    { name: "Mistake Journal", href: "/mistakes", icon: AlertOctagon },
  ];

  return (
    <aside className="hidden md:flex w-24 lg:w-96 bg-card/60 backdrop-blur-3xl border-r border-white/5 flex-col p-10 sticky top-0 h-screen transition-all z-40 group">
      <div className="flex items-center gap-6 mb-20 px-4">
        <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/50 shrink-0 transition-transform group-hover:scale-105 duration-700">
          <Activity className="w-12 h-12" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <span className="font-headline font-black text-4xl tracking-tighter text-foreground block truncate leading-none mb-1">
            Elite<span className="text-primary italic">Perf</span>
          </span>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
             <span className="text-[11px] text-primary font-black uppercase tracking-[0.3em]">Operational Level 1</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-5">
        <div className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-10 px-6 hidden lg:block">Intelligence Command</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button 
              key={item.name}
              variant="ghost" 
              asChild 
              className={cn(
                "w-full justify-start font-black cursor-pointer h-18 rounded-3xl transition-all duration-500 px-6 py-8 group/item border-2 border-transparent",
                isActive 
                  ? "text-primary bg-primary/10 shadow-xl border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/5"
              )}
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className={cn("w-7 h-7 shrink-0 transition-all duration-500", isActive && "scale-110 shadow-primary")} />
                <span className="hidden lg:block ml-6 text-base tracking-tight">{item.name}</span>
                {isActive && <ChevronRight className="w-5 h-5 ml-auto hidden lg:block opacity-60 animate-pulse" />}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-10">
        <div className="hidden lg:block p-10 rounded-[3rem] bg-primary/5 border border-primary/10 relative overflow-hidden group/card shadow-2xl">
           <BrainCircuit className="w-24 h-24 text-primary/5 absolute -bottom-4 -right-4 transition-transform duration-1000 group-hover/card:scale-125" />
           <div className="relative z-10">
             <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3">Aspirant Rank</div>
             <div className="text-3xl font-headline font-black text-foreground mb-6">Tier 1 Elite</div>
             <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                <div className="h-full w-2/3 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
             </div>
             <div className="flex justify-between items-center mt-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                <span>XP: 2,450</span>
                <span>Next: Tier 2</span>
             </div>
           </div>
        </div>

        <Link href="/profile" className="flex items-center justify-between bg-slate-900/40 p-4 rounded-[2.5rem] border border-white/5 hover:bg-white/5 transition-all group/profile shadow-xl">
           <div className="flex items-center gap-5 overflow-hidden">
             <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-black text-2xl shadow-2xl shrink-0 group-hover/profile:scale-110 transition-transform duration-700">D</div>
             <div className="hidden lg:block overflow-hidden">
               <div className="text-lg font-black truncate text-white leading-tight">User Profile</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1 opacity-60 group-hover/profile:opacity-100 transition-opacity">System Config</div>
             </div>
           </div>
           <Settings className="w-6 h-6 text-muted-foreground hidden lg:block group-hover/profile:rotate-180 transition-transform duration-1000 mr-2" />
         </Link>
      </div>
    </aside>
  );
}