
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
  X
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
            "rounded-2xl relative border border-border/60 hover:bg-accent transition-all group",
            isMobile ? 'h-10 w-10' : 'h-12 w-12',
            unreadCount > 0 && "neon-glow ring-2 ring-primary/20"
          )}
        >
          <Bell className={cn(
            isMobile ? 'w-4 h-4' : 'w-5 h-5',
            "text-foreground group-hover:rotate-12 transition-transform",
            unreadCount > 0 && "animate-pulse text-primary"
          )} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-3 h-3 bg-destructive rounded-full border-2 border-background shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-bounce" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-3xl border-none shadow-2xl bg-card z-[100] mt-2" align="end">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Operational Alerts</h4>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-[10px] h-7 px-2 font-black uppercase text-muted-foreground hover:text-destructive">
              Clear All
            </Button>
          )}
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border/30">
              {notifications.map((n) => (
                <div key={n.id} className={cn(
                  "p-4 group relative hover:bg-accent/30 transition-colors",
                  !n.read && "bg-primary/5"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                      n.type === 'achievement' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                    )}>
                      {n.type === 'achievement' ? <Trophy className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="text-xs font-bold text-foreground mb-0.5">{n.title}</div>
                      <div className="text-[10px] text-muted-foreground leading-relaxed">{n.description}</div>
                      <div className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest mt-2">{n.date}</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="absolute top-4 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center p-8 text-center text-muted-foreground/20">
              <Bell className="w-12 h-12 mb-3 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">All Systems Clear</p>
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
