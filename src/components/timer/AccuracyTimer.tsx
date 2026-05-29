"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RotateCcw, Save, Trash2, BookOpen, Timer as TimerIcon, Zap, Clock, Play, Pause, Activity
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
      {/* Precision Control Terminal */}
      <Card className="xl:col-span-4 bento-card border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] bg-card/60 backdrop-blur-3xl h-fit xl:sticky xl:top-32">
        <CardHeader className="bg-primary/5 p-8 lg:p-10 border-b border-white/5">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <TimerIcon className="w-7 h-7" />
             </div>
             <div>
                <CardTitle className="text-2xl font-headline font-black tracking-tight">Precision Terminal</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-80 mt-1">Status: Active Unit</div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 lg:p-10 space-y-10">
          <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 dark:bg-white/5 rounded-[2.5rem] shadow-inner border border-white/5">
             <div className="text-6xl lg:text-7xl font-headline font-black text-foreground tracking-tighter tabular-nums mb-4">
               {formatTime(time)}
             </div>
             <div className="flex items-center gap-3 px-4 py-1.5 bg-accent/40 rounded-full border border-white/10 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-muted-foreground'}`} />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isActive ? "Executing" : "Standby"}</span>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Subject</label>
              <Select value={currentSubject} onValueChange={(v) => setCurrentSubject(v)}>
                <SelectTrigger className="rounded-xl h-14 bg-accent/30 border-none font-bold text-base shadow-inner focus:ring-4 ring-primary/10 transition-all"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl font-bold">
                  <SelectItem value="Reasoning" className="py-3">Reasoning</SelectItem>
                  <SelectItem value="Quants" className="py-3">Quantitative Aptitude</SelectItem>
                  <SelectItem value="English" className="py-3">English Language</SelectItem>
                  <SelectItem value="GA" className="py-3">General Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tactical Objective</label>
              <Input 
                placeholder="e.g. Mixed Puzzle Set B" 
                value={currentTopic} 
                onChange={(e) => setCurrentTopic(e.target.value)} 
                className="rounded-xl h-14 bg-accent/30 border-none font-bold text-base shadow-inner focus:ring-4 ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4">
             <Button 
                onClick={() => setIsActive(!isActive)}
                className={`flex-1 h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 ${isActive ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-primary hover:bg-primary/90 shadow-primary/30'}`}
             >
                {isActive ? <><Pause className="w-5 h-5 mr-2" /> Stop</> : <><Play className="w-5 h-5 mr-2" /> Engage</>}
             </Button>
             <Button 
                variant="outline" 
                onClick={() => {setIsActive(false); setTime(0);}}
                className="w-16 h-16 rounded-2xl border-2 hover:bg-accent transition-all active:rotate-180 shadow-lg"
             >
                <RotateCcw className="w-6 h-6" />
             </Button>
          </div>

          <Button 
            disabled={time === 0 || !currentTopic}
            onClick={handleSaveLog}
            className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/30 transition-all disabled:opacity-30"
          >
            <Save className="w-5 h-5 mr-2" /> Archive to Vault
          </Button>
        </CardContent>
      </Card>

      {/* Accuracy Vault Logs */}
      <Card className="xl:col-span-8 bento-card border-none shadow-2xl bg-card/40 backdrop-blur-3xl">
        <CardHeader className="bg-accent/5 p-8 lg:p-10 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <BookOpen className="w-6 h-6" />
               </div>
               <div>
                  <CardTitle className="text-2xl font-headline font-black tracking-tight">Mission Vault</CardTitle>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 mt-1">Intelligence History</div>
               </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-2.5 bg-primary/5 rounded-xl border border-primary/10">
               <Activity className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">{displayLogs.length} Records</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 lg:p-10">
          {displayLogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              {displayLogs.map((log) => (
                <div key={log.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 lg:p-8 rounded-[2rem] border-2 border-border/40 bg-card hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700 shadow-inner">
                      {log.subject === 'Quants' ? <Zap className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="font-black text-xl lg:text-2xl tracking-tight text-foreground">{log.topic}</div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] bg-accent/30 px-2 py-0.5 rounded-md">{log.date}</span>
                        <div className="w-1 h-1 rounded-full bg-primary/40" />
                        <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{log.subject}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-3 text-primary">
                        <Clock className="w-5 h-5 opacity-30" />
                        <span className="font-headline font-black text-3xl lg:text-4xl tracking-tighter tabular-nums">{formatTime(log.time)}</span>
                      </div>
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1 opacity-50">Duration</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteLog(log.id)} 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-12 w-12 transition-all rounded-xl hover:bg-destructive/10 border-2 border-transparent hover:border-destructive/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center">
               <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mb-8 opacity-30 shadow-inner">
                  <TimerIcon className="w-12 h-12" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">Vault is Empty: Initiate Protocol</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}