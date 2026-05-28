import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { CountdownCard } from "@/components/dashboard/CountdownCard";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { AdaptiveToDo } from "@/components/dashboard/AdaptiveToDo";
import { AccuracyTimer } from "@/components/timer/AccuracyTimer";
import { SyllabusTracker } from "@/components/syllabus/SyllabusTracker";
import { 
  LayoutDashboard, 
  Timer as TimerIcon, 
  BookOpen, 
  Settings,
  Bell,
  Search,
  User,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col p-4 md:p-6 transition-all">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Activity className="w-6 h-6" />
          </div>
          <span className="hidden lg:block font-headline font-bold text-xl tracking-tighter text-slate-900">
            Elite Performance
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-primary bg-primary/5 font-semibold">
            <LayoutDashboard className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-50">
            <TimerIcon className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Accuracy Timer</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-50">
            <BookOpen className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Syllabus</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-50">
            <Settings className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:block">Settings</span>
          </Button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-full bg-slate-200" />
             <div className="hidden lg:block">
               <div className="text-sm font-bold">Dipanshu</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Aspirant</div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-slate-900">
              Welcome back, <span className="text-primary underline decoration-primary/20">Dipanshu</span>
            </h1>
            <p className="text-slate-500 mt-1">Your preparation trajectory is looking sharp. Keep moving forward.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center bg-white border rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input placeholder="Search metrics..." className="bg-transparent border-none outline-none text-sm w-40" />
             </div>
             <Button variant="outline" size="icon" className="rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
             </Button>
             <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 px-6">
                Connect Mock Test
             </Button>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Row 1 */}
          <PerformanceOverview />
          <CountdownCard />
          
          {/* Row 2 */}
          <div className="lg:col-span-1 space-y-6">
            <QuoteCard />
            <div className="p-6 rounded-2xl bg-white border flex items-center justify-between">
               <div>
                 <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">Total Mocks</div>
                 <div className="text-3xl font-headline font-bold">42</div>
               </div>
               <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Activity className="w-6 h-6" />
               </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <AdaptiveToDo />
          </div>
        </div>

        {/* Feature Sections */}
        <section className="space-y-12">
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold">Accuracy Console</h2>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Precision Mapping Tool</div>
             </div>
             <AccuracyTimer />
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold">Adda247 Syllabus Roadmap</h2>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Curriculum Mastery Tracker</div>
             </div>
             <SyllabusTracker />
          </div>
        </section>

        <footer className="mt-20 pt-10 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Dipanshu's Performance Elite. Built for peak examination performance.</p>
        </footer>
      </main>
    </div>
  );
}
