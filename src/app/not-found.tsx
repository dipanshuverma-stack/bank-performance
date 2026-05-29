'use client';

import Link from "next/link";
import { Map, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center space-y-10">
      <div className="w-24 h-24 bg-accent/50 rounded-[2.5rem] flex items-center justify-center text-primary border border-border/40">
        <Map className="w-12 h-12" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-4xl font-headline font-black tracking-tight text-foreground">Out of Bounds</h2>
        <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm">
          The requested coordinate does not exist in the strategic database. 
        </p>
      </div>

      <Button asChild className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20">
        <Link href="/">
          <ArrowLeft className="w-5 h-5 mr-2" /> Mission Control
        </Link>
      </Button>
    </div>
  );
}
