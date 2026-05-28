
import { AccuracyTimer } from "@/components/timer/AccuracyTimer";

export default function AccuracyPage() {
  return (
    <div className="space-y-8">
       <div className="flex flex-col gap-2">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Active Monitoring</span>
          <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">Accuracy Console</h2>
          <p className="text-muted-foreground max-w-xl">Track your solving speed and precision in real-time. Use the precision console to archive focused study units.</p>
       </div>
       <AccuracyTimer />
    </div>
  );
}
