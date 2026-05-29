
"use client";

import { Plus, Trophy, Timer, AlertOctagon, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="w-14 h-14 rounded-full shadow-2xl shadow-primary/40 bg-primary text-primary-foreground hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-4 rounded-3xl p-2 border-none shadow-2xl min-w-[200px]">
          <DropdownMenuItem asChild className="rounded-2xl h-12 font-bold cursor-pointer">
            <Link href="/mocks" className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-primary" /> Log New Mock
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-2xl h-12 font-bold cursor-pointer">
            <Link href="/accuracy" className="flex items-center gap-3">
              <Timer className="w-4 h-4 text-indigo-500" /> Start Session
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-2xl h-12 font-bold cursor-pointer">
            <Link href="/mistakes" className="flex items-center gap-3">
              <AlertOctagon className="w-4 h-4 text-destructive" /> Add Mistake
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-2xl h-12 font-bold cursor-pointer">
            <Link href="/syllabus" className="flex items-center gap-3">
              <Target className="w-4 h-4 text-emerald-500" /> Update Syllabus
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
