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
    <aside className="hidden md:flex w-24 lg:w-72 bg-card/60 backdrop-blur-3xl border-r border-white/5 flex-col p-6 sticky top-0 h-screen transition-all z-40 group">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 shrink-0 transition-transform group-hover:scale-105 duration-700">
          <Activity className="w-7 h-7" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <span className="font-headline font-black text-xl tracking-tighter text-foreground block truncate leading-none mb-1">
            Elite<span className="text-primary italic">Perf</span>
          </span>
          <div className="flex items-center gap-1.5">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">Operational L1</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-6 px-4 hidden lg:block uppercase">Intelligence Command</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button 
              key={item.name}
              variant="ghost" 
              asChild 
              className={cn(
                "w-full justify-start font-black cursor-pointer h-12 rounded-xl transition-all duration-300 px-3 group/item border-2 border-transparent",
                isActive 
                  ? "text-primary bg-primary/10 shadow-lg border-primary/10" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className={cn("w-5 h-5 shrink-0 transition-all duration-500", isActive && "scale-110")} />
                <span className="hidden lg:block ml-3 text-sm tracking-tight">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto hidden lg:block opacity-60 animate-pulse" />}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="hidden lg:block p-6 rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden group/card">
           <BrainCircuit className="w-16 h-16 text-primary/5 absolute -bottom-2 -right-2 transition-transform duration-1000 group-hover/card:scale-125" />
           <div className="relative z-10">
             <div className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1.5">Aspirant Rank</div>
             <div className="text-xl font-headline font-black text-foreground mb-3">Tier 1 Elite</div>
             <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
             </div>
             <div className="flex justify-between items-center mt-2 text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest">
                <span>XP: 2,450</span>
                <span>Tier 2: 3,000</span>
             </div>
           </div>
        </div>

        <Link href="/profile" className="flex items-center justify-between bg-slate-900/40 p-2.5 rounded-2xl border border-white/5 hover:bg-white/5 transition-all group/profile">
           <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-black text-lg shadow-xl shrink-0">D</div>
             <div className="hidden lg:block overflow-hidden">
               <div className="text-sm font-black truncate text-white leading-tight">Profile</div>
               <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-black mt-0.5 opacity-60">System Config</div>
             </div>
           </div>
           <Settings className="w-4 h-4 text-muted-foreground hidden lg:block group-hover/profile:rotate-90 transition-transform duration-700 mr-1" />
         </Link>
      </div>
    </aside>
  );
}
