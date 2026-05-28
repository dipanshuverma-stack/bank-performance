
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
  BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <>
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
                      <Link href="/"><LayoutDashboard className="w-6 h-6 mr-4" /> Overview</Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl">
                      <Link href="/mocks"><Trophy className="w-6 h-6 mr-4" /> Mocks</Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl">
                      <Link href="/accuracy"><TimerIcon className="w-6 h-6 mr-4" /> Console</Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground h-14 text-lg font-semibold rounded-2xl">
                      <Link href="/syllabus"><BookOpen className="w-6 h-6 mr-4" /> Syllabus</Link>
                    </Button>
                  </nav>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop/Common Header Tools */}
      <header className="hidden md:flex items-center justify-between px-14 py-6 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
         <div className="flex items-center bg-card border rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <input placeholder="Search metrics..." className="bg-transparent border-none outline-none text-sm w-40 lg:w-56 font-bold text-foreground placeholder:text-muted-foreground" />
         </div>
         <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 relative border-2 hover:bg-accent transition-all">
               <Bell className="w-5 h-5 text-foreground" />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
            </Button>
            <Button asChild className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 md:px-8 shadow-lg shadow-primary/20 font-bold tracking-tight cursor-pointer">
               <Link href="/mocks">Mock Connect</Link>
            </Button>
         </div>
      </header>
    </>
  );
}
