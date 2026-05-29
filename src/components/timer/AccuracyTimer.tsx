"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RotateCcw, Save, Trash2, BookOpen, Timer as TimerIcon, Zap, Clock, Play, Pause
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
      {/* Precision Control Terminal */}
      <Card className="xl:col-span-4 bento-card border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] bg-card/60 backdrop-blur-3xl h-fit xl:sticky xl:top-32">
        <CardHeader className="bg-primary/5 p-10 border-b border-white/5">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <TimerIcon className="w-10 h-10" />
             </div>
             <div>
                <CardTitle className="text-3xl font-headline font-black tracking-tight">Precision Terminal</CardTitle>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-primary opacity-80 mt-1">Status: Active Unit</div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 dark:bg-white/5 rounded-[3rem] shadow-inner border border-white/5">
             <div className="text-8xl xl:text-9xl font-headline font-black text-foreground tracking-tighter tabular-nums mb-4">
               {formatTime(time)}
             </div>
             <div className="flex items-center gap-4 px-6 py-2 bg-accent/40 rounded-full border border-white/10 shadow-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]' : 'bg-muted-foreground'}`} />
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{isActive ? "Unit in Execution" : "Standby Protocol"}</span>
             </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Mission Subject</label>
              <Select value={currentSubject} onValueChange={(v) => setCurrentSubject(v)}>
                <SelectTrigger className="rounded-2xl h-16 bg-accent/30 border-none font-bold text-lg shadow-inner focus:ring-4 ring-primary/10 transition-all"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-[1.5rem] border-none shadow-2xl font-bold">
                  <SelectItem value="Reasoning" className="py-4 text-base">Reasoning</SelectItem>
                  <SelectItem value="Quants" className="py-4 text-base">Quantitative Aptitude</SelectItem>
                  <SelectItem value="English" className="py-4 text-base">English Language</SelectItem>
                  <SelectItem value="GA" className="py-4 text-base">General Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Tactical Objective</label>
              <Input 
                placeholder="e.g. Mixed Puzzle Set B" 
                value={currentTopic} 
                onChange={(e) => setCurrentTopic(e.target.value)} 
                className="rounded-2xl h-16 bg-accent/30 border-none font-bold text-lg shadow-inner focus:ring-4 ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-6">
             <Button 
                onClick={() => setIsActive(!isActive)}
                className={`flex-1 h-20 rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 ${isActive ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-primary hover:bg-primary/90 shadow-primary/30'}`}
             >
                {isActive ? <><Pause className="w-6 h-6 mr-3" /> Stop Unit</> : <><Play className="w-6 h-6 mr-3" /> Engage</>}
             </Button>
             <Button 
                variant="outline" 
                onClick={() => {setIsActive(false); setTime(0);}}
                className="w-20 h-20 rounded-3xl border-4 hover:bg-accent transition-all active:rotate-180 shadow-lg"
             >
                <RotateCcw className="w-8 h-8" />
             </Button>
          </div>

          <Button 
            disabled={time === 0 || !currentTopic}
            onClick={handleSaveLog}
            className="w-full h-20 rounded-3xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-emerald-500/30 transition-all disabled:opacity-30"
          >
            <Save className="w-6 h-6 mr-3" /> Archive to Vault
          </Button>
        </CardContent>
      </Card>

      {/* Accuracy Vault Logs */}
      <Card className="xl:col-span-8 bento-card border-none shadow-2xl bg-card/40 backdrop-blur-3xl">
        <CardHeader className="bg-accent/5 p-10 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <BookOpen className="w-8 h-8" />
               </div>
               <div>
                  <CardTitle className="text-3xl font-headline font-black tracking-tight">Mission Vault</CardTitle>
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 mt-1">Precision Intelligence History</div>
               </div>
            </div>
            <div className="flex items-center gap-5 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
               <Activity className="w-5 h-5 text-primary" />
               <span className="text-xs font-black uppercase tracking-widest text-primary">{displayLogs.length} Records Detected</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10 xl:p-14">
          {displayLogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {displayLogs.map((log) => (
                <div key={log.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-8 xl:p-10 rounded-[2.5rem] border-2 border-border/40 bg-card hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center gap-8 mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-[1.75rem] bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 shadow-inner">
                      {log.subject === 'Quants' ? <Zap className="w-10 h-10" /> : <BookOpen className="w-10 h-10" />}
                    </div>
                    <div>
                      <div className="font-black text-2xl xl:text-3xl tracking-tight text-foreground">{log.topic}</div>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] bg-accent/30 px-3 py-1 rounded-lg">{log.date}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <span className="text-xs text-primary font-black uppercase tracking-[0.2em]">{log.subject}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-12">
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-4 text-primary">
                        <Clock className="w-6 h-6 opacity-30" />
                        <span className="font-headline font-black text-4xl xl:text-5xl tracking-tighter tabular-nums">{formatTime(log.time)}</span>
                      </div>
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-50">Operational Duration</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteLog(log.id)} 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-14 w-14 transition-all rounded-2xl hover:bg-destructive/10 border-2 border-transparent hover:border-destructive/20"
                    >
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center flex flex-col items-center">
               <div className="w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center mb-10 opacity-30 shadow-inner">
                  <TimerIcon className="w-16 h-16" />
               </div>
               <p className="text-xs font-black uppercase tracking-[0.6em] text-muted-foreground/30">Vault is Empty: Initiate Protocol</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}