
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { AccuracyTimer } from "@/components/timer/AccuracyTimer";
import { SyllabusTracker } from "@/components/syllabus/SyllabusTracker";
import { MockTestConsole } from "@/components/dashboard/MockTestConsole";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  Timer as TimerIcon, 
  BookOpen, 
  Settings,
  Bell,
  Search,
  Activity,
  Menu,
  ChevronRight,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation - Desktop */}
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
          <Button variant="ghost" asChild className="w-full justify-start text-primary bg-primary/10 font-bold cursor-pointer h-12 rounded-xl">
            <a href="#dashboard">
              <LayoutDashboard className="w-5 h-5 lg:mr-3" />
              <span className="hidden lg:block">Overview</span>
            </a>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground font-semibold cursor-pointer h-12 rounded-xl">
            <a href="#mock-test-section">
              <Trophy className="w-5 h-5 lg:mr-3" />
              <span className="hidden lg:block">Mock Analytics</span>
            </a>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground font-semibold cursor-pointer h-12 rounded-xl">
            <a href="#timer">
              <TimerIcon className="w-5 h-5 lg:mr-3" />
              <span className="hidden lg:block">Accuracy Console</span>
            </a>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground font-semibold cursor-pointer h-12 rounded-xl">
            <a href="#syllabus">
              <BookOpen className="w-5 h-5 lg:mr-3" />
              <span className="hidden lg:block">Syllabus Roadmap</span>
            </a>
          </Button>
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

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-lg text-foreground">Elite Performance</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-r-0">
               <div className="flex flex-col h-full p-8 bg-card">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-xl">
                      <Activity className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-headline font-extrabold text-xl block text-foreground">Elite Perf</span>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Mobile Nav</span>
                    </div>
                  </div>
                  <nav className="flex-1 space-y-4">
                    <Button variant="ghost" asChild className="w-full justify-start text-primary bg-primary/5 h-14 text-lg font-bold rounded-2xl">
                      <a href="#dashboard"><LayoutDashboard className="w-6 h-6 mr-4" /> Overview</a>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl">
                      <a href="#mock-test-section"><Trophy className="w-6 h-6 mr-4" /> Mocks</a>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl">
                      <a href="#timer"><TimerIcon className="w-6 h-6 mr-4" /> Console</a>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl">
                      <a href="#syllabus"><BookOpen className="w-6 h-6 mr-4" /> Syllabus</a>
                    </Button>
                  </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-14 overflow-y-auto scroll-smooth">
        <header id="dashboard" className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 scroll-mt-24">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="h-1 w-8 bg-primary rounded-full" />
               <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Operational Readiness</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
              Hello, <span className="text-primary italic">Dipanshu</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md font-medium">Your analytics suggest high cognitive load readiness. Focus on Quants today.</p>
          </div>
          
          <div className="flex items-center gap-4 self-end md:self-auto">
             <div className="hidden sm:flex items-center bg-card border rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-muted-foreground mr-3" />
                <input placeholder="Search metrics..." className="bg-transparent border-none outline-none text-sm w-40 lg:w-56 font-bold text-foreground placeholder:text-muted-foreground" />
             </div>
             <div className="hidden md:block">
              <ThemeToggle />
             </div>
             <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 relative border-2 hover:bg-accent transition-all">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
             </Button>
             <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 md:px-8 shadow-lg shadow-primary/20 font-bold tracking-tight cursor-pointer">
                <a href="#mock-test-section">Mock Connect</a>
             </Button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <PerformanceOverview />
          </div>
          
          <CountdownCard />
          
          <div className="space-y-8">
            <QuoteCard />
            <div className="p-8 rounded-3xl bg-card border-2 border-dashed border-border/60 flex items-center justify-between shadow-sm group hover:border-primary/40 transition-all">
               <div>
                 <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Improved Accuracy</div>
                 <div className="text-4xl font-headline font-bold tracking-tighter text-foreground">+12.5%</div>
               </div>
               <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                 <Activity className="w-7 h-7" />
               </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <AdaptiveToDo />
          </div>
        </div>

        {/* Feature Sections */}
        <section className="space-y-24">
          <div id="mock-test-section" className="space-y-8 scroll-mt-28">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">Mock Intelligence</span>
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-foreground">Mock Test Console</h2>
             </div>
             <MockTestConsole />
          </div>

          <div id="timer" className="space-y-8 scroll-mt-28">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">Active Monitoring</span>
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-foreground">Accuracy Console</h2>
             </div>
             <AccuracyTimer />
          </div>

          <div id="syllabus" className="space-y-8 scroll-mt-28 pb-10">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest">Knowledge Matrix</span>
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-foreground">Syllabus Roadmap</h2>
             </div>
             <SyllabusTracker />
          </div>
        </section>

        <footer className="mt-24 pt-12 border-t text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-primary" />
             </div>
             <span className="font-headline font-bold text-foreground">Elite Performance</span>
          </div>
          <p className="font-medium">&copy; 2024 Dipanshu's Elite. Engineered for the 1%.</p>
        </footer>
      </main>
    </div>
  );
}
