
import { MockTestConsole } from "@/components/dashboard/MockTestConsole";

export default function MocksPage() {
  return (
    <div className="space-y-8">
       <div className="flex flex-col gap-2">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Mock Intelligence</span>
          <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">Mock Analytics Vault</h2>
          <p className="text-muted-foreground max-w-xl">Deep-dive into your historical performance, analyze subject-wise scores, and identify specific areas of struggle.</p>
       </div>
       <MockTestConsole />
    </div>
  );
}
