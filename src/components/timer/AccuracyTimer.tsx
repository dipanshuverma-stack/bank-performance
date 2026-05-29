
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RotateCcw, Save, Trash2, BookOpen, Timer as TimerIcon, Zap, Clock, Play, Pause, Activity, Target
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, deleteDoc, collection, query, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
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
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  
  const timerRef = useRef<any>(null);

  // Cloud Sync Logic
  const logsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users', user.uid, 'accuracyLogs'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);
  
  const { data: cloudLogs } = useCollection<AccuracyLog>(logsQuery);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("accuracy-logs");
    if (saved) {
      try { 
        setLocalLogs(JSON.parse(saved)); 
      } catch (e) { 
        console.error("Failed to parse local accuracy logs"); 
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Display logic: Prefer cloud logs if logged in, otherwise use local
  const displayLogs = user && cloudLogs.length > 0 ? cloudLogs : localLogs;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSaveLog = () => {
    if (time === 0) {
      toast({
        variant: "destructive",
        title: "Operational Failure",
        description: "Initiate timer before attempting to archive a practice unit.",
      });
      return;
    }
    if (!currentTopic) {
      toast({
        variant: "destructive",
        title: "Metadata Missing",
        description: "Specify an objective topic to secure this session in the vault.",
      });
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
    
    // 1. Optimistic Local Update
    const updated = [newLog, ...localLogs];
    setLocalLogs(updated);
    localStorage.setItem("accuracy-logs", JSON.stringify(updated));

    // 2. Cloud Uplink
    if (user && db) {
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', newLog.id);
      setDoc(logRef, { 
        ...newLog, 
        serverTimestamp: new Date() 
      }).catch(err => console.warn("Cloud Sync Delay:", err));
    }

    // 3. System Feedback
    logAuditAction("Performance", "Practice Archived", `${currentTopic} - ${formatTime(time)}`);
    toast({
      title: "Practice Unit Secured",
      description: `Tactical log for ${currentTopic} added to Hybrid Vault.`,
    });
    
    // Reset Terminal State
    setTime(0); 
    setIsActive(false); 
    setCurrentTopic("");
    setCorrect("");
    setWrong("");
  };

  const deleteLog = (id: string) => {
    const updated = localLogs.filter(l => l.id !== id);
    setLocalLogs(updated);
    localStorage.setItem("accuracy-logs", JSON.stringify(updated));

    if (user && db) {
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', id);
      deleteDoc(logRef).catch(err => console.warn("Cloud Delete Delay:", err));
    }

    logAuditAction("Performance", "Log Purged", "Practice unit removed from archives.");
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
      {/* Precision Control Terminal */}
      <Card className="xl:col-span-4 bento-card border-none shadow-2xl bg-card/60 backdrop-blur-3xl h-fit xl:sticky xl:top-32">
        <CardHeader className="bg-primary/5 p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <TimerIcon className="w-6 h-6" />
             </div>
             <div>
                <CardTitle className="text-xl font-headline font-bold tracking-tight">Precision Terminal</CardTitle>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary opacity-80 mt-1">Status: {isActive ? "Recording" : "Standby"}</div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 dark:bg-white/5 rounded-[2rem] shadow-inner border border-white/5">
             <div className="text-6xl font-headline font-black text-foreground tracking-tighter tabular-nums mb-4">
               {formatTime(time)}
             </div>
             <div className="flex items-center gap-3 px-4 py-1.5 bg-accent/40 rounded-full border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-muted-foreground'}`} />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isActive ? "Executing" : "Idle"}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Category</label>
              <Select value={currentSubject} onValueChange={(v) => setCurrentSubject(v)}>
                <SelectTrigger className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl font-bold">
                  <SelectItem value="Reasoning">Reasoning</SelectItem>
                  <SelectItem value="Quants">Quantitative Aptitude</SelectItem>
                  <SelectItem value="English">English Language</SelectItem>
                  <SelectItem value="GA">General Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Objective Topic</label>
              <Input 
                placeholder="e.g. Circular Arrangement Set 1" 
                value={currentTopic} 
                onChange={(e) => setCurrentTopic(e.target.value)} 
                className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-1">Correct Hits</label>
                <Input 
                  type="number"
                  placeholder="Optional" 
                  value={correct} 
                  onChange={(e) => setCorrect(e.target.value)} 
                  className="rounded-xl h-12 bg-emerald-500/5 border-emerald-500/20 font-bold shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-destructive ml-1">Wrong Hits</label>
                <Input 
                  type="number"
                  placeholder="Optional" 
                  value={wrong} 
                  onChange={(e) => setWrong(e.target.value)} 
                  className="rounded-xl h-12 bg-destructive/5 border-destructive/20 font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <button 
                onClick={() => setIsActive(!isActive)}
                className={`flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 ${isActive ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
             >
                <div className="flex items-center justify-center gap-2">
                  {isActive ? <><Pause className="w-4 h-4" /> Stop Session</> : <><Play className="w-4 h-4" /> Start Unit</>}
                </div>
             </button>
             <button 
                onClick={() => {setIsActive(false); setTime(0);}}
                className="w-14 h-14 rounded-2xl border-2 border-border/40 hover:bg-accent flex items-center justify-center transition-all active:rotate-180"
             >
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
             </button>
          </div>

          <button 
            onClick={handleSaveLog}
            className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Archive to Vault
          </button>
        </CardContent>
      </Card>

      {/* Accuracy Vault Logs */}
      <Card className="xl:col-span-8 bento-card border-none shadow-2xl bg-card/40 backdrop-blur-3xl">
        <CardHeader className="bg-accent/5 p-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <BookOpen className="w-5 h-5" />
               </div>
               <div>
                  <CardTitle className="text-xl font-headline font-bold">Practice Archives</CardTitle>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 mt-1">Operational History</div>
               </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-primary/5 rounded-xl border border-primary/10">
               <Activity className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">{displayLogs.length} Records</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {displayLogs.length > 0 ? (
            <div className="space-y-4">
              {displayLogs.map((log) => {
                const total = (log.correct || 0) + (log.wrong || 0);
                const accuracy = total > 0 ? Math.round((log.correct! / total) * 100) : null;
                
                return (
                  <div key={log.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/40 transition-all duration-500 shadow-md">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700">
                        {log.subject === 'Quants' ? <Zap className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                      </div>
                      <div>
                        <div className="font-black text-xl tracking-tight text-foreground">{log.topic}</div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest bg-accent/30 px-3 py-1 rounded-lg">{log.date}</span>
                          <span className="text-[9px] text-primary font-black uppercase tracking-widest">{log.subject}</span>
                          {accuracy !== null && (
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${accuracy >= 85 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {accuracy}% Precision
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="w-5 h-5 opacity-30" />
                          <span className="font-headline font-black text-3xl tracking-tighter tabular-nums">{formatTime(log.time)}</span>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 opacity-50">Log Time</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteLog(log.id)} 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-12 w-12 transition-all rounded-xl hover:bg-destructive/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center">
               <TimerIcon className="w-16 h-16 mb-8 opacity-10" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">Vault Empty: Log Session to Begin</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
