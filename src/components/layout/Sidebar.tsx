
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
  AlertOctagon,
  UserCircle
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
    <aside className="hidden md:flex w-24 lg:w-80 bg-card/50 backdrop-blur-xl border-r flex-col p-6 sticky top-0 h-screen transition-all z-40 group">
      <div className="flex items-center gap-4 mb-14 px-2">
        <div className="w-14 h-14 bg-primary rounded-[1.25rem] flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 shrink-0 transition-transform group-hover:scale-105">
          <Activity className="w-8 h-8" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <span className="font-headline font-black text-2xl tracking-tighter text-foreground block truncate">
            Elite<span className="text-primary italic">Perf</span>
          </span>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Operational</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-6 px-4 hidden lg:block">Intelligence Command</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button 
              key={item.name}
              variant="ghost" 
              asChild 
              className={cn(
                "w-full justify-start font-bold cursor-pointer h-14 rounded-2xl transition-all duration-300 px-4",
                isActive 
                  ? "text-primary bg-primary/10 shadow-inner border border-primary/10" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon className={cn("w-6 h-6 shrink-0 transition-transform", isActive && "scale-110")} />
                <span className="hidden lg:block ml-4 text-sm tracking-tight">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto hidden lg:block opacity-40" />}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="hidden lg:block p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group/card">
           <BrainCircuit className="w-12 h-12 text-primary/10 absolute -bottom-2 -right-2 transition-transform group-hover/card:scale-110" />
           <div className="relative z-10">
             <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Aspirant Level</div>
             <div className="text-lg font-headline font-bold text-foreground mb-3">Tier 1 Elite</div>
             <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary rounded-full" />
             </div>
           </div>
        </div>

        <Link href="/profile" className="flex items-center justify-between bg-accent/30 p-3 rounded-2xl border border-border/40 hover:bg-accent transition-all group/profile">
           <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-black text-lg shadow-lg shrink-0 group-hover/profile:scale-105 transition-transform">D</div>
             <div className="hidden lg:block overflow-hidden">
               <div className="text-sm font-bold truncate text-foreground">User Profile</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Manage Settings</div>
             </div>
           </div>
           <Settings className="w-4 h-4 text-muted-foreground hidden lg:block group-hover/profile:rotate-90 transition-transform" />
         </Link>
      </div>
    </aside>
  );
}
