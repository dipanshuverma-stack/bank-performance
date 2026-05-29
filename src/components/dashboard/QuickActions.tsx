"use client";

import { useState } from "react";
import { Plus, Trophy, Timer, AlertOctagon, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { name: "Log New Mock", href: "/mocks", icon: Trophy, color: "text-primary bg-primary/10" },
    { name: "Start Session", href: "/accuracy", icon: Timer, color: "text-indigo-500 bg-indigo-500/10" },
    { name: "Add Mistake", href: "/mistakes", icon: AlertOctagon, color: "text-destructive bg-destructive/10" },
    { name: "Update Syllabus", href: "/syllabus", icon: Target, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50 flex flex-col items-end gap-2">
      {/* Speed Dial Actions */}
      <div
        className={cn(
          "flex flex-col items-end gap-2 transition-all duration-300 origin-bottom scale-75 opacity-0 pointer-events-none mb-1",
          isOpen && "scale-100 opacity-100 pointer-events-auto"
        )}
      >
        {actions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 bg-card border border-border/80 shadow-2xl px-4 py-2.5 rounded-2xl hover:bg-accent transition-all hover:-translate-y-0.5 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
              {action.name}
            </span>
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", action.color)}>
              <action.icon className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Primary Toggle Floating Action Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl shadow-primary/30 bg-primary text-primary-foreground transition-all duration-300",
          isOpen ? "bg-slate-900 text-white dark:bg-white dark:text-black rotate-45" : "hover:scale-105"
        )}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Dimmed backdrop click-away anchor */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-black/5 dark:bg-black/20 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
