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
  Sparkles,
  Trash2,
  AlertCircle,
  X,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'achievement' | 'alert' | 'reminder';
  read: boolean;
}

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setMounted(true);
    const loadNotifications = () => {
      const saved = localStorage.getItem("elite-notifications");
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse notifications");
        }
      }
    };

    loadNotifications();
    window.addEventListener('storage', loadNotifications);
    window.addEventListener('elite-new-notification', loadNotifications);
    
    return () => {
      window.removeEventListener('storage', loadNotifications);
      window.removeEventListener('elite-new-notification', loadNotifications);
    };
  }, []);

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem("elite-notifications", JSON.stringify(newNotifications));
  };

  const markAllAsRead = () => {
    const hasUnread = notifications.some(n => !n.read);
    if (!hasUnread) return;
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    switch(pathname) {
      case "/": return "Command Overview";
      case "/mocks": return "Mission Analytics";
      case "/accuracy": return "Precision Console";
      case "/syllabus": return "Knowledge Roadmap";
      case "/mistakes": return "Tactical Journal";
      case "/profile": return "Core Terminal Settings";
      default: return "Dashboard";
    }
  };

  const NotificationPopover = ({ isMobile = false }) => (
    <Popover onOpenChange={(open) => open && markAllAsRead()}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={cn(
            "rounded-[1.25rem] relative border-2 border-border/40 hover:bg-accent transition-all group overflow-visible shadow-lg hover:shadow-xl",
            isMobile ? 'h-12 w-12' : 'h-16 w-16',
            unreadCount > 0 && "neon-glow ring-2 ring-primary/40 scale-105"
          )}
        >
          <Bell className={cn(
            isMobile ? 'w-5 h-5' : 'w-7 h-7',
            "text-foreground group-hover:rotate-12 transition-transform duration-500",
            unreadCount > 0 && "animate-pulse text-primary"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-destructive items-center justify-center text-[10px] font-black text-white shadow-lg">
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] md:w-[450px] p-0 rounded-[2.5rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] bg-card z-[100] mt-6" align="end">
        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-accent/5 rounded-t-[2.5rem]">
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-black uppercase tracking-widest text-foreground leading-none">Operational Alerts</h4>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{unreadCount} New Signals Archived</span>
          </div>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-[11px] h-10 px-4 font-black uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
              Purge Logs
            </Button>
          )}
        </div>
        <ScrollArea className="h-[500px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border/30">
              {notifications.map((n) => (
                <div key={n.id} className={cn(
                  "p-8 group relative hover:bg-accent/30 transition-all duration-500 cursor-default",
                  !n.read && "bg-primary/[0.04] border-l-4 border-l-primary"
                )}>
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl transition-transform group-hover:scale-110 duration-500",
                      n.type === 'achievement' ? 'bg-primary/10 text-primary shadow-primary/10' : 
                      n.type === 'alert' ? 'bg-destructive/10 text-destructive shadow-destructive/10' : 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10'
                    )}>
                      {n.type === 'achievement' ? <Trophy className="w-7 h-7" /> : 
                       n.type === 'alert' ? <AlertCircle className="w-7 h-7" /> : <Zap className="w-7 h-7" />}
                    </div>
                    <div className="flex-1 pr-8">
                      <div className="text-base font-black text-foreground mb-2 leading-tight tracking-tight">{n.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed font-medium opacity-90">{n.description}</div>
                      <div className="flex items-center gap-3 mt-5">
                        <div className="w-1.5 h-1.5 bg-border rounded-full" />
                        <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{n.date}</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="absolute top-8 right-6 h-10 w-10 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl duration-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-6 opacity-30 shadow-inner">
                <Bell className="w-10 h-10" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-2 opacity-40">Static Silence</p>
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-30">All systems operational and clear</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-6 bg-card border-b sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
            <Activity className="w-7 h-7" />
          </div>
          <span className="font-headline font-black text-2xl text-foreground tracking-tighter leading-none">Elite<span className="text-primary italic">Perf</span></span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationPopover isMobile={true} />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 hover:bg-white/5">
                <Menu className="w-8 h-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] p-0 border-r-0 shadow-2xl">
              <SheetHeader className="sr-only">
                <SheetTitle>Tactical Navigation</SheetTitle>
                <SheetDescription>Access terminal protocols</SheetDescription>
              </SheetHeader>
               <div className="flex flex-col h-full p-10 bg-card">
                  <div className="flex items-center gap-6 mb-16">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
                      <Activity className="w-9 h-9" />
                    </div>
                    <div>
                      <span className="font-headline font-black text-3xl block text-foreground tracking-tight leading-none mb-1">Elite Perf</span>
                      <span className="text-xs text-primary font-black uppercase tracking-widest opacity-80">Mission Control</span>
                    </div>
                  </div>
                  <nav className="flex-1 space-y-6">
                    {[
                      { name: "Overview", href: "/", icon: LayoutDashboard },
                      { name: "Mocks", href: "/mocks", icon: Trophy },
                      { name: "Console", href: "/accuracy", icon: TimerIcon },
                      { name: "Syllabus", href: "/syllabus", icon: BookOpen },
                      { name: "Journal", href: "/mistakes", icon: AlertCircle }
                    ].map((item) => (
                      <Button 
                        key={item.name}
                        variant="ghost" 
                        asChild 
                        className={cn(
                          "w-full justify-start h-20 text-xl font-black rounded-3xl transition-all duration-500",
                          pathname === item.href ? "text-primary bg-primary/10 border-2 border-primary/20 shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link href={item.href}><item.icon className="w-8 h-8 mr-6" /> {item.name}</Link>
                      </Button>
                    ))}
                  </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Global Navigation */}
      <header className="hidden md:flex items-center justify-between px-10 xl:px-16 py-12 bg-background/40 backdrop-blur-3xl sticky top-0 z-40 transition-all border-b border-white/5">
         <div className="flex items-center gap-12">
            <div className="flex flex-col gap-2">
               <h2 className="text-4xl xl:text-5xl font-headline font-black tracking-tight text-foreground leading-none">{getPageTitle()}</h2>
               <div className="flex items-center gap-4 mt-2">
                  <div className="h-1.5 w-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)]" />
                  <span className="text-xs text-muted-foreground font-black uppercase tracking-[0.4em] opacity-60">System Protocol Active</span>
               </div>
            </div>
            
            <div className="hidden xl:flex items-center bg-card/60 border-2 border-border/40 rounded-[1.75rem] px-8 py-4 shadow-inner focus-within:ring-4 ring-primary/10 transition-all group min-w-[400px]">
              <Search className="w-5 h-5 text-muted-foreground mr-5 group-focus-within:text-primary transition-colors" />
              <input placeholder="Search tactical archives..." className="bg-transparent border-none outline-none text-base w-full font-black text-foreground placeholder:text-muted-foreground/40 placeholder:uppercase placeholder:tracking-widest" />
            </div>
         </div>

         <div className="flex items-center gap-8">
            <div className="hidden xl:flex items-center gap-4 px-8 py-3 bg-primary/5 rounded-[1.5rem] border-2 border-primary/20 shadow-sm">
               <Sparkles className="w-5 h-5 text-primary animate-pulse" />
               <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Operational Readiness 98%</span>
            </div>
            
            <ThemeToggle />
            
            <NotificationPopover />
            
            <Button asChild className="rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 shadow-2xl shadow-primary/30 font-black uppercase text-xs tracking-[0.3em] transition-all hover:-translate-y-1 active:translate-y-0 duration-500">
               <Link href="/mocks">Quick Log Mission</Link>
            </Button>
         </div>
      </header>
    </>
  );
}