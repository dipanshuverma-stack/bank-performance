"use client";

import Link from "next/link";
import { 
  Activity, 
  Menu, 
  Search, 
  Bell, 
  LayoutDashboard, 
  Trophy, 
  Timer as TimerIcon, 
  BookOpen,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch(pathname) {
      case "/": return "Overview";
      case "/mocks": return "Mock Analytics";
      case "/accuracy": return "Accuracy Console";
      case "/syllabus": return "Syllabus Roadmap";
      default: return "Dashboard";
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-headline font-black text-lg text-foreground tracking-tighter">Elite<span className="text-primary italic">Perf</span></span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] p-0 border-r-0">
               <div className="flex flex-col h-full p-8 bg-card">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl">
                      <Activity className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-headline font-black text-2xl block text-foreground tracking-tight">Elite Perf</span>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Aspirant Terminal</span>
                    </div>
                  </div>
                  <nav className="flex-1 space-y-4">
                    {[
                      { name: "Overview", href: "/", icon: LayoutDashboard },
                      { name: "Mocks", href: "/mocks", icon: Trophy },
                      { name: "Console", href: "/accuracy", icon: TimerIcon },
                      { name: "Syllabus", href: "/syllabus", icon: BookOpen }
                    ].map((item) => (
                      <Button 
                        key={item.name}
                        variant="ghost" 
                        asChild 
                        className={pathname === item.href ? "w-full justify-start text-primary bg-primary/5 h-14 text-lg font-bold rounded-2xl" : "w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl"}
                      >
                        <Link href={item.href}><item.icon className="w-6 h-6 mr-4" /> {item.name}</Link>
                      </Button>
                    ))}
                  </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Global Navigation / Control Bar */}
      <header className="hidden md:flex items-center justify-between px-8 lg:px-14 py-8 bg-background/50 backdrop-blur-md sticky top-0 z-40">
         <div className="flex items-center gap-8">
            <div className="flex flex-col">
               <h2 className="text-2xl font-headline font-black tracking-tight text-foreground">{getPageTitle()}</h2>
               <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active Core Terminal</span>
               </div>
            </div>
            
            <div className="hidden lg:flex items-center bg-card/80 border rounded-[1.25rem] px-5 py-3 shadow-sm focus-within:ring-2 ring-primary/20 transition-all border-border/60">
              <Search className="w-4 h-4 text-muted-foreground mr-3" />
              <input placeholder="Search performance logs..." className="bg-transparent border-none outline-none text-sm w-40 lg:w-64 font-bold text-foreground placeholder:text-muted-foreground/60" />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
               <Sparkles className="w-3.5 h-3.5 text-primary" />
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Operational Ready</span>
            </div>
            
            <ThemeToggle />
            
            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 relative border border-border/60 hover:bg-accent transition-all group">
               <Bell className="w-5 h-5 text-foreground group-hover:rotate-12 transition-transform" />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background shadow-lg shadow-destructive/20" />
            </Button>
            
            <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:translate-y-0">
               <Link href="/mocks">Quick Log</Link>
            </Button>
         </div>
      </header>
    </>
  );
}