"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Timer, BookOpen, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Mocks", href: "/mocks", icon: Trophy },
    { name: "Timer", href: "/accuracy", icon: Timer },
    { name: "Mistakes", href: "/mistakes", icon: AlertCircle },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-lg border-t border-border/40 px-6 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground"
              )}
              style={{ touchAction: 'manipulation' }}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
              {isActive && <div className="w-1 h-1 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
