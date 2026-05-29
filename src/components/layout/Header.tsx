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
      case "/profile": return "Terminal Settings";
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
            "rounded-[1rem] relative border-2 border-border/40 hover:bg-accent transition-all group overflow-visible shadow-lg hover:shadow-xl",
            isMobile ? 'h-10 w-10' : 'h-12 w-12',
            unreadCount > 0 && "neon-glow ring-2 ring-primary/40 scale-105"
          )}
        >
          <Bell className={cn(
            isMobile ? 'w-4 h-4' : 'w-5 h-5',
            "text-foreground group-hover:rotate-12 transition-transform duration-500",
            unreadCount > 0 && "animate-pulse text-primary"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-destructive items-center justify-center text-[9px] font-black text-white shadow-lg">
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] md:w-[400px] p-0 rounded-[2rem] border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] bg-card z-[100] mt-4" align="end">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-accent/5 rounded-t-[2rem]">
          <div className="flex flex-col gap-0.5">
            <h4 className="text-base font-black uppercase tracking-widest text-foreground leading-none">Alerts</h4>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">{unreadCount} New Signals</span>
          </div>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-[10px] h-8 px-3 font-black uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
              Purge
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border/30">
              {notifications.map((n) => (
                <div key={n.id} className={cn(
                  "p-6 group relative hover:bg-accent/30 transition-all duration-500 cursor-default",
                  !n.read && "bg-primary/[0.04] border-l-4 border-l-primary"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xl transition-transform group-hover:scale-110 duration-500",
                      n.type === 'achievement' ? 'bg-primary/10 text-primary shadow-primary/10' : 
                      n.type === 'alert' ? 'bg-destructive/10 text-destructive shadow-destructive/10' : 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10'
                    )}>
                      {n.type === 'achievement' ? <Trophy className="w-5 h-5" /> : 
                       n.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="text-sm font-black text-foreground mb-1 leading-tight tracking-tight">{n.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed font-medium opacity-90">{n.description}</div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-1 h-1 bg-border rounded-full" />
                        <div className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{n.date}</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="absolute top-6 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg duration-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 opacity-30 shadow-inner">
                <Bell className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-40">Static Silence</p>
              <p className="text-[9px] font-bold uppercase tracking-wider opacity-30">All systems operational</p>
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
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-headline font-black text-xl text-foreground tracking-tighter leading-none">Elite<span className="text-primary italic">Perf</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationPopover isMobile={true} />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-white/5">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] p-0 border-r-0 shadow-2xl">
              <SheetHeader className="sr-only">
                <SheetTitle>Tactical Navigation</SheetTitle>
                <SheetDescription>Access terminal protocols</SheetDescription>
              </SheetHeader>
               <div className="flex flex-col h-full p-8 bg-card">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
                      <Activity className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-headline font-black text-2xl block text-foreground tracking-tight leading-none mb-0.5">Elite Perf</span>
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80">Mission Control</span>
                    </div>
                  </div>
                  <nav className="flex-1 space-y-4">
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
                          "w-full justify-start h-16 text-lg font-black rounded-2xl transition-all duration-500",
                          pathname === item.href ? "text-primary bg-primary/10 border-2 border-primary/20 shadow-lg" : "text-muted-foreground hover:text-foreground"
                        )}
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

      {/* Desktop Global Navigation */}
      <header className="hidden md:flex items-center justify-between px-8 lg:px-14 py-8 bg-background/40 backdrop-blur-3xl sticky top-0 z-40 transition-all border-b border-white/5">
         <div className="flex items-center gap-10">
            <div className="flex flex-col gap-1">
               <h2 className="text-2xl lg:text-3xl font-headline font-black tracking-tight text-foreground leading-none">{getPageTitle()}</h2>
               <div className="flex items-center gap-3 mt-1">
                  <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-60">System Protocol Active</span>
               </div>
            </div>
            
            <div className="hidden xl:flex items-center bg-card/60 border-2 border-border/40 rounded-[1.25rem] px-6 py-3 shadow-inner focus-within:ring-4 ring-primary/10 transition-all group min-w-[320px]">
              <Search className="w-4 h-4 text-muted-foreground mr-4 group-focus-within:text-primary transition-colors" />
              <input placeholder="Search archives..." className="bg-transparent border-none outline-none text-sm w-full font-black text-foreground placeholder:text-muted-foreground/40 placeholder:uppercase placeholder:tracking-widest" />
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3 px-6 py-2.5 bg-primary/5 rounded-[1.25rem] border-2 border-primary/20 shadow-sm">
               <Sparkles className="w-4 h-4 text-primary animate-pulse" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Operational Readiness 98%</span>
            </div>
            
            <ThemeToggle />
            
            <NotificationPopover />
            
            <Button asChild className="rounded-[1.25rem] bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 shadow-2xl shadow-primary/30 font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0 duration-500">
               <Link href="/mocks">Quick Log</Link>
            </Button>
         </div>
      </header>
    </>
  );
}
