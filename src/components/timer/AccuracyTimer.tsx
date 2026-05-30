"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RotateCcw, Save, Trash2, BookOpen, Timer as TimerIcon, Zap, Clock, Play, Pause, Activity, Target, ShieldCheck
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { doc, setDoc, deleteDoc, collection, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface AccuracyLog {
  id: string;
  subject: string;
  topic: string;
  time: number;
  date: string;
  correct?: number;
  wrong?: number;
}

export function AccuracyTimer() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [localLogs, setLocalLogs] = useState<AccuracyLog[]>([]);
  
  // Tactical State
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, 'users', user.uid, 'accuracyLogs'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);
  
  const { data: cloudLogs } = useCollection<AccuracyLog>(logsQuery);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("accuracy-logs");
    if (saved) {
      try { setLocalLogs(JSON.parse(saved)); } catch (e) { console.warn("Local logs parse failure"); }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const displayLogs = (user && cloudLogs && cloudLogs.length > 0) ? cloudLogs : localLogs;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSaveLog = async () => {
    if (time < 10) {
      toast({ variant: "destructive", title: "Operational Fault", description: "Practice unit too short to be archived (minimum 10s required)." });
      return;
    }
    if (!currentTopic.trim()) {
      toast({ variant: "destructive", title: "Metadata Missing", description: "Objective topic is required for archival." });
      return;
    }
    
    const newLog: AccuracyLog = {
      id: Date.now().toString(),
      subject: currentSubject,
      topic: currentTopic,
      time: time,
      date: new Date().toLocaleDateString(),
      correct: correct ? parseInt(correct) : undefined,
      wrong: wrong ? parseInt(wrong) : undefined,
    };
    
    const updated = [newLog, ...localLogs];
    setLocalLogs(updated);
    localStorage.setItem("accuracy-logs", JSON.stringify(updated));

    if (user && db) {
      try {
        const logRef = doc(db, 'users', user.uid, 'accuracyLogs', newLog.id);
        await setDoc(logRef, { ...newLog, serverTimestamp: new Date() }, { merge: true });
        toast({ title: "Session Archived", description: "Practice unit secured in Hybrid Vault." });
      } catch (err: any) {
        toast({ variant: "destructive", title: "Sync Error", description: err.message });
      }
    }

    logAuditAction("Performance", "Practice Archived", `${currentTopic} - ${formatTime(time)} recorded.`);
    
    // Reset Controls
    setTime(0); setIsActive(false); setCurrentTopic(""); setCorrect(""); setWrong("");
  };

  const deleteLog = async (id: string) => {
    const updated = localLogs.filter(l => l.id !== id);
    setLocalLogs(updated);
    localStorage.setItem("accuracy-logs", JSON.stringify(updated));

    if (user && db) {
      try {
        const logRef = doc(db, 'users', user.uid, 'accuracyLogs', id);
        await deleteDoc(logRef);
      } catch (err) {}
    }
    logAuditAction("Performance", "Log Purged", "Practice unit removed from archives.");
    toast({ title: "Log Purged", description: "Record removed from vault." });
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-14 pb-24">
      <Card className="xl:col-span-4 bento-card border-none shadow-2xl bg-card/60 backdrop-blur-3xl h-fit xl:sticky xl:top-32">
        <CardHeader className="bg-primary/5 p-6 border-b border-border/40">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                <TimerIcon className="w-6 h-6" />
             </div>
             <div>
                <CardTitle className="text-2xl font-headline font-black tracking-tight">Console</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-80 mt-1">Status: {isActive ? "Recording" : "Standby"}</div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 space-y-8">
          <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-white/5 rounded-[2.5rem] shadow-inner border border-white/5 relative overflow-hidden group">
             <div className="text-7xl font-headline font-black text-foreground tracking-tighter tabular-nums mb-6 relative z-10 transition-transform duration-500 group-hover:scale-105">
               {formatTime(time)}
             </div>
             <div className="flex items-center gap-3 px-6 py-2 bg-accent/40 rounded-full border border-white/10 relative z-10">
                <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]' : 'bg-muted-foreground'}`} />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isActive ? "Executing Protocol" : "Idle State"}</span>
             </div>
             <Activity className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-primary/5 rotate-12 transition-transform duration-1000 group-hover:scale-110" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Category</label>
              <Select value={currentSubject} onValueChange={setCurrentSubject}>
                <SelectTrigger className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="Reasoning" className="font-bold">Reasoning</SelectItem>
                  <SelectItem value="Quants" className="font-bold">Quantitative Aptitude</SelectItem>
                  <SelectItem value="English" className="font-bold">English Language</SelectItem>
                  <SelectItem value="GA" className="font-bold">General Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Objective Topic</label>
              <Input 
                placeholder="e.g. Circular Arrangement Set 1" 
                value={currentTopic} 
                onChange={(e) => setCurrentTopic(e.target.value)} 
                className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-success ml-1">Correct Hits</label>
                <Input 
                  type="number"
                  placeholder="Optional" 
                  value={correct} 
                  onChange={(e) => setCorrect(e.target.value)} 
                  className="rounded-2xl h-14 bg-success/5 border-2 border-success/10 font-bold text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-destructive ml-1">Errors</label>
                <Input 
                  type="number"
                  placeholder="Optional" 
                  value={wrong} 
                  onChange={(e) => setWrong(e.target.value)} 
                  className="rounded-2xl h-14 bg-destructive/5 border-2 border-destructive/10 font-bold text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <Button 
                onClick={() => setIsActive(!isActive)}
                className={`flex-1 h-16 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 border-none ${isActive ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
             >
                <div className="flex items-center justify-center gap-3">
                  {isActive ? <><Pause className="w-5 h-5 fill-current" /> Stop Session</> : <><Play className="w-5 h-5 fill-current" /> Start Unit</>}
                </div>
             </Button>
             <Button 
                variant="outline"
                onClick={() => {setIsActive(false); setTime(0);}}
                className="w-16 h-16 rounded-[1.5rem] border-2 border-border/60 hover:bg-accent transition-all shrink-0 active:rotate-180"
             >
                <RotateCcw className="w-6 h-6 text-muted-foreground" />
             </Button>
          </div>

          <Button 
            onClick={handleSaveLog}
            className="w-full h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            <Save className="w-5 h-5 mr-3" /> Archive Practice Unit
          </Button>
        </CardContent>
      </Card>

      <Card className="xl:col-span-8 bento-card border-none shadow-2xl bg-card/40 backdrop-blur-3xl overflow-hidden">
        <CardHeader className="bg-accent/5 p-6 lg:p-8 border-b border-border/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <BookOpen className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-2xl font-headline font-black tracking-tight">Archives</CardTitle>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 mt-1">Operational History: {displayLogs.length} Records</div>
               </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/20 shadow-sm">
               <Zap className="w-4 h-4 text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Optimization Protocol Active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 lg:p-10">
          {displayLogs.length > 0 ? (
            <div className="space-y-4">
              {displayLogs.map((log) => {
                const total = (log.correct || 0) + (log.wrong || 0);
                const accuracy = total > 0 ? Math.round((log.correct! / total) * 100) : null;
                
                return (
                  <div key={log.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] border-2 border-border/40 bg-card hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-xl">
                    <div className="flex items-center gap-6 mb-6 md:mb-0">
                      <div className={`w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 shrink-0 shadow-inner ${log.subject === 'Quants' ? 'text-blue-500' : 'text-purple-500'}`}>
                        {log.subject === 'Quants' ? <Zap className="w-8 h-8 fill-current" /> : <BookOpen className="w-8 h-8 fill-current" />}
                      </div>
                      <div>
                        <div className="font-black text-xl tracking-tight text-foreground leading-tight">{log.topic}</div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-accent/40 px-3 py-1 rounded-lg border border-border/40">{log.date}</span>
                          <span className="text-[10px] text-primary font-black uppercase tracking-widest h-6 flex items-center px-3 bg-primary/5 rounded-lg border border-primary/10">{log.subject}</span>
                          {accuracy !== null && (
                            <div className="flex items-center gap-2">
                               <ShieldCheck className={`w-4 h-4 ${accuracy >= 85 ? 'text-emerald-500' : 'text-orange-500'}`} />
                               <span className={`text-[10px] font-black uppercase tracking-widest ${accuracy >= 85 ? 'text-emerald-500' : 'text-orange-500'}`}>
                                 {accuracy}% Precision
                               </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="w-6 h-6 opacity-40 animate-pulse" />
                          <span className="font-headline font-black text-4xl tracking-tighter tabular-nums leading-none">{formatTime(log.time)}</span>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2 opacity-50">Operational Time</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteLog(log.id)} 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-12 w-12 transition-all rounded-2xl hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center">
               <div className="w-24 h-24 rounded-[2.5rem] bg-accent/20 flex items-center justify-center mb-10 opacity-30 shadow-inner">
                 <TimerIcon className="w-10 h-10" />
               </div>
               <p className="text-[12px] font-black uppercase tracking-[0.6em] text-muted-foreground/30">Vault Segment Empty</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20 mt-4 max-w-xs leading-relaxed">Archive a practice unit to begin long-term performance tracking.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
