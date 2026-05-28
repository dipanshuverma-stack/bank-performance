import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { AccuracyTimer } from "@/components/timer/AccuracyTimer";
import { SyllabusTracker } from "@/components/syllabus/SyllabusTracker";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  Timer as TimerIcon, 
  BookOpen, 
  Settings,
  Bell,
  Search,
  Activity,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex w-20 lg:w-64 bg-card border-r flex-col p-6 sticky top-0 h-screen transition-all overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <span className="hidden lg:block font-headline font-bold text-xl tracking-tighter text-foreground truncate">
            Elite Performance
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-primary bg-primary/5 font-semibold">
            <LayoutDashboard className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent">
            <TimerIcon className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Accuracy Timer</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent">
            <BookOpen className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Syllabus</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent">
            <Settings className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Settings</span>
          </Button>
        </nav>

        <div className="mt-auto pt-6 border-t">
           <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
             <div className="hidden lg:block overflow-hidden">
               <div className="text-sm font-bold truncate">Dipanshu</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Aspirant</div>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-lg">Elite</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
               <div className="flex flex-col h-full p-6 bg-card">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="font-headline font-bold text-xl">Elite Perf</span>
                  </div>
                  <nav className="flex-1 space-y-4">
                    <Button variant="ghost" className="w-full justify-start text-primary bg-primary/5">
                      <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      <TimerIcon className="w-5 h-5 mr-3" /> Timer
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      <BookOpen className="w-5 h-5 mr-3" /> Syllabus
                    </Button>
                  </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-4xl font-headline font-bold tracking-tight text-foreground">
              Welcome back, <span className="text-primary underline decoration-primary/20">Dipanshu</span>
            </h1>
            <p className="text-muted-foreground mt-1">Your preparation trajectory is looking sharp.</p>
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
             <div className="hidden sm:flex items-center bg-card border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input placeholder="Search metrics..." className="bg-transparent border-none outline-none text-sm w-32 lg:w-40" />
             </div>
             <div className="hidden md:block">
              <ThemeToggle />
             </div>
             <Button variant="outline" size="icon" className="rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
             </Button>
             <Button className="rounded-xl bg-primary hover:bg-primary/90 px-4 md:px-6">
                Mock Connect
             </Button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Performance Overview (Takes 2 cols on desktop) */}
          <div className="lg:col-span-2">
            <PerformanceOverview />
          </div>
          
          {/* Countdown Card */}
          <CountdownCard />
          
          {/* Motivational and Mini Stats */}
          <div className="space-y-6">
            <QuoteCard />
            <div className="p-6 rounded-2xl bg-card border flex items-center justify-between shadow-sm">
               <div>
                 <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Mocks</div>
                 <div className="text-3xl font-headline font-bold">42</div>
               </div>
               <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                 <Activity className="w-6 h-6" />
               </div>
            </div>
          </div>

          {/* Adaptive To-Do (Takes 2 cols on desktop) */}
          <div className="lg:col-span-2">
            <AdaptiveToDo />
          </div>
        </div>

        {/* Feature Sections */}
        <section className="space-y-16">
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-headline font-bold">Accuracy Console</h2>
                <div className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Precision Mapping</div>
             </div>
             <AccuracyTimer />
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-headline font-bold">Syllabus Roadmap</h2>
                <div className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest">Mastery Tracker</div>
             </div>
             <SyllabusTracker />
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Dipanshu's Elite. Built for peak performance.</p>
        </footer>
      </main>
    </div>
  );
}
