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

  // Using simple touch handling to avoid 300ms delay and hold-triggers
  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-[100] flex flex-col items-end gap-3">
      {/* Speed Dial Actions */}
      <div
        className={cn(
          "flex flex-col items-end gap-3 transition-all duration-200 origin-bottom scale-90 opacity-0 pointer-events-none",
          isOpen && "scale-100 opacity-100 pointer-events-auto"
        )}
      >
        {actions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 bg-card border border-border/80 shadow-2xl px-5 py-3 rounded-2xl hover:bg-accent transition-all active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
              {action.name}
            </span>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", action.color)}>
              <action.icon className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Primary Toggle Floating Action Button */}
      <Button
        onPointerDown={handleToggle}
        size="icon"
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl bg-primary text-primary-foreground transition-all duration-300 z-[101] shadow-primary/30",
          isOpen ? "bg-slate-900 text-white dark:bg-white dark:text-black rotate-45" : "hover:scale-105"
        )}
      >
        <Plus className="w-7 h-7" />
      </Button>

      {/* Simplified backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-[2px]"
          onPointerDown={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}