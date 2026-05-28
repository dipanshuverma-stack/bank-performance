
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
  Trophy
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
  ];

  return (
    <aside className="hidden md:flex w-20 lg:w-72 bg-card border-r flex-col p-6 sticky top-0 h-screen transition-all overflow-y-auto">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/30 shrink-0">
          <Activity className="w-7 h-7" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <span className="font-headline font-extrabold text-xl tracking-tighter text-foreground block truncate">
            Elite Performance
          </span>
          <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Dashboard v1.0</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button 
              key={item.name}
              variant="ghost" 
              asChild 
              className={cn(
                "w-full justify-start font-semibold cursor-pointer h-12 rounded-xl transition-all",
                isActive 
                  ? "text-primary bg-primary/10 font-bold" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon className="w-5 h-5 lg:mr-3" />
                <span className="hidden lg:block">{item.name}</span>
              </Link>
            </Button>
          );
        })}
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent cursor-not-allowed opacity-40 h-12 rounded-xl">
          <Settings className="w-5 h-5 lg:mr-3" />
          <span className="hidden lg:block">Elite Settings</span>
        </Button>
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50">
         <div className="flex items-center justify-between bg-accent/30 p-3 rounded-2xl">
           <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">D</div>
             <div className="hidden lg:block overflow-hidden">
               <div className="text-sm font-bold truncate text-foreground">Dipanshu</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Aspirant</div>
             </div>
           </div>
           <ChevronRight className="w-4 h-4 text-muted-foreground hidden lg:block" />
         </div>
      </div>
    </aside>
  );
}
