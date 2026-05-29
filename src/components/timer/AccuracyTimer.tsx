
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
      try { setLocalLogs(JSON.parse(saved)); } catch (e) { console.error("Failed to parse local accuracy logs"); }
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

  const displayLogs = user ? (cloudLogs || []) : localLogs;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSaveLog = () => {
    if (!currentTopic || time === 0) return;
    
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
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', newLog.id);
      setDoc(logRef, { 
        ...newLog, 
        serverTimestamp: new Date() 
      }).catch(err => console.warn("Cloud Sync Delay:", err));
    }

    logAuditAction("Performance", "Practice Archived", `${currentTopic} - ${formatTime(time)}`);
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
                <CardTitle className="text-xl font-headline font-black tracking-tight">Precision Terminal</CardTitle>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary opacity-80 mt-1">Status: Active Unit</div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50/50 dark:bg-white/5 rounded-3xl shadow-inner border border-white/5">
             <div className="text-5xl font-headline font-black text-foreground tracking-tighter tabular-nums mb-3">
               {formatTime(time)}
             </div>
             <div className="flex items-center gap-3 px-3 py-1 bg-accent/40 rounded-full border border-white/10">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-muted-foreground'}`} />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{isActive ? "Executing" : "Standby"}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
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
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Objective</label>
              <Input 
                placeholder="e.g. Mixed Puzzle Set B" 
                value={currentTopic} 
                onChange={(e) => setCurrentTopic(e.target.value)} 
                className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-emerald-500 ml-1">Correct Hits</label>
                <Input 
                  type="number"
                  placeholder="Optional" 
                  value={correct} 
                  onChange={(e) => setCorrect(e.target.value)} 
                  className="rounded-xl h-12 bg-emerald-500/5 border-emerald-500/20 font-bold shadow-inner"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-destructive ml-1">Wrong Hits</label>
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

          <div className="flex gap-3">
             <Button 
                onClick={() => setIsActive(!isActive)}
                className={`flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary/90'}`}
             >
                {isActive ? <><Pause className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Engage</>}
             </Button>
             <Button 
                variant="outline" 
                onClick={() => {setIsActive(false); setTime(0);}}
                className="w-14 h-14 rounded-2xl border-2 hover:bg-accent transition-all active:rotate-180"
             >
                <RotateCcw className="w-5 h-5" />
             </Button>
          </div>

          <Button 
            disabled={time === 0 || !currentTopic}
            onClick={handleSaveLog}
            className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl disabled:opacity-30"
          >
            <Save className="w-4 h-4 mr-2" /> Archive to Vault
          </Button>
        </CardContent>
      </Card>

      {/* Accuracy Vault Logs */}
      <Card className="xl:col-span-8 bento-card border-none shadow-2xl bg-card/40 backdrop-blur-3xl">
        <CardHeader className="bg-accent/5 p-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <BookOpen className="w-5 h-5" />
               </div>
               <div>
                  <CardTitle className="text-xl font-headline font-bold">Mission Vault</CardTitle>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 mt-1">Intelligence History</div>
               </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
               <Activity className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">{displayLogs.length} Units Archived</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {displayLogs.length > 0 ? (
            <div className="space-y-4">
              {displayLogs.map((log) => {
                const total = (log.correct || 0) + (log.wrong || 0);
                const accuracy = total > 0 ? Math.round((log.correct! / total) * 100) : null;
                
                return (
                  <div key={log.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/40 transition-all duration-500 shadow-lg">
                    <div className="flex items-center gap-5 mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700">
                        {log.subject === 'Quants' ? <Zap className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-black text-lg tracking-tight text-foreground">{log.topic}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest bg-accent/30 px-2 py-0.5 rounded-md">{log.date}</span>
                          <span className="text-[8px] text-primary font-black uppercase tracking-widest">{log.subject}</span>
                          {accuracy !== null && (
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${accuracy >= 85 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {accuracy}% Accuracy
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2 text-primary">
                          <Clock className="w-4 h-4 opacity-30" />
                          <span className="font-headline font-black text-2xl tracking-tighter tabular-nums">{formatTime(log.time)}</span>
                        </div>
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 opacity-50">Operational Time</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteLog(log.id)} 
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-10 w-10 transition-all rounded-xl hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
               <TimerIcon className="w-12 h-12 mb-6 opacity-10" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">Vault is Empty: Initiate Protocol</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
