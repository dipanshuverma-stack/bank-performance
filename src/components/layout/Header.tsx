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
  Calendar,
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
      case "/": return "Overview";
      case "/mocks": return "Mock Analytics";
      case "/accuracy": return "Accuracy Console";
      case "/syllabus": return "Syllabus Roadmap";
      case "/mistakes": return "Mistake Journal";
      case "/profile": return "Profile Settings";
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
            "rounded-2xl relative border border-border/60 hover:bg-accent transition-all group overflow-visible",
            isMobile ? 'h-10 w-10' : 'h-12 w-12',
            unreadCount > 0 && "neon-glow ring-2 ring-primary/40 scale-105"
          )}
        >
          <Bell className={cn(
            isMobile ? 'w-4 h-4' : 'w-5 h-5',
            "text-foreground group-hover:rotate-12 transition-transform",
            unreadCount > 0 && "animate-pulse text-primary"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive items-center justify-center text-[8px] font-black text-white">
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] md:w-96 p-0 rounded-3xl border-none shadow-2xl bg-card z-[100] mt-4" align="end">
        <div className="p-5 border-b border-border/50 flex items-center justify-between bg-accent/5 rounded-t-3xl">
          <div className="flex flex-col">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Operational Alerts</h4>
            <span className="text-[9px] font-bold text-muted-foreground uppercase">{unreadCount} New Signals Found</span>
          </div>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-[10px] h-8 px-3 font-black uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl">
              Purge All
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border/30">
              {notifications.map((n) => (
                <div key={n.id} className={cn(
                  "p-5 group relative hover:bg-accent/30 transition-all duration-300",
                  !n.read && "bg-primary/[0.03] border-l-4 border-l-primary"
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                      n.type === 'achievement' ? 'bg-primary/10 text-primary' : 
                      n.type === 'alert' ? 'bg-destructive/10 text-destructive' : 'bg-indigo-500/10 text-indigo-500'
                    )}>
                      {n.type === 'achievement' ? <Trophy className="w-5 h-5" /> : 
                       n.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="text-sm font-bold text-foreground mb-1 leading-tight">{n.title}</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed font-medium">{n.description}</div>
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
                    className="absolute top-5 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center p-10 text-center text-muted-foreground/20">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">Silence in the Vault</p>
              <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">All operational systems are clear</p>
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
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-headline font-black text-lg text-foreground tracking-tighter">Elite<span className="text-primary italic">Perf</span></span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationPopover isMobile={true} />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] p-0 border-r-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access all features of the Elite Performance Terminal</SheetDescription>
              </SheetHeader>
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
                      { name: "Syllabus", href: "/syllabus", icon: BookOpen },
                      { name: "Journal", href: "/mistakes", icon: AlertCircle }
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

      {/* Desktop Global Navigation */}
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
            
            <NotificationPopover />
            
            <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:translate-y-0">
               <Link href="/mocks">Quick Log</Link>
            </Button>
         </div>
      </header>
    </>
  );
}
