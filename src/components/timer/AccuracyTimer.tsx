"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RotateCcw, Save, Trash2, BookOpen, Timer as TimerIcon, Zap, Clock, Play, Pause, Activity, ShieldCheck
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/firebase";
import { useRealtimeCollection } from "@/hooks/use-database";
import { DatabaseService } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { orderBy } from "firebase/firestore";

export function AccuracyTimer() {
  const { toast } = useToast();
  const user = useUser();
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: logs, loading } = useRealtimeCollection('accuracyLogs', [orderBy('createdAt', 'desc')]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSaveLog = async () => {
    if (!user) return;
    if (time < 5) {
      toast({ variant: "destructive", title: "Invalid Session", description: "Unit too short to archive." });
      return;
    }
    if (!currentTopic.trim()) {
      toast({ variant: "destructive", title: "Metadata Missing", description: "Topic is required." });
      return;
    }
    
    try {
      await DatabaseService.save(user.uid, 'accuracyLogs', {
        subject: currentSubject,
        topic: currentTopic,
        time: time,
        correct: correct ? parseInt(correct) : 0,
        wrong: wrong ? parseInt(wrong) : 0,
        date: new Date().toLocaleDateString(),
      });
      
      setTime(0); setIsActive(false); setCurrentTopic(""); setCorrect(""); setWrong("");
      toast({ title: "Session Archived", description: "Unit secured in Cloud Vault." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sync Fault", description: err.message });
    }
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <Card className="xl:col-span-4 bento-card bg-card/60 border-white/5 h-fit">
        <CardHeader className="bg-primary/5 border-b border-white/5">
          <CardTitle className="text-xl font-headline font-black flex items-center gap-3">
            <TimerIcon className="w-5 h-5 text-primary" /> Console
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center py-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
             <div className="text-7xl font-headline font-black tracking-tighter tabular-nums mb-4">{formatTime(time)}</div>
             <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-muted-foreground'}`}>
               {isActive ? "Recording Flow" : "Standby"}
             </div>
          </div>

          <div className="space-y-4">
            <Select value={currentSubject} onValueChange={setCurrentSubject}>
              <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-none font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Reasoning">Reasoning</SelectItem>
                <SelectItem value="Quants">Quants</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Topic Designation..." 
              value={currentTopic} 
              onChange={(e) => setCurrentTopic(e.target.value)} 
              className="h-14 rounded-2xl bg-white/5 border-none font-bold"
            />
          </div>

          <div className="flex gap-4">
             <Button onClick={() => setIsActive(!isActive)} className={`flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary'}`}>
                {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />} {isActive ? "Stop" : "Start"}
             </Button>
             <Button variant="outline" onClick={() => {setIsActive(false); setTime(0);}} className="w-16 h-16 rounded-2xl border-white/10"><RotateCcw /></Button>
          </div>

          <Button onClick={handleSaveLog} className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest">
            <Save className="mr-2" /> Archive Unit
          </Button>
        </CardContent>
      </Card>

      <Card className="xl:col-span-8 bento-card bg-card/40 border-white/5 overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5">
          <CardTitle className="text-xl font-headline font-black">Archive Feed</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {logs.map((log: any) => (
              <div key={log.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Activity /></div>
                  <div>
                    <div className="font-black text-lg">{log.topic}</div>
                    <div className="text-[10px] font-black uppercase text-muted-foreground opacity-60 tracking-widest">{log.subject} • {log.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-2xl font-headline font-black tabular-nums">{formatTime(log.time)}</div>
                    <div className="text-[8px] font-black uppercase text-primary tracking-widest">Op Time</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => user && DatabaseService.remove(user.uid, 'accuracyLogs', log.id)} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
            {!loading && logs.length === 0 && (
              <div className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-sm opacity-20">No Units Logged</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
