import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div className="space-y-4 max-w-3xl">
          <Skeleton className="h-4 w-32 bg-primary/10" />
          <Skeleton className="h-16 w-full max-w-md bg-card" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full bg-card" />
            <Skeleton className="h-6 w-24 rounded-full bg-card" />
          </div>
        </div>
        <Skeleton className="h-24 w-64 rounded-3xl bg-card" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-card" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[320px] rounded-[2.5rem] bg-card" />
            <Skeleton className="h-[320px] rounded-[2.5rem] bg-card" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <Skeleton className="h-[300px] rounded-[2.5rem] bg-card" />
          <Skeleton className="h-[400px] rounded-[2.5rem] bg-card" />
        </div>
      </div>
      
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <Activity className="w-12 h-12 text-primary opacity-20 animate-spin" />
      </div>
    </div>
  );
}
