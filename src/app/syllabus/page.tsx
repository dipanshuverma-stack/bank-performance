
import { SyllabusTracker } from "@/components/syllabus/SyllabusTracker";

export default function SyllabusPage() {
  return (
    <div className="space-y-8">
       <div className="flex flex-col gap-2">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Knowledge Matrix</span>
          <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">Syllabus Roadmap</h2>
          <p className="text-muted-foreground max-w-xl">Track your progress against the official Adda247 bank exam syllabus. Complete sub-topics to increase your operational readiness.</p>
       </div>
       <SyllabusTracker />
    </div>
  );
}
