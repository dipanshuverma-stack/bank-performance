import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, ArrowLeft } from "lucide-react";

/**
 * @fileOverview Custom 404 page for the Elite Performance Terminal.
 */

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center space-y-10">
      <div className="w-24 h-24 bg-accent/50 rounded-[2.5rem] flex items-center justify-center text-primary shadow-inner">
        <Map className="w-12 h-12" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tight text-foreground">Mission Out of Bounds</h2>
        <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm md:text-base leading-relaxed">
          The requested coordinate does not exist in the terminal's strategic database. 
          Return to mission control to continue operations.
        </p>
      </div>

      <Button asChild className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
        <Link href="/">
          <ArrowLeft className="w-5 h-5 mr-3" /> Mission Control
        </Link>
      </Button>
    </div>
  );
}
